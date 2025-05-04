package api

import (
	"fmt"
	"net/http"

	pHttp "github.com/spfave/projects-build/apps/server-go-htmx/pkg/http_utils"
)

func projectsRouter() *pHttp.Router {
	router := pHttp.NewRouter()
	router.HandleFunc("GET /projects", getAllProjects)
	router.HandleFunc("GET /projects/{id}", getProjectById)
	router.HandleFunc("POST /projects", createProject)
	router.HandleFunc("PUT /projects/{id}", updateProjectById)
	router.HandleFunc("DELETE /projects/{id}", deleteProject)
	router.HandleNotFound()

	return router
}

func getAllProjects(w http.ResponseWriter, r *http.Request) {
	// todo: get all projects
	pHttp.RespondJson(w, http.StatusOK, ResponseMessage{Msg: "All Projects"}, nil)
	// pHttp.RespondJson(w, http.StatusOK, pHttp.JSendSuccess(pHttp.Envelope{"projects": "All Projects"}), nil)
}

func getProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	// todo: get project by id
	pHttp.RespondJson(w, http.StatusOK, ResponseMessage{Msg: "Project with Id " + projectId}, nil)
}

func createProject(w http.ResponseWriter, r *http.Request) {
	payload, _ := pHttp.JsonDecode[any](r)
	fmt.Printf("payload: %v\n", payload)

	// todo: create project

	pHttp.JsonEncode(w, http.StatusCreated, ResponseMessage{Msg: "Project created"})
}

func updateProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	payload, _ := pHttp.JsonDecode[any](r)
	fmt.Printf("projectId: %v\n", projectId)
	fmt.Printf("payload: %v\n", payload)

	// todo: update project by id

	pHttp.JsonEncode(w, http.StatusOK, ResponseMessage{Msg: fmt.Sprintf("Project %s updated", projectId)})
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	// todo: delete project by id
	pHttp.RespondJson(w, http.StatusOK, ResponseMessage{Msg: fmt.Sprintf("Project %s deleted", projectId)}, nil)
}
