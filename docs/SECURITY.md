# Security Guide — Pesantren Tursina Alam

## Security Architecture

```
Internet → Cloudflare (DDoS protection)
         → Nginx (rate limiting, headers, SSL)
         → Backend (JWT, CORS, validation)
         → PostgreSQL (encrypted, isolated)
         → Redis (password-protected, isolated)
```

---

## Implemented Security Measures

### Network Security
- [x] Docker isolated network — services communicate internally only
- [x] No public port exposure for PostgreSQL (5432)
- [x] No public port exposure for Redis (6379)
- [x] UFW firewall — only ports 22, 80, 443 open
- [x] Fail2Ban — brute force protection for SSH

### Application Security
- [x] JWT authentication with short-lived tokens (15m)
- [x] JWT refresh token rotation (7 days)
- [x] Password hashing (bcrypt, cost 12)
- [x] Input validation on all endpoints
- [x] Rate limiting (API: 30r/s, Login: 5r/m)
- [x] CORS whitelist configuration
- [x] Request body size limit (20MB)

### HTTP Security Headers
- [x] `X-Frame-Options: SAMEORIGIN` — Clickjacking protection
- [x] `X-Content-Type-Options: nosniff` — MIME sniffing prevention
- [x] `X-XSS-Protection: 1; mode=block` — XSS protection
- [x] `Referrer-Policy: strict-origin-when-cross-origin`
- [x] `Permissions-Policy` — Disable camera/mic/geo
- [x] `Strict-Transport-Security` — HTTPS enforcement (when SSL enabled)

### Container Security
- [x] Non-root Docker user (appuser:1001)
- [x] Minimal base images (Alpine)
- [x] No unnecessary packages in production
- [x] Read-only config mounts
- [x] Server tokens disabled (hide nginx version)

### Data Security
- [x] Environment variable secrets (never hardcoded)
- [x] Encrypted connections (SSL/TLS)
- [x] Database access only via backend
- [x] File upload validation (type, size, name)
- [x] SQL injection prevention (GORM parameterized queries)

---

## Environment Secret Management

### Generating Secrets

```bash
# Database password (32 chars)
openssl rand -base64 32

# Redis password (24 chars)
openssl rand -base64 24

# JWT secret (64 hex chars)
openssl rand -hex 32

# JWT refresh secret (different from JWT secret!)
openssl rand -hex 32
```

### Secret Rotation Procedure

1. Generate new secrets
2. Update `.env` on production server
3. Restart affected services: `docker compose restart backend`
4. Invalidate all existing sessions (Redis flush if JWT secret changed)

---

## CORS Configuration

Allowed origins (set in `.env`):
```
CORS_ORIGINS=https://tursinaalam.sch.id,https://admin.tursinaalam.sch.id,https://wali.tursinaalam.sch.id,https://absensi.tursinaalam.sch.id,https://ppdb.tursinaalam.sch.id
```

---

## Rate Limiting

| Zone           | Rate    | Burst | Purpose                    |
|----------------|---------|-------|----------------------------|
| `api_limit`    | 30r/s   | 20    | General API protection     |
| `login_limit`  | 5r/m    | 3     | Brute force prevention     |
| `general_limit`| 50r/s   | 30    | Frontend/static requests   |
| `conn_limit`   | 50 conn | -     | Connection limit per IP    |

---

## File Upload Security

### Validation Rules
- **Allowed types:** jpg, jpeg, png, webp, pdf, doc, docx
- **Max size:** 10 MB (configurable)
- **Filename:** UUID-based (no user input in filename)
- **Storage:** Isolated volume, not in web root
- **Access:** Via authenticated API only

### Upload Path Structure
```
/app/uploads/
├── photos/      # Foto santri
├── documents/   # Dokumen umum
├── invoices/    # Invoice PDF
└── leaves/      # Surat izin
```

---

## Security Checklist for Deployment

- [ ] All default passwords changed
- [ ] `.env` file has 600 permissions
- [ ] Root login disabled in SSH
- [ ] SSH key authentication enabled
- [ ] Firewall active (UFW)
- [ ] Fail2Ban configured
- [ ] SSL certificates installed
- [ ] HSTS header enabled
- [ ] Database not publicly accessible
- [ ] Redis password set
- [ ] JWT secrets are unique and random
- [ ] CORS configured for production domains only
- [ ] Rate limiting active
- [ ] Server version headers hidden
- [ ] Regular security updates scheduled

---

## Incident Response

### Suspected Breach
1. Immediately rotate all secrets (JWT, DB, Redis passwords)
2. Check access logs: `docker compose logs nginx | grep -i "403\|401\|500"`
3. Review failed login attempts
4. Check for unauthorized data access
5. Notify affected users if data exposed

### Useful Commands
```bash
# Check failed SSH attempts
journalctl -u sshd | grep "Failed"

# Check nginx error log
tail -f logs/nginx/error.log

# Check banned IPs
sudo fail2ban-client status sshd

# View active connections
docker exec pesantren-nginx ss -tuln
```
