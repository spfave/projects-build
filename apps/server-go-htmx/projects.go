package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

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
	json.NewEncoder(w).Encode(ResponseMessage{Msg: "All Projects"})
}

func getProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseMessage{Msg: "Project with Id " + projectId})
}

func createProject(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseMessage{Msg: "Project created"})
}

func updateProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseMessage{
		Msg: fmt.Sprintf("Project %s updated", projectId),
	})
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ResponseMessage{
		Msg: fmt.Sprintf("Project %s deleted", projectId),
	})
}
