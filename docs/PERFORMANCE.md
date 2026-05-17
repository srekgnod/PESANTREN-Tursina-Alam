# Performance Optimization Guide — Pesantren Tursina Alam

## Architecture Performance Overview

```
Client → CDN (Cloudflare) → Nginx (gzip + cache) → Services
                                                     ├── Frontend (static, cached)
                                                     └── Backend → Redis Cache → PostgreSQL
```

---

## Frontend Optimizations

### Build-time (Vite)
- **Tree shaking** — Removes unused code
- **Code splitting** — Lazy-loaded routes
- **Asset hashing** — Immutable cache with content hash
- **Minification** — CSS & JS compressed

### Runtime
- **Gzip compression** — 60-80% size reduction
- **Static asset caching** — 1 year for hashed assets
- **Lazy loading** — Components loaded on demand
- **Image optimization** — WebP format, proper sizing

### Nginx Cache Headers (configured)
```nginx
# Hashed assets: 1 year immutable
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Icons/images: 30 days
location ~* \.(ico|svg|png|webp)$ {
    expires 30d;
    add_header Cache-Control "public, no-transform";
}
```

---

## Backend Optimizations

### Redis Caching Strategy

| Cache Key Pattern          | TTL     | Use Case               |
|---------------------------|---------|------------------------|
| `session:<user_id>`       | 15 min  | JWT session cache      |
| `santri:list`             | 5 min   | Santri list cache      |
| `dashboard:stats`         | 2 min   | Dashboard statistics   |
| `attendance:<date>`       | 10 min  | Daily attendance       |
| `user:<id>:profile`       | 15 min  | User profile data      |

### Database Query Optimization

```sql
-- Essential indexes (applied via migrations)
CREATE INDEX idx_santri_status ON santri(status);
CREATE INDEX idx_santri_kelas ON santri(kelas_id);
CREATE INDEX idx_attendance_date ON attendance(tanggal);
CREATE INDEX idx_attendance_santri ON attendance(santri_id, tanggal);
CREATE INDEX idx_payment_status ON payments(status, due_date);
CREATE INDEX idx_users_email ON users(email);
```

### Connection Pooling (PostgreSQL)

Configured in `docker-compose.yml`:
```
max_connections=200
shared_buffers=256MB
effective_cache_size=768MB
work_mem=4MB
```

### Gin Framework Optimizations
- **Release mode** in production (`GIN_MODE=release`)
- **Connection keep-alive** to database
- **Structured logging** (zap) — zero-allocation
- **Request validation** — early rejection of invalid requests

---

## Nginx Optimizations

### Compression (configured)
```nginx
gzip on;
gzip_comp_level 6;
gzip_min_length 256;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;
```

### Keep-alive (configured)
```nginx
keepalive_timeout 65;
keepalive_requests 100;

upstream backend_upstream {
    server backend:8080;
    keepalive 32;  # Persistent connections to backend
}
```

### Rate Limiting (configured)
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
```

### Proxy Buffering
```nginx
proxy_buffering on;
proxy_buffer_size 4k;
proxy_buffers 8 8k;
```

---

## PostgreSQL Performance Tuning

Applied via `docker-compose.yml` command:

| Parameter                       | Value  | Purpose                          |
|--------------------------------|--------|----------------------------------|
| `shared_buffers`               | 256MB  | In-memory data cache             |
| `effective_cache_size`         | 768MB  | Query planner memory estimate    |
| `maintenance_work_mem`         | 128MB  | Faster VACUUM/INDEX ops          |
| `checkpoint_completion_target` | 0.9    | Spread checkpoint I/O            |
| `wal_buffers`                  | 16MB   | Write-ahead log buffer           |
| `random_page_cost`             | 1.1    | SSD optimization                 |
| `effective_io_concurrency`     | 200    | SSD parallel I/O                 |
| `work_mem`                     | 4MB    | Per-operation sort memory        |

---

## Redis Configuration

| Setting           | Value          | Purpose                    |
|-------------------|----------------|----------------------------|
| `maxmemory`       | 256mb          | Memory limit               |
| `maxmemory-policy`| allkeys-lru    | Evict least recently used  |
| `appendonly`      | yes            | Persistence (AOF)          |
| `appendfsync`     | everysec       | Balance durability/speed   |
| `tcp-keepalive`   | 300            | Connection health          |

---

## CDN Recommendation (Cloudflare)

For additional performance:

1. **Enable Cloudflare proxy** — Global CDN caching
2. **Page Rules:**
   - `*.tursinaalam.sch.id/assets/*` → Cache Level: Cache Everything, Edge TTL: 1 month
   - `api.*` → Cache Level: Bypass
3. **Auto-minify** — HTML, CSS, JS
4. **Brotli compression** — Better than gzip
5. **HTTP/3** — Faster connections

---

## Monitoring Performance

### Key Metrics to Watch

```bash
# Response times
docker compose logs backend | grep request_time

# Slow queries (>1s logged by PostgreSQL)
docker compose logs postgres | grep "duration"

# Redis hit rate
docker exec pesantren-redis redis-cli -a $REDIS_PASSWORD INFO stats | grep hit

# Container resource usage
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

### Nginx Access Log (JSON format)
```json
{
  "time": "2024-01-01T12:00:00+07:00",
  "request": "GET /api/v1/santri HTTP/1.1",
  "status": 200,
  "request_time": 0.045,
  "upstream_response_time": "0.043"
}
```

---

## Performance Benchmarks Target

| Endpoint           | Target Response | Max Concurrent |
|--------------------|-----------------|----------------|
| Static assets      | < 50ms         | 1000+          |
| API (cached)       | < 100ms        | 500            |
| API (database)     | < 300ms        | 200            |
| File upload        | < 2s           | 50             |
| Dashboard load     | < 1.5s         | 100            |
