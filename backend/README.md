# Pesantren Tursina Alam — Backend API

Enterprise-grade REST API for Sistem Informasi Pondok Pesantren Tursina Alam.

## Tech Stack

| Technology | Purpose |
|---|---|
| Go 1.22 | Core language |
| Gin | HTTP framework |
| PostgreSQL 16 | Primary database |
| Redis 7 | Caching & session |
| GORM | ORM |
| JWT | Authentication |
| Docker | Containerization |
| Zap | Structured logging |

## Architecture

```
backend/
├── cmd/
│   ├── server/main.go          # App entry point
│   └── seeder/main.go          # Database seeder
├── internal/
│   ├── config/                 # Environment config
│   ├── database/               # DB connections
│   ├── models/                 # GORM models
│   ├── dto/                    # Request/Response DTOs
│   ├── repository/             # Data access layer
│   ├── service/                # Business logic
│   ├── handler/                # HTTP handlers
│   ├── middleware/              # Auth, RBAC, CORS, Logger
│   ├── routes/                 # Route definitions
│   ├── logger/                 # Structured logging
│   └── utils/                  # Helpers (JWT, hash, pagination, upload)
├── migrations/                 # SQL migrations
├── docker-compose.yml
├── Dockerfile
└── Makefile
```

## Quick Start

### 1. With Docker (Recommended)

```bash
# Copy env
cp .env.example .env

# Start all services
docker compose up -d --build

# Seed database
docker compose exec api ./seeder
```

### 2. Local Development

```bash
# Prerequisites: Go 1.22+, PostgreSQL 16, Redis 7

# Copy env
cp .env.example .env

# Edit .env with your database credentials

# Install dependencies
go mod tidy

# Run migrations + start server
go run cmd/server/main.go

# Seed dummy data
go run cmd/seeder/main.go
```

## API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh token |
| POST | `/api/v1/ppdb/register` | PPDB registration |
| GET | `/api/v1/ppdb/status` | Check PPDB status |
| GET | `/api/v1/public/announcements` | Public announcements |

### Authenticated
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/profile` | Get profile |
| PUT | `/api/v1/auth/change-password` | Change password |
| GET | `/api/v1/dashboard/stats` | Dashboard analytics |

### Staff (Admin + Pengurus + Ustadz)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/santri` | List santri (paginated) |
| POST | `/api/v1/santri` | Create santri |
| GET | `/api/v1/santri/:id` | Get santri detail |
| PUT | `/api/v1/santri/:id` | Update santri |
| POST | `/api/v1/attendance/qr` | QR attendance scan |
| POST | `/api/v1/attendance/manual` | Manual attendance |
| GET | `/api/v1/attendance` | List attendance |

### Admin Only
| Method | Endpoint | Description |
|---|---|---|
| DELETE | `/api/v1/santri/:id` | Delete santri |
| POST | `/api/v1/payments` | Create payment |
| GET | `/api/v1/payments` | List payments |
| PUT | `/api/v1/payments/:id/confirm` | Confirm payment |
| GET | `/api/v1/ppdb` | List PPDB |
| PUT | `/api/v1/ppdb/:id/review` | Review PPDB |

## Roles

| Role | Access |
|---|---|
| `super_admin` | Full access |
| `admin` | Management + financial |
| `pengurus` | Staff operations |
| `ustadz` | Academic operations |
| `wali_santri` | Parent portal |
| `santri` | Student portal |

## Default Credentials (Seeder)

| Username | Password | Role |
|---|---|---|
| `superadmin` | `Admin@123` | Super Admin |
| `admin` | `Admin@123` | Admin |
| `pengurus01` | `Staff@123` | Pengurus |
| `ustadz01` | `Staff@123` | Ustadz |
| `wali01` | `Wali@123` | Wali Santri |

## Features

- JWT Authentication with refresh token
- Role-based access control (6 roles)
- QR Code attendance system
- Payment management with invoice generation
- PPDB online registration
- Dashboard analytics
- Audit trail logging
- File upload (images & documents)
- Pagination, filtering, search
- Structured logging (console + JSON file)
- Docker-ready deployment
- CORS configured for frontend
