# SSL Setup Guide — Pesantren Tursina Alam

## Overview

SSL/TLS certificates are managed via **Let's Encrypt** (free, automated, 90-day certificates).

---

## Prerequisites

1. Domain DNS pointing to VPS IP
2. Ports 80 and 443 open
3. Docker running on VPS

---

## Quick Setup

```bash
# Run the automated SSL script
sudo ./scripts/setup-ssl.sh
```

This will:
1. Install Certbot
2. Request certificates for all domains
3. Configure auto-renewal
4. Generate DH parameters

---

## Manual Setup

### 1. Install Certbot

```bash
sudo apt install -y certbot
```

### 2. Stop Nginx Temporarily

```bash
docker compose stop nginx
```

### 3. Request Certificate

```bash
sudo certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email admin@tursinaalam.sch.id \
    -d tursinaalam.sch.id \
    -d www.tursinaalam.sch.id \
    -d admin.tursinaalam.sch.id \
    -d wali.tursinaalam.sch.id \
    -d absensi.tursinaalam.sch.id \
    -d ppdb.tursinaalam.sch.id
```

### 4. Copy Certificates

```bash
sudo cp /etc/letsencrypt/live/tursinaalam.sch.id/fullchain.pem nginx/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/tursinaalam.sch.id/privkey.pem nginx/ssl/privkey.pem
sudo chmod 600 nginx/ssl/privkey.pem
sudo chmod 644 nginx/ssl/fullchain.pem
```

### 5. Generate DH Parameters

```bash
openssl dhparam -out nginx/ssl/dhparam.pem 2048
```

### 6. Enable SSL in Nginx

Edit `nginx/conf.d/default.conf`:

```nginx
# Uncomment these sections:
server {
    listen 443 ssl http2;
    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ...
}
```

Also uncomment the HTTP→HTTPS redirect block.

### 7. Restart Nginx

```bash
docker compose restart nginx
```

---

## Auto-Renewal

Let's Encrypt certificates expire every 90 days. Setup automatic renewal:

```bash
# Add to crontab
crontab -e

# Renew at 3 AM daily, reload nginx on success
0 3 * * * certbot renew --quiet --deploy-hook "docker exec pesantren-nginx nginx -s reload"
```

---

## Verify SSL

```bash
# Check certificate expiry
openssl s_client -connect tursinaalam.sch.id:443 -servername tursinaalam.sch.id 2>/dev/null | openssl x509 -noout -dates

# Test SSL rating
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=tursinaalam.sch.id
```

---

## SSL Best Practices Applied

| Feature                    | Status |
|----------------------------|--------|
| TLS 1.2 & 1.3 only        | ✅     |
| HSTS header                | ✅     |
| OCSP Stapling              | ✅     |
| Session resumption         | ✅     |
| Strong cipher suites       | ✅     |
| DH Parameters (2048-bit)   | ✅     |
| Certificate auto-renewal   | ✅     |

---

## Troubleshooting

### Certificate request fails
```bash
# Check DNS resolution
dig tursinaalam.sch.id +short

# Check port 80 is accessible
curl -I http://tursinaalam.sch.id
```

### Nginx won't start with SSL
```bash
# Test nginx config
docker exec pesantren-nginx nginx -t

# Check certificate files exist
ls -la nginx/ssl/
```

### Mixed content warnings
Ensure all resources use HTTPS URLs. Check `VITE_API_URL` and `CORS_ORIGINS` in `.env`.
