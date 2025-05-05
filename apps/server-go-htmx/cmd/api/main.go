package main

import (
	"fmt"
	"log"

	"github.com/spfave/projects-build/apps/server-go-htmx/internal/api"
)

func main() {
	app := api.New(5003)

	fmt.Printf("Server is running on http://localhost:%d\n", app.Port)
	err := app.Run()
	if err != nil {
		log.Fatal("Error in API Server execution", err)
	}
}
