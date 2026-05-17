# Backup & Restore Guide — Pesantren Tursina Alam

## Backup Strategy

| What            | Frequency    | Retention | Method          |
|-----------------|-------------|-----------|-----------------|
| Database (full) | Daily 2 AM  | 30 days   | pg_dump + gzip  |
| Redis snapshot  | Auto (AOF)  | Realtime  | appendonly yes  |
| Uploads/Storage | Weekly      | 90 days   | tar + rsync     |
| Config files    | On change   | Git       | Version control |

---

## Automated Database Backup

### Setup Cron Job

```bash
# Edit crontab
crontab -e

# Daily backup at 2:00 AM Jakarta time
0 2 * * * /opt/pesantren/scripts/backup-db.sh >> /opt/pesantren/logs/system/cron.log 2>&1

# Weekly full storage backup (Sunday 3 AM)
0 3 * * 0 /opt/pesantren/scripts/backup-storage.sh >> /opt/pesantren/logs/system/cron.log 2>&1
```

### Manual Backup

```bash
# Run backup immediately
./scripts/backup-db.sh
```

### Backup Output
```
backups/postgres/
├── backup_pesantren_db_20240101_020000.sql.gz
├── backup_pesantren_db_20240102_020000.sql.gz
├── backup_pesantren_db_20240103_020000.sql.gz
└── ...
```

---

## Database Restore

### Restore Latest Backup
```bash
./scripts/restore-db.sh
```

### Restore Specific Backup
```bash
./scripts/restore-db.sh backup_pesantren_db_20240101_020000.sql.gz
```

### What Restore Does:
1. ✅ Creates safety backup of current database
2. ✅ Stops backend service
3. ✅ Drops and recreates database
4. ✅ Restores from backup file
5. ✅ Restarts backend service

---

## Redis Backup

Redis is configured with:
- **AOF (Append Only File)** — Every write logged
- **RDB snapshots** — Periodic full dump

### Manual Redis Backup
```bash
# Trigger save
docker exec pesantren-redis redis-cli -a $REDIS_PASSWORD BGSAVE

# Copy dump file
docker cp pesantren-redis:/data/dump.rdb backups/redis_$(date +%Y%m%d).rdb
```

---

## Storage/Upload Backup

### Manual Storage Backup
```bash
# Create archive of all uploads
tar -czf backups/storage_$(date +%Y%m%d).tar.gz -C / \
    $(docker volume inspect pesantren-uploads --format '{{.Mountpoint}}')
```

### Rsync to Remote (recommended)
```bash
# Sync to backup server
rsync -avz --progress \
    /var/lib/docker/volumes/pesantren-uploads/_data/ \
    backup-server:/backups/pesantren/uploads/
```

---

## Offsite Backup (Recommended)

### Option 1: Rsync to Backup Server
```bash
# Add to crontab — daily sync to remote
0 4 * * * rsync -avz /opt/pesantren/backups/ backup@remote-server:/backups/pesantren/
```

### Option 2: S3-Compatible Storage
```bash
# Using rclone
rclone sync /opt/pesantren/backups/ remote:pesantren-backups/ --progress
```

### Option 3: Google Drive (via rclone)
```bash
rclone sync /opt/pesantren/backups/ gdrive:pesantren-backups/
```

---

## Disaster Recovery

### Complete Server Recovery

```bash
# 1. Setup new VPS
sudo ./scripts/setup-vps.sh

# 2. Clone project
git clone <repo> /opt/pesantren && cd /opt/pesantren

# 3. Setup environment
cp .env.example .env && nano .env

# 4. Copy backup files from offsite
scp backup-server:/backups/pesantren/postgres/latest.sql.gz backups/postgres/

# 5. Start infrastructure (without backend)
docker compose up -d postgres redis
sleep 15

# 6. Restore database
./scripts/restore-db.sh

# 7. Start all services
docker compose up -d

# 8. Restore uploads
tar -xzf backups/storage_latest.tar.gz -C /var/lib/docker/volumes/pesantren-uploads/_data/

# 9. Verify
./scripts/healthcheck.sh
```

---

## Backup Monitoring

### Check Last Backup
```bash
ls -lht backups/postgres/ | head -5
```

### Check Backup Size Trend
```bash
du -sh backups/postgres/
find backups/postgres/ -name "*.sql.gz" -mtime -7 | wc -l  # Backups in last 7 days
```

### Alert on Failed Backup (add to crontab)
```bash
# Check if today's backup exists
0 6 * * * [ ! -f /opt/pesantren/backups/postgres/backup_pesantren_db_$(date +\%Y\%m\%d)_*.sql.gz ] && echo "BACKUP FAILED" | mail -s "Pesantren Backup Alert" admin@tursinaalam.sch.id
```

---

## Retention Policy

| Backup Type     | Keep For  | Auto-Cleanup |
|-----------------|-----------|--------------|
| Daily DB backup | 30 days   | ✅ (script)  |
| Weekly storage  | 90 days   | Manual       |
| Pre-restore     | 7 days    | Manual       |
| Redis RDB       | Latest    | Auto         |
