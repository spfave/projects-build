package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func main() {
	apiServer := NewApiServer(5003)

	fmt.Printf("Server is running on http://localhost:%d\n", apiServer.port)
	err := apiServer.Run()
	if err != nil {
		log.Fatal("Error in API Server execution", err)
	}
}

// apiServer.go
type ApiServer struct {
	port int
}

func NewApiServer(port int) *ApiServer {
	apiServer := &ApiServer{
		port: port,
	}
	return apiServer
}

func (apiServer *ApiServer) Run() error {
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", apiServer.port),
		Handler: apiServer.RegisterHandlers(),
	}

	return server.ListenAndServe()
}

func (apiServer *ApiServer) RegisterHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/api/v1/", http.StripPrefix("/api/v1", projectsRouter()))
	mux.HandleFunc("/error", handleError)
	mux.HandleFunc("/", handleNotFound)

	return mux
}

// httpUtil.go
func handleNotFound(w http.ResponseWriter, r *http.Request) {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	url := fmt.Sprintf("%s://%s%s", scheme, r.Host, r.URL.Path)

	w.WriteHeader(http.StatusNotFound)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"message": "Not Found - " + url,
	})
}

func handleError(w http.ResponseWriter, r *http.Request) {
	// http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
	w.WriteHeader(http.StatusInternalServerError)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"message": "An Error Occurred",
	})
}
