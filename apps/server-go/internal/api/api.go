package api

import (
	"fmt"
	"net/http"

	"github.com/rs/cors"
	pHttp "github.com/spfave/projects-build/apps/server-go/pkg/http"
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
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // "http://127.0.0.1:3001"
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowCredentials: true,
	})

	server := &http.Server{
		Addr: fmt.Sprintf(":%d", apiServer.Port),
		// Handler: apiServer.RegisterRouteHandlers(), // no cors config
		// Handler: pHttp.CorsMiddleware(apiServer.RegisterRouteHandlers()), // diy cors middleware
		// Handler: cors.Default().Handler(apiServer.RegisterRouteHandlers()), // cors config default: GET & POST only
		Handler: c.Handler(apiServer.RegisterRouteHandlers()), // cors config custom
	}

	return server.ListenAndServe()
}

func (apiServer *ApiServer) RegisterRouteHandlers() http.Handler {
	router := pHttp.NewRouter()
	router.HandleSubroute("/api/v1", projectsRouter())
	router.HandleSubroute("/demos", apiDemos())
	router.HandleFunc("/", pHttp.HandlerNotFound)

	return router
}
