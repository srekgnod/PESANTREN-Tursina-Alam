#!/bin/bash
# ============================================
# Pesantren Tursina Alam — Secret Generator
# Generate all required secrets for production
# ============================================
# Usage:
#   ./scripts/generate-secrets.sh
#   ./scripts/generate-secrets.sh >> .env
# ============================================

echo "# ═══════════════════════════════════════════"
echo "# Generated Secrets — $(date +'%Y-%m-%d %H:%M:%S')"
echo "# ═══════════════════════════════════════════"
echo ""
echo "# PostgreSQL Password"
echo "DB_PASSWORD=$(openssl rand -base64 32 | tr -d '=/+' | head -c 32)"
echo ""
echo "# Redis Password"
echo "REDIS_PASSWORD=$(openssl rand -base64 24 | tr -d '=/+' | head -c 24)"
echo ""
echo "# JWT Access Token Secret"
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo ""
echo "# JWT Refresh Token Secret"
echo "JWT_REFRESH_SECRET=$(openssl rand -hex 32)"
echo ""
echo "# ═══════════════════════════════════════════"
echo "# Copy these values into your .env file"
echo "# ═══════════════════════════════════════════"
