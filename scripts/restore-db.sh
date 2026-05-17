#!/bin/bash
# ============================================
# Pesantren Tursina Alam — Database Restore Script
# Restore from backup with safety checks
# ============================================
# Usage:
#   ./scripts/restore-db.sh                          # Restore latest
#   ./scripts/restore-db.sh backup_pesantren_20240101_020000.sql.gz  # Specific
# ============================================

set -euo pipefail

# ── Configuration ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

DB_USER="${DB_USER:-pesantren}"
DB_NAME="${DB_NAME:-pesantren_db}"
DB_CONTAINER="${DB_CONTAINER:-pesantren-postgres}"
BACKUP_DIR="${PROJECT_DIR}/backups/postgres"
LOG_FILE="${PROJECT_DIR}/logs/system/restore.log"

# ── Functions ──
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error_exit() {
    log "ERROR: $1"
    exit 1
}

# ── Determine backup file ──
mkdir -p "$(dirname "$LOG_FILE")"

if [ -n "${1:-}" ]; then
    BACKUP_FILE="$1"
    if [[ ! "$BACKUP_FILE" == /* ]]; then
        BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    fi
else
    # Find latest backup
    BACKUP_FILE=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | sort -r | head -n1)
    if [ -z "$BACKUP_FILE" ]; then
        error_exit "No backup files found in $BACKUP_DIR"
    fi
fi

if [ ! -f "$BACKUP_FILE" ]; then
    error_exit "Backup file not found: $BACKUP_FILE"
fi

log "========================================="
log "DATABASE RESTORE"
log "File: $(basename "$BACKUP_FILE")"
log "Database: $DB_NAME"
log "Container: $DB_CONTAINER"
log "========================================="

# ── Safety Confirmation ──
echo ""
echo "⚠️  WARNING: This will OVERWRITE the current database!"
echo "   Database: $DB_NAME"
echo "   Backup:   $(basename "$BACKUP_FILE")"
echo ""
read -p "Are you sure? Type 'YES' to confirm: " CONFIRM

if [ "$CONFIRM" != "YES" ]; then
    log "Restore cancelled by user."
    exit 0
fi

# ── Pre-restore: Create safety backup ──
log "Creating pre-restore safety backup..."
SAFETY_BACKUP="$BACKUP_DIR/pre_restore_$(date +%Y%m%d_%H%M%S).sql.gz"

docker exec -t "$DB_CONTAINER" \
    pg_dump -U "$DB_USER" -d "$DB_NAME" --format=custom --compress=9 \
    > "$SAFETY_BACKUP" 2>> "$LOG_FILE"

log "Safety backup created: $(basename "$SAFETY_BACKUP")"

# ── Stop backend service ──
log "Stopping backend service..."
docker stop pesantren-backend 2>/dev/null || true

# ── Restore ──
log "Starting restore..."

# Decompress if gzipped
RESTORE_FILE="$BACKUP_FILE"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    TEMP_FILE="/tmp/restore_$(date +%s).sql"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    RESTORE_FILE="$TEMP_FILE"
fi

# Drop and recreate database
docker exec -t "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '$DB_NAME' AND pid <> pg_backend_pid();
" 2>> "$LOG_FILE"

docker exec -t "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>> "$LOG_FILE"
docker exec -t "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>> "$LOG_FILE"

# Restore from backup
cat "$RESTORE_FILE" | docker exec -i "$DB_CONTAINER" pg_restore -U "$DB_USER" -d "$DB_NAME" --no-owner --no-privileges 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
    log "Restore completed successfully!"
else
    log "WARNING: Restore completed with warnings (check log)"
fi

# Cleanup temp file
[ -n "${TEMP_FILE:-}" ] && rm -f "$TEMP_FILE"

# ── Restart backend ──
log "Restarting backend service..."
docker start pesantren-backend 2>/dev/null || true

# Wait for health
sleep 5
if docker ps --format '{{.Names}}' | grep -q "pesantren-backend"; then
    log "Backend service restarted successfully"
else
    log "WARNING: Backend may need manual restart"
fi

log "========================================="
log "Restore process completed!"
log "========================================="
