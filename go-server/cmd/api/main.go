package main

import (
	"flag"
	"fmt"
	"log"

	"github.com/spfave/projects-build/apps/server-go/internal/api"
)

func main() {
	port := flag.Int("port", 5003, "port to run API server on")
	flag.Parse()

	app := api.New(*port)

	fmt.Printf("Server is running on http://localhost:%d\n", app.Port)
	err := app.Run()
	if err != nil {
		log.Fatal("Error in API Server execution", err)
	}
}
