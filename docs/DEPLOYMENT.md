# Deployment Guide — Pesantren Tursina Alam

## Quick Start (Production)

```bash
# 1. Clone repository
git clone https://github.com/your-org/pesantren-tursina-alam.git /opt/pesantren
cd /opt/pesantren

# 2. Setup environment
cp .env.example .env
nano .env  # Fill in production values

# 3. Generate secrets
openssl rand -base64 32   # DB_PASSWORD
openssl rand -base64 24   # REDIS_PASSWORD
openssl rand -hex 32      # JWT_SECRET
openssl rand -hex 32      # JWT_REFRESH_SECRET

# 4. Create required directories
mkdir -p logs/{backend,nginx,system} backups/postgres storage/uploads

# 5. Build and start all services
docker compose up -d --build

# 6. Check status
docker compose ps
./scripts/healthcheck.sh

# 7. Setup SSL (after DNS is configured)
sudo ./scripts/setup-ssl.sh
```

---

## Prerequisites

| Component       | Minimum Version |
|-----------------|-----------------|
| Docker          | 24.0+           |
| Docker Compose  | 2.20+           |
| Ubuntu          | 22.04 LTS       |
| RAM             | 2 GB            |
| Disk            | 20 GB SSD       |

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable           | Description                  | Required |
|--------------------|------------------------------|----------|
| `DB_PASSWORD`      | PostgreSQL password          | ✅        |
| `REDIS_PASSWORD`   | Redis password               | ✅        |
| `JWT_SECRET`       | JWT signing key              | ✅        |
| `JWT_REFRESH_SECRET` | JWT refresh signing key   | ✅        |
| `DOMAIN`           | Production domain            | ✅        |
| `WA_API_TOKEN`     | Fonnte WhatsApp token        | Optional |

---

## Service Architecture

```
Internet → Nginx (80/443)
              ├── /api/*     → Backend (8080)
              ├── /uploads/* → Backend (8080)
              └── /*         → Frontend (3000)
                                    ↓
                  Backend → PostgreSQL (5432) + Redis (6379)
```

---

## Common Operations

### Start Services
```bash
docker compose up -d
```

### Stop Services
```bash
docker compose down
```

### View Logs
```bash
docker compose logs -f backend     # Backend logs
docker compose logs -f nginx       # Nginx logs
docker compose logs --tail=100     # All services, last 100 lines
```

### Rebuild Single Service
```bash
docker compose up -d --build backend
docker compose up -d --build frontend
```

### Run Migrations
```bash
./scripts/migrate.sh
```

### Run Seeder
```bash
./scripts/migrate.sh --seed
```

### Database Backup
```bash
./scripts/backup-db.sh
```

### Database Restore
```bash
./scripts/restore-db.sh                    # Latest backup
./scripts/restore-db.sh backup_file.sql.gz # Specific backup
```

### Health Check
```bash
./scripts/healthcheck.sh
./scripts/healthcheck.sh --watch   # Continuous monitoring
```

---

## Deployment Workflow

### Manual Deploy
```bash
./scripts/deploy.sh               # Full deploy
./scripts/deploy.sh --backend     # Backend only
./scripts/deploy.sh --frontend    # Frontend only
./scripts/deploy.sh --quick       # Quick restart
```

### CI/CD (GitHub Actions)
Push to `main` branch triggers:
1. Lint (ESLint + Go vet)
2. Build (Frontend + Backend)
3. Test (Backend unit tests)
4. Docker Build & Push
5. Deploy via SSH

Required GitHub Secrets:
- `VPS_HOST` — Server IP address
- `VPS_USER` — SSH username (deploy)
- `VPS_SSH_KEY` — SSH private key
- `VPS_PORT` — SSH port (default: 22)

---

## Troubleshooting

### Container won't start
```bash
docker compose logs <service>
docker inspect <container_name>
```

### Database connection refused
```bash
docker exec pesantren-postgres pg_isready
docker compose restart postgres
```

### Redis connection error
```bash
docker exec pesantren-redis redis-cli -a $REDIS_PASSWORD ping
```

### Out of disk space
```bash
docker system prune -af --volumes  # ⚠️ Removes unused data
docker image prune -af
```

---

## Scaling Considerations

For high traffic (>1000 concurrent users):
1. Add more backend replicas in docker-compose
2. Use external PostgreSQL (RDS/managed)
3. Use Redis Cluster
4. Add CDN (Cloudflare) for static assets
5. Consider Kubernetes for auto-scaling
