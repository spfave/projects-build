package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type ResponseMessage struct {
	Msg string `json:"message"`
}

func main() {
	// err := server(":5003").ListenAndServe()
	apiServer := NewApiServer(5003)

	fmt.Printf("P Server is running on http://localhost:%d\n", apiServer.port)
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

	// server := &http.Server{
	// 	Addr:    fmt.Sprintf(":%d", apiServer.port),
	// 	Handler: apiServer.RegisterHandlers(),
	// }

	// return server
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

// func server(addr string) *http.Server {
// 	router := http.NewServeMux()
// 	router.Handle("/api/v1/", http.StripPrefix("/api/v1", projectsRouter()))
// 	router.HandleFunc("/error", handleError)
// 	router.HandleFunc("/", handleNotFound)

// 	apiServer := &http.Server{
// 		Addr:    addr,
// 		Handler: router,
// 	}
// 	fmt.Println("Server is running on http://localhost" + addr)
// 	return apiServer
// }

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
