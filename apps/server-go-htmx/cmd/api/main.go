package main

import (
	"fmt"
	"log"

	"github.com/spfave/projects-build/apps/server-go-htmx/internal/api"
)

func main() {
	api := api.New(5003)

	fmt.Printf("Server is running on http://localhost:%d\n", api.Port)
	err := api.Run()
	if err != nil {
		log.Fatal("Error in API Server execution", err)
	}
}
