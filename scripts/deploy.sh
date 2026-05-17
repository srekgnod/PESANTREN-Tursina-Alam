#!/bin/bash
# ============================================
# Pesantren Tursina Alam — Deployment Script
# Zero-downtime production deployment
# ============================================
# Usage:
#   ./scripts/deploy.sh              # Full deploy
#   ./scripts/deploy.sh --quick      # Quick restart (no rebuild)
#   ./scripts/deploy.sh --backend    # Backend only
#   ./scripts/deploy.sh --frontend   # Frontend only
# ============================================

set -euo pipefail

# ── Configuration ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="${PROJECT_DIR}/logs/system/deploy.log"
COMPOSE_FILE="${PROJECT_DIR}/docker-compose.yml"

# ── Functions ──
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error_exit() {
    log "ERROR: $1"
    exit 1
}

check_prerequisites() {
    command -v docker >/dev/null 2>&1 || error_exit "Docker not installed"
    command -v docker compose >/dev/null 2>&1 || error_exit "Docker Compose not installed"
    [ -f "$PROJECT_DIR/.env" ] || error_exit ".env file not found. Copy from .env.example"
}

pre_deploy_backup() {
    log "Creating pre-deploy database backup..."
    bash "$SCRIPT_DIR/backup-db.sh" 2>&1 | tail -5
}

pull_latest() {
    log "Pulling latest code..."
    cd "$PROJECT_DIR"
    git fetch origin
    git pull origin main
}

build_services() {
    local services="${1:-}"
    log "Building Docker images..."
    cd "$PROJECT_DIR"

    if [ -n "$services" ]; then
        docker compose -f "$COMPOSE_FILE" build --no-cache $services
    else
        docker compose -f "$COMPOSE_FILE" build --no-cache
    fi
}

deploy_services() {
    local services="${1:-}"
    log "Deploying services..."
    cd "$PROJECT_DIR"

    if [ -n "$services" ]; then
        docker compose -f "$COMPOSE_FILE" up -d --force-recreate $services
    else
        docker compose -f "$COMPOSE_FILE" up -d --force-recreate
    fi
}

run_migrations() {
    log "Running database migrations..."
    docker exec pesantren-backend ./server migrate 2>> "$LOG_FILE" || true
}

health_check() {
    log "Running health checks..."
    local max_retries=30
    local retry=0

    while [ $retry -lt $max_retries ]; do
        if docker exec pesantren-backend curl -sf http://localhost:8080/health > /dev/null 2>&1; then
            log "✓ Backend is healthy"
            return 0
        fi
        retry=$((retry + 1))
        sleep 2
    done

    log "WARNING: Backend health check failed after ${max_retries} retries"
    return 1
}

cleanup() {
    log "Cleaning up unused Docker resources..."
    docker image prune -f 2>/dev/null || true
    docker builder prune -f 2>/dev/null || true
}

# ── Main ──
mkdir -p "$(dirname "$LOG_FILE")"

log "========================================="
log "DEPLOYMENT STARTED"
log "Mode: ${1:-full}"
log "========================================="

check_prerequisites

case "${1:-full}" in
    --quick)
        log "Quick restart (no rebuild)..."
        docker compose -f "$COMPOSE_FILE" restart
        ;;
    --backend)
        pre_deploy_backup
        pull_latest
        build_services "backend"
        deploy_services "backend"
        run_migrations
        ;;
    --frontend)
        pull_latest
        build_services "frontend"
        deploy_services "frontend nginx"
        ;;
    *)
        pre_deploy_backup
        pull_latest
        build_services
        deploy_services
        run_migrations
        ;;
esac

# Post-deploy
health_check
cleanup

# ── Summary ──
log "========================================="
log "DEPLOYMENT COMPLETED"
log ""
log "Services status:"
docker compose -f "$COMPOSE_FILE" ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null | tee -a "$LOG_FILE"
log "========================================="
