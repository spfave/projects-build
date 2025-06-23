# Ref: https://www.alexedwards.net/blog/a-time-saving-makefile-for-your-go-projects
# Ref: https://www.alexedwards.net/blog/how-to-manage-tool-dependencies-in-go-1.24-plus

# ---------------------------------------------------------------------------------------
# DEVELOPMENT

##
start: run-local

## Run the application using air for live reloading.
run-local:
	air -c .air.toml

## Build the api application
build-api:
	go build -o bin/api ./cmd/api


# ---------------------------------------------------------------------------------------
# CHECKS

## Audit checks
audit:
	go mod tidy -diff
	go mod verify

## Format code
format:
	gofmt -w -s- d .

## Lint code
lint:
	go vet ./...
	go tool golint ./...


# ---------------------------------------------------------------------------------------
# MAINTENANCE

## Tidy modfiles
tidy:
	go mod tidy -v -x

## Check if dependencies are up to date
updateable:
	go list -m -u all

## Update tools
update-tools:
	go get tool