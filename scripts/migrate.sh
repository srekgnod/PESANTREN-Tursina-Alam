#!/bin/bash
# ============================================
# Pesantren Tursina Alam — Migration Runner
# Run database migrations inside container
# ============================================
# Usage:
#   ./scripts/migrate.sh              # Run pending migrations
#   ./scripts/migrate.sh --seed       # Run migrations + seed
#   ./scripts/migrate.sh --status     # Check migration status
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

DB_USER="${DB_USER:-pesantren}"
DB_NAME="${DB_NAME:-pesantren_db}"
DB_CONTAINER="${DB_CONTAINER:-pesantren-postgres}"
BACKEND_CONTAINER="pesantren-backend"

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"; }

echo "========================================="
echo " Database Migration"
echo "========================================="

# Check containers
if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
    echo "ERROR: PostgreSQL container is not running!"
    exit 1
fi

case "${1:-migrate}" in
    --seed)
        log "Running migrations..."
        docker exec "$BACKEND_CONTAINER" ./server migrate 2>&1
        log "Running seeder..."
        docker exec "$BACKEND_CONTAINER" ./seeder 2>&1
        ;;
    --status)
        log "Checking migration status..."
        docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" \
            -c "SELECT * FROM schema_migrations ORDER BY version DESC LIMIT 10;" 2>/dev/null || \
            echo "No migration table found (run migrations first)"
        ;;
    *)
        log "Running migrations..."
        docker exec "$BACKEND_CONTAINER" ./server migrate 2>&1
        ;;
esac

log "Done!"
