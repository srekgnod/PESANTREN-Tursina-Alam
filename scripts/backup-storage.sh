#!/bin/bash
# ============================================
# Pesantren Tursina Alam — Storage Backup Script
# Backup uploaded files (photos, documents, etc.)
# ============================================
# Usage:
#   ./scripts/backup-storage.sh
#   crontab: 0 3 * * 0 /path/to/backup-storage.sh  # Weekly Sunday 3 AM
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="${PROJECT_DIR}/logs/system/backup.log"

BACKUP_DIR="${PROJECT_DIR}/backups/storage"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="storage_${TIMESTAMP}.tar.gz"
RETENTION_DAYS=90

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

mkdir -p "$BACKUP_DIR" "$(dirname "$LOG_FILE")"

log "Starting storage backup..."

# Get volume mount path
VOLUME_PATH=$(docker volume inspect pesantren-uploads --format '{{.Mountpoint}}' 2>/dev/null)

if [ -z "$VOLUME_PATH" ] || [ ! -d "$VOLUME_PATH" ]; then
    log "WARNING: Upload volume not found. Skipping storage backup."
    exit 0
fi

# Create compressed archive
tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C "$VOLUME_PATH" . 2>> "$LOG_FILE"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    log "Storage backup successful: $BACKUP_FILE ($BACKUP_SIZE)"
else
    log "ERROR: Storage backup failed!"
    exit 1
fi

# Rotation
DELETED=$(find "$BACKUP_DIR" -name "storage_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete -print | wc -l)
log "Removed $DELETED old storage backup(s)"

log "Storage backup completed!"
