#!/bin/bash
# ============================================
# Pesantren Tursina Alam — Database Backup Script
# Production automated backup with rotation
# ============================================
# Usage:
#   ./scripts/backup-db.sh              # Manual backup
#   crontab: 0 2 * * * /path/to/backup-db.sh   # Daily at 2 AM
# ============================================

set -euo pipefail

# ── Configuration ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

# Defaults
DB_USER="${DB_USER:-pesantren}"
DB_NAME="${DB_NAME:-pesantren_db}"
DB_CONTAINER="${DB_CONTAINER:-pesantren-postgres}"
BACKUP_DIR="${PROJECT_DIR}/backups/postgres"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_${DB_NAME}_${TIMESTAMP}.sql.gz"
LOG_FILE="${PROJECT_DIR}/logs/system/backup.log"

# ── Functions ──
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error_exit() {
    log "ERROR: $1"
    exit 1
}

# ── Pre-checks ──
mkdir -p "$BACKUP_DIR" "$(dirname "$LOG_FILE")"

log "========================================="
log "Starting database backup..."
log "Database: $DB_NAME"
log "Container: $DB_CONTAINER"
log "========================================="

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
    error_exit "Container $DB_CONTAINER is not running!"
fi

# ── Perform Backup ──
log "Creating compressed backup: $BACKUP_FILE"

docker exec -t "$DB_CONTAINER" \
    pg_dump -U "$DB_USER" -d "$DB_NAME" \
    --format=custom \
    --compress=9 \
    --no-owner \
    --no-privileges \
    --verbose \
    2>> "$LOG_FILE" \
    > "$BACKUP_DIR/${BACKUP_FILE%.gz}"

if [ $? -eq 0 ]; then
    # Compress with gzip
    gzip -9 "$BACKUP_DIR/${BACKUP_FILE%.gz}"
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    log "Backup successful: $BACKUP_FILE ($BACKUP_SIZE)"
else
    error_exit "Backup failed!"
fi

# ── Verify Backup ──
if [ ! -s "$BACKUP_DIR/$BACKUP_FILE" ]; then
    error_exit "Backup file is empty!"
fi

log "Backup verification passed (file size: $BACKUP_SIZE)"

# ── Rotation: Remove old backups ──
log "Removing backups older than $RETENTION_DAYS days..."
DELETED=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete -print | wc -l)
log "Deleted $DELETED old backup(s)"

# ── Summary ──
TOTAL_BACKUPS=$(find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log "Total backups: $TOTAL_BACKUPS (Total size: $TOTAL_SIZE)"
log "Backup completed successfully!"
log "========================================="
