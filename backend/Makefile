.PHONY: run build seed docker-up docker-down test swagger

# Development
run:
	go run cmd/server/main.go

# Build
build:
	go build -o bin/server cmd/server/main.go

# Seed database
seed:
	go run cmd/seeder/main.go

# Docker
docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f api

# Dependencies
deps:
	go mod tidy
	go mod download

# Swagger
swagger:
	swag init -g cmd/server/main.go -o docs

# Test
test:
	go test ./... -v -cover

# Lint
lint:
	golangci-lint run ./...

# Clean
clean:
	rm -rf bin/ logs/ docs/
