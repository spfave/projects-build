package api

import (
	"fmt"
	"net/http"

	"github.com/spfave/projects-build/apps/server-go/internal/core"
	"github.com/spfave/projects-build/apps/server-go/internal/store"
	pErr "github.com/spfave/projects-build/apps/server-go/pkg/errors"
	pHttp "github.com/spfave/projects-build/apps/server-go/pkg/http"
)

func projectsRouter() *pHttp.Router {
	router := pHttp.NewRouter()
	router.HandleFunc("GET /projects", getAllProjects)
	router.Handle("GET /projects-handler", pHttp.RouteHandler(handlerGetAllError))
	router.HandleFunc("GET /projects/{id}", getProjectById)
	router.HandleFunc("POST /projects", createProject)
	router.HandleFunc("PUT /projects/{id}", updateProjectById)
	router.HandleFunc("DELETE /projects/{id}", deleteProject)
	router.HandleNotFound()

	return router
}

var (
	projectRepo = store.ProjectMemStr
	// projectRepo2 = store.ProjectSqliteStr
)

func getAllProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := projectRepo.GetAll()
	// projects, err := store.GetAll()
	if err != nil {
		pHttp.RespondJsonError(w, http.StatusInternalServerError, pHttp.JSendError(
			"error getting all projects",
			pHttp.Envelope{"cause": err.Error()},
			nil))
		return
	}

	pHttp.RespondJson(w, http.StatusOK, projects, nil)
	// pHttp.RespondJson(w, http.StatusOK, pHttp.JSendSuccess(pHttp.Envelope{"projects": projects}), nil)
}

// note: variant returning error, handled by pHttp.RouteHandler attached .ServeHTTP method
func handlerGetAllError(w http.ResponseWriter, r *http.Request) *pHttp.HttpError {
	projects, err := projectRepo.GetAll()

	if err != nil {
		return &pHttp.HttpError{
			StatusCode: http.StatusBadRequest,
			Message:    "error getting all projects",
			Cause:      err,
		}
	}

	pHttp.RespondJson(w, http.StatusOK, projects, nil)
	return nil
}

func getProjectById(w http.ResponseWriter, r *http.Request) {
	projectId, err := pHttp.RequestParam(r, "id")
	if err != nil {
		pHttp.RespondJson(w, http.StatusBadRequest, pHttp.JSendFail(err.Error(), nil), nil)
		return
	}

	project, err := projectRepo.GetById(projectId)
	if err != nil {
		switch err {
		case pErr.ErrNotFound:
			pHttp.RespondJson(w, http.StatusNotFound, pHttp.JSendFail("project not found", nil), nil)
		default:
			pHttp.RespondJsonError(w, http.StatusInternalServerError, pHttp.JSendError("error getting project", nil, nil))
		}
		return
	}

	pHttp.RespondJson(w, http.StatusOK, project, nil)
	// pHttp.RespondJson(w, http.StatusOK, pHttp.JSendSuccess(pHttp.Envelope{"project": project}), nil)
}

func createProject(w http.ResponseWriter, r *http.Request) {
	payload, err := pHttp.JsonDecode[core.ProjectInput](r)
	fmt.Printf("payload: %+v\n", payload) //LOG
	if err != nil {
		pHttp.RespondJson(w, http.StatusBadRequest, pHttp.JSendFail(
			"failed to parse json body ", pHttp.Envelope{"errors": err.Error()}), nil)
		return
	}

	validation := core.ValidateProject(&payload)
	fmt.Printf("validation: %+v\n", validation) //LOG
	if !validation.Success {
		pHttp.RespondJson(w, http.StatusUnprocessableEntity, pHttp.JSendFail(
			"invalid project", pHttp.Envelope{"errors": validation.Errors}), nil)
		return
	}

	projectPayload := core.TransformProject(&payload)
	project, err := projectRepo.Create(projectPayload)
	if err != nil {
		pHttp.RespondJsonError(w, http.StatusInternalServerError, pHttp.JSendError("error creating project", nil, nil))
	}

	pHttp.RespondJson(w, http.StatusCreated, project, nil)
}

func updateProjectById(w http.ResponseWriter, r *http.Request) {
	// 1. Parse data payload(s) from request
	projectId, err := pHttp.RequestParam(r, "id")
	if err != nil {
		pHttp.RespondJson(w, http.StatusBadRequest, pHttp.JSendFail(err.Error(), nil), nil)
		return
	}
	payload, err := pHttp.JsonDecode[core.ProjectInput](r)
	if err != nil {
		pHttp.RespondJson(w, http.StatusUnprocessableEntity, pHttp.JSendFail(
			"failed to parse json body ", pHttp.Envelope{"errors": err.Error()}), nil)
		return
	}

	// 2. Validate data payload(s)
	validation := core.ValidateProject(&payload)
	if !validation.Success {
		pHttp.RespondJson(w, http.StatusUnprocessableEntity, pHttp.JSendFail(
			"invalid project", pHttp.Envelope{"errors": validation.Errors}), nil)
		return
	}

	// 3. Parse data payload(s) into domain entity
	projectPayload := core.TransformProject(&payload)
	// 4. Execute service method
	project, err := projectRepo.Update(projectId, projectPayload)
	if err != nil {
		pHttp.RespondJsonError(w, http.StatusInternalServerError, pHttp.JSendError("error updating project", nil, nil))
	}

	// 5. Return response
	pHttp.RespondJson(w, http.StatusOK, project, nil)
}

func deleteProject(w http.ResponseWriter, r *http.Request) {
	projectId, err := pHttp.RequestParam(r, "id")
	if err != nil {
		pHttp.RespondJson(w, http.StatusBadRequest, pHttp.JSendFail(err.Error(), nil), nil)
		return
	}

	project, err := projectRepo.Delete(projectId)
	if err != nil {
		switch err {
		case pErr.ErrNotFound:
			pHttp.RespondJson(w, http.StatusNotFound, pHttp.JSendFail("project not found", nil), nil)
		default:
			pHttp.RespondJsonError(w, http.StatusInternalServerError, pHttp.JSendError("error deleting project", nil, nil))
		}
		return
	}

	pHttp.RespondJson(w, http.StatusOK, project, nil)
}
