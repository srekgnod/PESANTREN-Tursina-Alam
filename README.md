# Sistem Informasi Pondok Pesantren Tursina Alam

> Enterprise-grade, production-ready management system for Pondok Pesantren Tursina Alam.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite + TailwindCSS 4    |
| Backend    | Go 1.23 + Gin Framework + GORM     |
| Database   | PostgreSQL 16                       |
| Cache      | Redis 7                             |
| Proxy      | Nginx 1.27                          |
| Container  | Docker + Docker Compose             |
| Auth       | JWT (Access + Refresh tokens)       |
| CI/CD      | GitHub Actions                      |

---

## Architecture

```
Internet → Nginx (80/443)
              ├── /api/*     → Backend API (8080)
              ├── /uploads/* → File Storage
              └── /*         → Frontend SPA (3000)
                                    ↓
              Backend → PostgreSQL (5432) + Redis (6379)
```

### Subdomains
- `tursinaalam.sch.id` — Website Profile
- `admin.tursinaalam.sch.id` — Dashboard Admin
- `wali.tursinaalam.sch.id` — Portal Wali Santri
- `absensi.tursinaalam.sch.id` — Sistem Absensi
- `ppdb.tursinaalam.sch.id` — PPDB Online

---

## Quick Start

```bash
# 1. Clone & setup
git clone <repository> && cd pesantren
cp .env.example .env
# Edit .env with your values

# 2. Start all services
make up
# OR: docker compose up -d --build

# 3. Check health
make health
```

---

## Project Structure

```
├── frontend/            # React + Vite SPA
├── backend/             # Go Gin API
├── nginx/               # Reverse proxy configs
│   ├── nginx.conf       # Main config
│   ├── conf.d/          # Site configs
│   └── ssl/             # SSL certificates
├── docker/              # Dockerfiles
│   ├── frontend/
│   └── backend/
├── scripts/             # Automation scripts
│   ├── deploy.sh
│   ├── backup-db.sh
│   ├── restore-db.sh
│   ├── setup-vps.sh
│   ├── setup-ssl.sh
│   └── healthcheck.sh
├── docs/                # Documentation
├── logs/                # Application logs
├── backups/             # Database backups
├── storage/             # File uploads
├── .github/workflows/   # CI/CD pipeline
├── docker-compose.yml   # Service orchestration
├── Makefile             # Quick commands
└── .env.example         # Environment template
```

---

## Available Commands

```bash
make help           # Show all commands
make up             # Start services
make down           # Stop services
make build          # Rebuild images
make deploy         # Production deploy
make backup         # Database backup
make restore        # Database restore
make health         # Health check
make logs           # View logs
make migrate        # Run migrations
make seed           # Run seeder
```

---

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [VPS Setup Guide](docs/VPS-SETUP.md)
- [SSL Setup Guide](docs/SSL-SETUP.md)
- [Backup & Restore](docs/BACKUP.md)
- [Security Guide](docs/SECURITY.md)
- [Performance Guide](docs/PERFORMANCE.md)

---

## Security Highlights

- JWT authentication with token rotation
- Rate limiting & brute force protection
- Non-root Docker containers
- Isolated Docker network (no public DB/Redis)
- Security headers (XSS, CSRF, Clickjacking)
- Environment-based secret management
- Fail2Ban + UFW firewall

---

## License

Private — Pondok Pesantren Tursina Alam © 2024
