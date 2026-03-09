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
.PHONY: start
start: run-local-api

## Run the api application using air for live reloading.
.PHONY: run-local-api
run-local-api:
	air -c .air.toml

## Build the api application
.PHONY: build-api
build-api:
	rm -f ./bin/api
	go build -o ./bin/api ./cmd/api

## Build the api application for debugging
.PHONY: build-api-debug
build-api-debug:
	rm -f ./bin/api-debug
	CGO_ENABLED=0 go build -gcflags=all="-N -l" -o ./bin/api-debug ./cmd/api

## Run the web application
.PHONY: run-local-web
run-local-web:
	go run ./cmd/web


# ---------------------------------------------------------------------------------------
# CHECKS

## Audit checks
.PHONY: audit
audit:
	go mod tidy -diff
	go mod verify
	go vet ./...
	$(MAKE) lint

## Format code
.PHONY: format
format:
	gofmt -w -s .

## Lint code
.PHONY: lint
lint:
	go tool staticcheck ./...


# ---------------------------------------------------------------------------------------
# MAINTENANCE

## Clean up build directory
.PHONY: clean
clean:
	rm -rf bin

## Tidy modfiles
.PHONY: tidy
tidy:
	go mod tidy -v -x

## Check if new dependencies version are available
.PHONY: new-deps
new-deps:
	go list -u -f '{{if (and (not (or .Main .Indirect)) .Update)}}{{.Path}}: {{.Version}} -> {{.Update.Version}}{{end}}' -m all

## Update all dependencies
.PHONY: update-deps
update-deps:
	go get -u ./...

## Update tools
.PHONY: update-tools
update-tools:
	go get tool