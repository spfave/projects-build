package api

import (
	"fmt"
	"net/http"

	"github.com/spfave/projects-build/apps/server-go-htmx/pkg/web"
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
	router.HandleFunc("/", web.HandleNotFound)

	return router
}

func getAllProjects(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	web.JsonEncode(w, http.StatusOK, ResponseMessage{Msg: "All Projects"})
}

func getProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	web.JsonEncode(w, http.StatusOK, ResponseMessage{Msg: "Project with Id " + projectId})
}

func createProject(w http.ResponseWriter, r *http.Request) {
	payload, _ := web.JsonDecode[any](r)
	fmt.Printf("payload: %v\n", payload)
	web.JsonEncode(w, http.StatusCreated, ResponseMessage{Msg: "Project created"})
}

func updateProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	payload, _ := web.JsonDecode[any](r)
	fmt.Printf("projectId: %v\n", projectId)
	fmt.Printf("payload: %v\n", payload)
	web.JsonEncode(w, http.StatusOK, ResponseMessage{Msg: fmt.Sprintf("Project %s updated", projectId)})
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	web.JsonEncode(w, http.StatusOK, ResponseMessage{Msg: fmt.Sprintf("Project %s deleted", projectId)})
}
