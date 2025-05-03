package http_utils

import (
	"fmt"
	"net/http"
)

// ----------------------------------------------------------------------------------- //
// HTTP ROUTER

type Router struct{ http.ServeMux }

func NewRouter() *Router {
	return &Router{}
}

func (router *Router) HandleNotFound() {
	router.HandleFunc("/", HandlerNotFound)
}

func (router *Router) HandleSubroute(pattern string, handler http.Handler) {
	router.Handle(pattern+"/", http.StripPrefix(pattern, handler))
}

// ----------------------------------------------------------------------------------- //
// ROUTE HANDLERS
func HandlerNotFound(w http.ResponseWriter, r *http.Request) {
	JsonEncode(w, http.StatusNotFound, map[string]any{
		"message": "Not Found - " + FullRequestUrl(r),
	})
}

func HandlerError(w http.ResponseWriter, r *http.Request) {
	// http.Error(w, "error handled", http.StatusInternalServerError)
	JsonEncode(w, http.StatusInternalServerError, map[string]any{
		"message": "An Error Occurred",
	})
}

// ----------------------------------------------------------------------------------- //
func RespondJson[T any](w http.ResponseWriter, status int, data T, headers http.Header) {
	err := JsonMarshal(w, status, data, headers)
	if err != nil {
		RespondJsonError(w, http.StatusInternalServerError, err)
	}
}

func RespondJsonError(w http.ResponseWriter, status int, data any) {
	err := JsonMarshal(w, status, data, nil)
	if err != nil {
		slog.Error("An error occurred", "error", err)
		w.WriteHeader(http.StatusInternalServerError)
	}
}

// ----------------------------------------------------------------------------------- //
func FullRequestUrl(r *http.Request) string {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s%s", scheme, r.Host, r.URL.Path)
}
