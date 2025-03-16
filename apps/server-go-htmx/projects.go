package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func projectsRouter() *http.ServeMux {
	router := http.NewServeMux()
	router.HandleFunc("GET /projects", GetAllProjects)
	router.HandleFunc("GET /projects/{id}", GetProjectById)
	router.HandleFunc("POST /projects", CreateProject)
	router.HandleFunc("PUT /projects/{id}", UpdateProjectById)
	router.HandleFunc("DELETE /projects/{id}", DeleteProject)

	return router
}

func GetAllProjects(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(ResponseMessage{Msg: "All Projects"})
}

func GetProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	json.NewEncoder(w).Encode(ResponseMessage{Msg: "Project with Id " + projectId})
}

func CreateProject(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ResponseMessage{Msg: "Project created"})
}

func UpdateProjectById(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	json.NewEncoder(w).Encode(ResponseMessage{
		Msg: fmt.Sprintf("Project %s updated", projectId)})
}

func DeleteProject(w http.ResponseWriter, r *http.Request) {
	projectId := r.PathValue("id")
	json.NewEncoder(w).Encode(ResponseMessage{
		Msg: fmt.Sprintf("Project %s deleted", projectId)})
}
