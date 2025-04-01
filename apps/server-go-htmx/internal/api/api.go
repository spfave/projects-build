package api

import (
	"fmt"
	"net/http"

	"github.com/spfave/projects-build/apps/server-go-htmx/pkg/web"
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
		Handler: apiServer.RegisterHandlers(),
	}

	return server.ListenAndServe()
}

func (apiServer *ApiServer) RegisterHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/api/v1/", http.StripPrefix("/api/v1", projectsRouter()))
	mux.HandleFunc("/error", web.HandleError)
	mux.HandleFunc("/", web.HandleNotFound)

	return mux
}
