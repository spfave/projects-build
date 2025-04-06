package api

import (
	"fmt"
	"net/http"

	pHttp "github.com/spfave/projects-build/apps/server-go-htmx/pkg/http_utils"
)

type ApiServer struct {
	Port int
}

func New(port int) *ApiServer {
	return &ApiServer{
		Port: port,
	}
}

func (apiServer *ApiServer) Run() error {
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", apiServer.Port),
		Handler: apiServer.RegisterRouteHandlers(),
	}

	return server.ListenAndServe()
}

func (apiServer *ApiServer) RegisterRouteHandlers() http.Handler {
	router := pHttp.NewRouter()
	router.HandleSubroute("/api/v1", projectsRouter())
	router.HandleFunc("/error", pHttp.HandlerError)
	router.HandleFunc("/", pHttp.HandlerNotFound)

	return router
}
