# Ref: https://www.alexedwards.net/blog/a-time-saving-makefile-for-your-go-projects
# Ref: https://www.alexedwards.net/blog/how-to-manage-tool-dependencies-in-go-1.24-plus
# Ref: https://dominicstpierre.com/blog/env-vars-go


# ---------------------------------------------------------------------------------------
# INIT

## Include .env file and make variables available in Makefile and apps
include ../../.env.local
export $(shell sed 's/=.*//' ../../.env.local)


# ---------------------------------------------------------------------------------------
# DEVELOPMENT

##
start: run-local-api

## Run the api application using air for live reloading.
run-local-api:
	air -c .air.toml

## Build the api application
build-api:
	go build -o bin/api ./cmd/api

## Run the web application
run-local-web:
	go run ./cmd/web


# ---------------------------------------------------------------------------------------
# CHECKS

## Audit checks
audit:
	go mod tidy -diff
	go mod verify
	go vet ./...
	lint

## Format code
format:
	gofmt -w -s .

## Lint code
lint:
	go tool staticcheck ./...


# ---------------------------------------------------------------------------------------
# MAINTENANCE

## Clean up build cache
clean:
	rm -rf bin

## Tidy modfiles
tidy:
	go mod tidy -v -x

## Check if new dependencies version are available
new-deps:
	go list -u -f '{{if (and (not (or .Main .Indirect)) .Update)}}{{.Path}}: {{.Version}} -> {{.Update.Version}}{{end}}' -m all

## Update all dependencies
update-deps:
	go get -u ./...

## Update tools
update-tools:
	go get tool