package http_utils

import (
	"fmt"
	"log/slog"
	"net/http"
	"strconv"
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
	JsonEncode(w, http.StatusNotFound, EnvelopeMessage{
		Message: "Not Found - " + FullRequestUrl(r),
	})
}

func HandlerError(w http.ResponseWriter, r *http.Request) {
	// http.Error(w, "error handled", http.StatusInternalServerError)
	JsonEncode(w, http.StatusInternalServerError, EnvelopeMessage{
		Message: "An Error Occurred",
	})
}

// ----------------------------------------------------------------------------------- //
func RequestParam(r *http.Request, name string) (string, error) {
	p := r.PathValue(name)
	if p == "" {
		return *new(string), fmt.Errorf("request param '%s' is empty", name)
	}
	return p, nil
}

func RequestParamInt(r *http.Request, name string) (int, error) {
	pStr, err := RequestParam(r, name)
	if err != nil {
		return *new(int), err
	}
	pInt, err := strconv.Atoi(pStr)
	if err != nil {
		return *new(int), fmt.Errorf("request param '%s' is not a valid integer: %w", name, err)
	}
	return pInt, nil
}

// ----------------------------------------------------------------------------------- //

// func RespondJson(w http.ResponseWriter, status int, data JSend, headers http.Header) {
func RespondJson[T any](w http.ResponseWriter, status int, data T, headers http.Header) {
	err := JsonMarshal(w, status, data, headers)
	if err != nil {
		// RespondJsonError(w, http.StatusInternalServerError, EnvelopeMessage{Message: err.Error()})
		RespondJsonError(w, http.StatusInternalServerError, *JSendError(err.Error(), nil, nil))
	}
}

// func RespondJsonError(w http.ResponseWriter, status int, data JSend) {
func RespondJsonError[T any](w http.ResponseWriter, status int, data T) {
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
	return fmt.Sprintf("%s://%s%s", scheme, r.Host, r.URL.RequestURI())
}
