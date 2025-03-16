package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type ResponseMessage struct {
	Msg string `json:"msg"`
}

func main() {
	http.HandleFunc("GET /projects", GetAllProjects)
	http.HandleFunc("GET /projects/{id}", GetProjectById)
	http.HandleFunc("POST /projects", CreateProject)
	http.HandleFunc("PUT /projects/{id}", UpdateProjectById)
	http.HandleFunc("DELETE /projects/{id}", DeleteProject)

	fmt.Println("Server starting on http://localhost:5003")
	log.Fatal(http.ListenAndServe(":5003", nil))
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
