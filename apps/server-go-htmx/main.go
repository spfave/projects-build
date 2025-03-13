package main

import (
	"fmt"
	"net/http"
)

// ref: https://github.com/dreamsofcode-io/nethttp
func main() {
	// fmt.Println("Hello, World!")
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World!")
	})

	fmt.Println("Server starting on http://localhost:5003")
	http.ListenAndServe(":5003", nil)
}
