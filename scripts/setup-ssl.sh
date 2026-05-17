#!/bin/bash
# ============================================
# Pesantren Tursina Alam — SSL Setup (Let's Encrypt)
# Automated certificate provisioning with Certbot
# ============================================
# Usage:
#   ./scripts/setup-ssl.sh
#   ./scripts/setup-ssl.sh --renew     # Force renewal
# ============================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Load environment
if [ -f "$PROJECT_DIR/.env" ]; then
    export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

DOMAIN="${DOMAIN:-tursinaalam.sch.id}"
EMAIL="${SSL_EMAIL:-admin@${DOMAIN}}"
NGINX_SSL_DIR="${PROJECT_DIR}/nginx/ssl"
CERTBOT_DIR="${PROJECT_DIR}/certbot"

# Subdomains
DOMAINS="-d ${DOMAIN} -d www.${DOMAIN} -d admin.${DOMAIN} -d wali.${DOMAIN} -d absensi.${DOMAIN} -d ppdb.${DOMAIN}"

log() { echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"; }

echo "========================================="
echo " SSL Certificate Setup — Let's Encrypt"
echo "========================================="
echo ""
echo "Domain: $DOMAIN"
echo "Email:  $EMAIL"
echo ""

# ── Install Certbot if needed ──
if ! command -v certbot &>/dev/null; then
    log "Installing Certbot..."
    apt-get update -qq
    apt-get install -y -qq certbot
fi

# ── Create directories ──
mkdir -p "$NGINX_SSL_DIR" "$CERTBOT_DIR/www" "$CERTBOT_DIR/conf"

# ── Method: Standalone (stop nginx temporarily) ──
if [ "${1:-}" = "--renew" ]; then
    log "Forcing certificate renewal..."
    certbot renew --force-renewal
else
    # Stop nginx for initial cert
    log "Stopping nginx for certificate issuance..."
    docker compose -f "$PROJECT_DIR/docker-compose.yml" stop nginx 2>/dev/null || true

    log "Requesting certificate..."
    certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email "$EMAIL" \
        $DOMAINS \
        --cert-path "$NGINX_SSL_DIR/fullchain.pem" \
        --key-path "$NGINX_SSL_DIR/privkey.pem"

    # Copy certificates
    CERT_PATH="/etc/letsencrypt/live/${DOMAIN}"
    if [ -d "$CERT_PATH" ]; then
        cp "$CERT_PATH/fullchain.pem" "$NGINX_SSL_DIR/fullchain.pem"
        cp "$CERT_PATH/privkey.pem" "$NGINX_SSL_DIR/privkey.pem"
        chmod 600 "$NGINX_SSL_DIR/privkey.pem"
        chmod 644 "$NGINX_SSL_DIR/fullchain.pem"
    fi

    log "Certificate issued successfully!"
fi

# ── Setup Auto-Renewal Cron ──
log "Setting up auto-renewal cron..."
CRON_CMD="0 3 * * * certbot renew --quiet --deploy-hook 'docker exec pesantren-nginx nginx -s reload'"

# Add cron if not exists
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_CMD") | crontab -

# ── Generate DH params (first time only) ──
DH_PARAMS="$NGINX_SSL_DIR/dhparam.pem"
if [ ! -f "$DH_PARAMS" ]; then
    log "Generating DH parameters (this may take a few minutes)..."
    openssl dhparam -out "$DH_PARAMS" 2048
fi

# ── Restart Nginx ──
log "Restarting nginx with SSL..."
docker compose -f "$PROJECT_DIR/docker-compose.yml" up -d nginx

echo ""
echo "========================================="
echo " SSL Setup Complete!"
echo "========================================="
echo ""
echo "Certificates stored in: $NGINX_SSL_DIR"
echo "Auto-renewal cron configured (daily at 3 AM)"
echo ""
echo "IMPORTANT: Uncomment SSL sections in:"
echo "  - nginx/conf.d/default.conf"
echo "  - nginx/conf.d/subdomains.conf"
echo ""
