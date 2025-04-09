package api

import (
	pHttp "github.com/spfave/projects-build/apps/server-go-htmx/pkg/http_utils"
)

func apiDemos() *pHttp.Router {
	router := pHttp.NewRouter()
	router.HandleFunc("/error", pHttp.HandlerError)
	router.HandleNotFound()

	return router
}
