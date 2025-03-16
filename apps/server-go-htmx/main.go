package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type ResponseMessage struct {
	Msg string `json:"msg"`
}

func main() {
	log.Fatal(server(":5003"))
}

// server.go
func server(addr string) error {
	router := http.NewServeMux()
	router.Handle("/api/v1/", http.StripPrefix("/api/v1", projectsRouter()))
	router.HandleFunc("/", NotFoundHandler)

	apiServer := http.Server{
		Addr:    addr,
		Handler: router,
	}
	fmt.Println("Server is running on http://localhost" + addr)
	return apiServer.ListenAndServe()
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	url := fmt.Sprintf("%s://%s%s", scheme, r.Host, r.URL.Path)

	w.WriteHeader(http.StatusNotFound)
	json.NewEncoder(w).Encode(map[string]any{
		"Msg": "NotFound - " + url})
}
