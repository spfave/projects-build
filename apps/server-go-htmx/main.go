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
	log.Fatal(server(":5003"))
}

// server.go
func server(addr string) error {
	router := http.NewServeMux()
	router.Handle("/api/v1/", http.StripPrefix("/api/v1", projectsRouter()))
	router.HandleFunc("/error", handleError)
	router.HandleFunc("/", handleNotFound)

	apiServer := http.Server{
		Addr:    addr,
		Handler: router,
	}
	fmt.Println("Server is running on http://localhost" + addr)
	return apiServer.ListenAndServe()
}

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
