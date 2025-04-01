package web

import (
	"fmt"
	"net/http"
)

type Router struct{ *http.ServeMux }

func NewRouter() *Router {
	return &Router{}
}

func (router *Router) HandleSubroute(pattern string, handler http.Handler) {
	router.Handle(pattern+"/", http.StripPrefix(pattern, handler))
}

func HandleNotFound(w http.ResponseWriter, r *http.Request) {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	url := fmt.Sprintf("%s://%s%s", scheme, r.Host, r.URL.Path)

	JsonEncode(w, http.StatusNotFound, map[string]any{
		"message": "Not Found - " + url,
	})
}

func HandleError(w http.ResponseWriter, r *http.Request) {
	// http.Error(w, "error handled", http.StatusInternalServerError)
	JsonEncode(w, http.StatusInternalServerError, map[string]any{
		"message": "An Error Occurred",
	})
}
