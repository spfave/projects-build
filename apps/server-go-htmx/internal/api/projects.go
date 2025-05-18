package api

import (
	"crypto/rand"
	"fmt"
	"net/http"

	"github.com/spfave/projects-build/apps/server-go-htmx/internal/core"
	pHttp "github.com/spfave/projects-build/apps/server-go-htmx/pkg/http"
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
	projects := []core.Project{
		{
			Id:     rand.Text()[0:8],
			Name:   "Project 1",
			Status: core.ProjectStatusPlanning,
		},
		{
			Id:     rand.Text()[0:8],
			Name:   "Project 2",
			Status: core.ProjectStatusBuilding,
		},
	}
	// todo: handle err for getting all projects

	pHttp.RespondJson(w, http.StatusOK, projects, nil)
	// pHttp.RespondJson(w, http.StatusOK, pHttp.JSendSuccess(pHttp.Envelope{"projects": projects}), nil)
}

func getProjectById(w http.ResponseWriter, r *http.Request) {
	// projectId := r.PathValue("id")
	projectId, err := pHttp.RequestParam(r, "id")
	if err != nil {
		pHttp.RespondJson(w, http.StatusUnprocessableEntity, *pHttp.JSendFail(err.Error(), nil), nil)
		return
	}

	// todo: get project by id
	project := core.Project{
		Id:     projectId,
		Name:   "Project " + projectId,
		Status: core.ProjectStatusPlanning,
	}
	// todo: handle err for getting project by id

	pHttp.RespondJson(w, http.StatusOK, project, nil)
	// pHttp.RespondJson(w, http.StatusOK, pHttp.JSendSuccess(pHttp.Envelope{"project": project}), nil)
}

func createProject(w http.ResponseWriter, r *http.Request) {
	payload, err := pHttp.JsonDecode[core.ProjectInput](r)
	fmt.Printf("payload: %+v\n", payload) //LOG
	if err != nil {
		pHttp.RespondJson(w, http.StatusBadRequest, *pHttp.JSendFail(err.Error(), nil), nil)
		return
	}

	validation := core.ValidateProject(&payload)
	fmt.Printf("validation: %+v\n", validation) //LOG
	if !validation.Success {
		pHttp.RespondJson(w, http.StatusUnprocessableEntity, *pHttp.JSendFail(
			"invalid project input", pHttp.Envelope{"errors": validation.Errors}), nil)
		return
	}

	// todo: create project
	project := core.Project{
		Id:     rand.Text()[0:8],
		Name:   payload.Name,
		Status: payload.Status,
	}
	// todo: handle err for creating project

	pHttp.RespondJson(w, http.StatusCreated, project, nil)
}

func updateProjectById(w http.ResponseWriter, r *http.Request) {
	_, err := pHttp.RequestParam(r, "id")
	if err != nil {
		pHttp.RespondJson(w, http.StatusUnprocessableEntity, *pHttp.JSendFail(err.Error(), nil), nil)
		return
	}

	payload, err := pHttp.JsonDecode[core.Project](r)
	if err != nil {
		pHttp.RespondJson(w, http.StatusUnprocessableEntity, *pHttp.JSendFail(err.Error(), nil), nil)
		return
	}
	// todo: validate payload and handle err

	// todo: update project by id
	project := core.Project{
		Id:            payload.Id,
		Name:          payload.Name,
		Status:        payload.Status,
		Link:          payload.Link,
		Description:   payload.Description,
		Notes:         payload.Notes,
		DateCompleted: payload.DateCompleted,
		Rating:        payload.Rating,
		Recommend:     payload.Recommend,
	}
	// todo: handle err for updating project by id

	pHttp.RespondJson(w, http.StatusOK, project, nil)
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	projectId, err := pHttp.RequestParam(r, "id")
	if err != nil {
		pHttp.RespondJson(w, http.StatusUnprocessableEntity, *pHttp.JSendFail(err.Error(), nil), nil)
		return
	}

	// todo: delete project by id
	project := core.Project{
		Id:     projectId,
		Name:   "Project " + projectId + " deleted",
		Status: core.ProjectStatusPlanning,
	}
	// todo: handle err for deleting project by id

	pHttp.RespondJson(w, http.StatusOK, project, nil)
}
