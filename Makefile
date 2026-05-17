# ============================================
# Pesantren Tursina Alam — Project Makefile
# Quick commands for development & production
# ============================================

.PHONY: help up down build logs restart deploy backup restore health migrate seed clean

# Default
help: ## Show available commands
	@echo "═══════════════════════════════════════════"
	@echo " Pesantren Tursina Alam — Commands"
	@echo "═══════════════════════════════════════════"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ── Docker Compose ──
up: ## Start all services
	docker compose up -d

down: ## Stop all services
	docker compose down

build: ## Build all Docker images
	docker compose build --no-cache

restart: ## Restart all services
	docker compose restart

logs: ## Tail all service logs
	docker compose logs -f --tail=100

logs-backend: ## Tail backend logs
	docker compose logs -f backend

logs-nginx: ## Tail nginx logs
	docker compose logs -f nginx

# ── Development ──
dev-backend: ## Start backend in dev mode
	cd backend && go run ./cmd/server

dev-frontend: ## Start frontend dev server
	cd frontend && npm run dev

# ── Database ──
migrate: ## Run database migrations
	./scripts/migrate.sh

seed: ## Run migrations + seeder
	./scripts/migrate.sh --seed

backup: ## Create database backup
	./scripts/backup-db.sh

restore: ## Restore from latest backup
	./scripts/restore-db.sh

# ── Deployment ──
deploy: ## Full production deploy
	./scripts/deploy.sh

deploy-backend: ## Deploy backend only
	./scripts/deploy.sh --backend

deploy-frontend: ## Deploy frontend only
	./scripts/deploy.sh --frontend

# ── Monitoring ──
health: ## Check service health
	./scripts/healthcheck.sh

status: ## Show Docker container status
	docker compose ps

stats: ## Show container resource usage
	docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# ── Maintenance ──
clean: ## Remove unused Docker resources
	docker system prune -f
	docker image prune -f

ssl: ## Setup SSL certificates
	sudo ./scripts/setup-ssl.sh

# ── Quick Setup ──
setup: ## Initial project setup
	cp .env.example .env
	mkdir -p logs/{backend,nginx,system} backups/postgres storage/uploads/{photos,documents,invoices,leaves} nginx/ssl
	@echo "✓ Setup complete! Edit .env with your production values."
