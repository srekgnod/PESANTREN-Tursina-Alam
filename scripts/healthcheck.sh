#!/bin/bash
# ============================================
# Pesantren Tursina Alam — Health Check Script
# Monitor all services and alert on failures
# ============================================
# Usage:
#   ./scripts/healthcheck.sh             # Check all
#   ./scripts/healthcheck.sh --watch     # Continuous monitoring
# ============================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="${PROJECT_DIR}/logs/system/healthcheck.log"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

mkdir -p "$(dirname "$LOG_FILE")"

# ── Functions ──
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

check_service() {
    local name="$1"
    local container="$2"

    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        local status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no-healthcheck")
        local uptime=$(docker inspect --format='{{.State.StartedAt}}' "$container" 2>/dev/null | cut -dT -f1)

        if [ "$status" = "healthy" ] || [ "$status" = "no-healthcheck" ]; then
            echo -e "  ${GREEN}✓${NC} $name (${container}) — ${status} since ${uptime}"
            return 0
        else
            echo -e "  ${RED}✗${NC} $name (${container}) — ${status}"
            log "UNHEALTHY: $name ($container) status=$status"
            return 1
        fi
    else
        echo -e "  ${RED}✗${NC} $name (${container}) — NOT RUNNING"
        log "DOWN: $name ($container)"
        return 1
    fi
}

check_endpoint() {
    local name="$1"
    local url="$2"
    local expected="${3:-200}"

    local http_code=$(curl -sf -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

    if [ "$http_code" = "$expected" ]; then
        echo -e "  ${GREEN}✓${NC} $name — HTTP $http_code"
        return 0
    else
        echo -e "  ${RED}✗${NC} $name — HTTP $http_code (expected $expected)"
        log "ENDPOINT_FAIL: $name url=$url code=$http_code"
        return 1
    fi
}

check_disk() {
    local usage=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
    if [ "$usage" -lt 80 ]; then
        echo -e "  ${GREEN}✓${NC} Disk usage: ${usage}%"
    elif [ "$usage" -lt 90 ]; then
        echo -e "  ${YELLOW}!${NC} Disk usage: ${usage}% (WARNING)"
        log "DISK_WARNING: ${usage}%"
    else
        echo -e "  ${RED}✗${NC} Disk usage: ${usage}% (CRITICAL)"
        log "DISK_CRITICAL: ${usage}%"
    fi
}

check_memory() {
    local usage=$(free | awk '/^Mem:/ {printf "%.0f", $3/$2 * 100}')
    if [ "$usage" -lt 80 ]; then
        echo -e "  ${GREEN}✓${NC} Memory usage: ${usage}%"
    elif [ "$usage" -lt 90 ]; then
        echo -e "  ${YELLOW}!${NC} Memory usage: ${usage}% (WARNING)"
    else
        echo -e "  ${RED}✗${NC} Memory usage: ${usage}% (CRITICAL)"
        log "MEMORY_CRITICAL: ${usage}%"
    fi
}

# ── Main ──
run_checks() {
    echo ""
    echo "═══════════════════════════════════════════"
    echo " Pesantren Tursina Alam — Health Status"
    echo " $(date +'%Y-%m-%d %H:%M:%S')"
    echo "═══════════════════════════════════════════"
    echo ""

    echo "Docker Services:"
    check_service "Nginx"    "pesantren-nginx"
    check_service "Frontend" "pesantren-frontend"
    check_service "Backend"  "pesantren-backend"
    check_service "Postgres" "pesantren-postgres"
    check_service "Redis"    "pesantren-redis"
    echo ""

    echo "HTTP Endpoints:"
    check_endpoint "Nginx Health"   "http://localhost/health"
    check_endpoint "Backend Health" "http://localhost/health/api"
    check_endpoint "Frontend"       "http://localhost/"
    echo ""

    echo "System Resources:"
    check_disk
    check_memory
    echo ""

    echo "Docker Stats:"
    docker stats --no-stream --format "  {{.Name}}: CPU {{.CPUPerc}} | MEM {{.MemUsage}}" 2>/dev/null || echo "  (unavailable)"
    echo ""
    echo "═══════════════════════════════════════════"
}

if [ "${1:-}" = "--watch" ]; then
    while true; do
        clear
        run_checks
        sleep 30
    done
else
    run_checks
fi
