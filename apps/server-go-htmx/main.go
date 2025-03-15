package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// ref: https://github.com/dreamsofcode-io/nethttp
func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(struct {
			Msg string `json:"msg"`
		}{Msg: "hello world"})
	})

	fmt.Println("Server starting on http://localhost:5003")
	http.ListenAndServe(":5003", nil)
}
