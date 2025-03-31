package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type ResponseMessage struct {
	Msg string `json:"message"`
}

func projectsRouter() *http.ServeMux {
	router := http.NewServeMux()
	router.HandleFunc("GET /projects", getAllProjects)
	router.HandleFunc("GET /projects/{id}", getProjectById)
	router.HandleFunc("POST /projects", createProject)
	router.HandleFunc("PUT /projects/{id}", updateProjectById)
	router.HandleFunc("DELETE /projects/{id}", deleteProject)

	return router
}

func getAllProjects(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	encodeJson(w, http.StatusOK, ResponseMessage{Msg: "All Projects"})
}

func getProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	encodeJson(w, http.StatusOK, ResponseMessage{Msg: "Project with Id " + projectId})
}

func createProject(w http.ResponseWriter, r *http.Request) {
	payload, _ := decodeJson[any](r)
	fmt.Printf("payload: %v\n", payload)
	encodeJson(w, http.StatusCreated, ResponseMessage{Msg: "Project created"})
}

func updateProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	payload, _ := decodeJson[any](r)
	fmt.Printf("projectId: %v\n", projectId)
	fmt.Printf("payload: %v\n", payload)
	encodeJson(w, http.StatusOK, ResponseMessage{Msg: fmt.Sprintf("Project %s updated", projectId)})
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	encodeJson(w, http.StatusOK, ResponseMessage{Msg: fmt.Sprintf("Project %s deleted", projectId)})
}

// httpUtil.go
func decodeJson[T any](r *http.Request) (T, error) {
	var data T
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		fmt.Print("failed to decode")
		return data, fmt.Errorf("failed to decode from json: %w", err)
	}
	return data, nil
}

func encodeJson[T any](w http.ResponseWriter, status int, data T) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		return fmt.Errorf("failed to encode to json: %w", err)
	}
	return nil
}
