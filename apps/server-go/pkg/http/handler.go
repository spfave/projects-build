package http_pkg

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

type RouteHandler func(w http.ResponseWriter, r *http.Request) *HttpError

func (rh RouteHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := rh(w, r); err != nil {
		slog.Error("An error occurred", "error", err, "path", r.URL.Path, "method", r.Method)

		if err.StatusCode >= 400 && err.StatusCode < 500 {
			RespondJson(w, err.StatusCode, JSendFail(err.Message, nil), nil)
		} else {
			RespondJsonError(w, err.StatusCode, JSendError(err.Message, nil, nil))
		}
	}
}

func MakeHandler(rh RouteHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := rh(w, r); err != nil {
			slog.Error("An error occurred", "error", err, "path", r.URL.Path, "method", r.Method)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}
}

func HandlerNotFound(w http.ResponseWriter, r *http.Request) {
	JsonEncode(w, http.StatusNotFound, EnvelopeMessage{
		Message: "Not Found - " + RequestFullUrl(r),
	})
}

func HandlerError(w http.ResponseWriter, r *http.Request) {
	// http.Error(w, "error handled", http.StatusInternalServerError)
	JsonEncode(w, http.StatusInternalServerError, EnvelopeMessage{
		Message: "An Error Occurred",
	})
}

// ----------------------------------------------------------------------------------- //
// REQUEST/RESPONSE UTILS

func RequestParam(r *http.Request, name string) (string, error) {
	p := r.PathValue(name)
	if p == "" {
		return *new(string), fmt.Errorf("request param - param '%s' is empty", name)
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
		return *new(int), fmt.Errorf("request param - param '%s' is not a valid integer: %w", name, err)
	}
	return pInt, nil
}

func RequestFullUrl(r *http.Request) string {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s%s", scheme, r.Host, r.URL.RequestURI())
}

// func RespondJson(w http.ResponseWriter, status int, data JSend, headers http.Header) {
func RespondJson[T any](w http.ResponseWriter, status int, data T, headers http.Header) {
	err := JsonMarshal(w, status, data, headers)
	if err != nil {
		// RespondJsonError(w, http.StatusInternalServerError, EnvelopeMessage{Message: err.Error()})
		RespondJsonError(w, http.StatusInternalServerError, JSendError("An error occurred", Envelope{"errors": err.Error()}, nil))
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
// ERRORS

type HttpError struct {
	Message    string
	Cause      error
	StatusCode int
}

func (err *HttpError) Error() string {
	return err.Message
	// return fmt.Sprintf("Status: %d %s, Message: %s", err.StatusCode, http.StatusText(err.StatusCode), err.Message)
}

func (err *HttpError) Unwrap() error {
	return err.Cause
}
