#!/bin/bash
# ============================================
# Pesantren Tursina Alam — VPS Initial Setup
# Ubuntu 22.04/24.04 LTS Server Preparation
# ============================================
# Usage: (run as root on fresh VPS)
#   curl -sSL https://raw.githubusercontent.com/.../setup-vps.sh | bash
#   OR
#   chmod +x scripts/setup-vps.sh && sudo ./scripts/setup-vps.sh
# ============================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo "========================================="
echo " Pesantren Tursina Alam — VPS Setup"
echo "========================================="
echo ""

# ── Check root ──
if [ "$(id -u)" -ne 0 ]; then
    err "This script must be run as root"
fi

# ── 1. System Update ──
log "Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. Essential Packages ──
log "Installing essential packages..."
apt-get install -y -qq \
    curl wget git unzip htop \
    ufw fail2ban \
    ca-certificates gnupg lsb-release \
    software-properties-common \
    logrotate cron

# ── 3. Create deploy user ──
if ! id "deploy" &>/dev/null; then
    log "Creating deploy user..."
    useradd -m -s /bin/bash -G sudo deploy
    echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
    chmod 440 /etc/sudoers.d/deploy
    warn "Set password for deploy user: passwd deploy"
fi

# ── 4. Docker Installation ──
if ! command -v docker &>/dev/null; then
    log "Installing Docker..."
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -qq
    apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    usermod -aG docker deploy
    log "Docker installed successfully"
else
    log "Docker already installed: $(docker --version)"
fi

# ── 5. Firewall Setup ──
log "Configuring UFW firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
log "Firewall configured (SSH, HTTP, HTTPS only)"

# ── 6. Fail2Ban Configuration ──
log "Configuring Fail2Ban..."
cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
maxretry = 3
bantime = 86400
EOF

systemctl enable fail2ban
systemctl restart fail2ban
log "Fail2Ban configured"

# ── 7. SSH Hardening ──
log "Hardening SSH..."
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/#MaxAuthTries 6/MaxAuthTries 3/' /etc/ssh/sshd_config
sed -i 's/#ClientAliveInterval 0/ClientAliveInterval 300/' /etc/ssh/sshd_config
systemctl restart sshd

# ── 8. System Limits ──
log "Setting system limits..."
cat >> /etc/sysctl.conf <<'EOF'

# ── Pesantren Performance Tuning ──
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_fin_timeout = 15
net.core.netdev_max_backlog = 65535
vm.swappiness = 10
vm.overcommit_memory = 1
fs.file-max = 2097152
EOF
sysctl -p > /dev/null 2>&1

cat >> /etc/security/limits.conf <<'EOF'
* soft nofile 65535
* hard nofile 65535
* soft nproc 65535
* hard nproc 65535
EOF

# ── 9. Log Rotation ──
log "Configuring log rotation..."
cat > /etc/logrotate.d/pesantren <<'EOF'
/opt/pesantren/logs/**/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        docker kill --signal=USR1 pesantren-nginx 2>/dev/null || true
    endscript
}
EOF

# ── 10. Create project directory ──
log "Creating project directory..."
mkdir -p /opt/pesantren
chown deploy:deploy /opt/pesantren

# ── 11. Swap (for low-memory VPS) ──
if [ ! -f /swapfile ]; then
    log "Creating 2GB swap..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
fi

# ── 12. Timezone ──
timedatectl set-timezone Asia/Jakarta
log "Timezone set to Asia/Jakarta"

# ── Done ──
echo ""
echo "========================================="
echo -e "${GREEN} VPS Setup Complete!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Switch to deploy user:  su - deploy"
echo "  2. Clone project:          git clone <repo> /opt/pesantren"
echo "  3. Setup environment:      cp .env.example .env && nano .env"
echo "  4. Start services:         ./scripts/deploy.sh"
echo "  5. Setup SSL:              ./scripts/setup-ssl.sh"
echo ""
echo "Security notes:"
echo "  - Root login disabled"
echo "  - Fail2Ban active"
echo "  - Firewall: only 22, 80, 443 open"
echo "  - Deploy user created (use SSH keys!)"
echo ""
