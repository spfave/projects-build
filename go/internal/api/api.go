package api

import (
	"fmt"
	"net/http"

	"github.com/rs/cors"
	pHttp "github.com/spfave/projects-build/go/pkg/http"
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
		Handler: c.Handler(pHttp.ApplicationNameMiddleware(apiServer.RegisterRouteHandlers())), // cors config custom
	}

	return server.ListenAndServe()
}

type apiRouter struct{ *pHttp.Router }

func (apiServer *ApiServer) RegisterRouteHandlers() http.Handler {
	// router := pHttp.NewRouter()
	// registerProjectRouter(router)
	router := apiRouter{pHttp.NewRouter()}
	router.registerProjectRouter()
	router.HandleSubroute("/api/demos", demoRouter())
	router.HandleFunc("/", pHttp.NotFoundHandler)

	return router
}
