# VPS Setup Guide — Pesantren Tursina Alam

## Recommended VPS Specs

| Tier       | RAM  | CPU  | Disk    | Use Case              |
|------------|------|------|---------|------------------------|
| Starter    | 2 GB | 1 vCPU | 40 GB SSD | < 100 santri         |
| Standard   | 4 GB | 2 vCPU | 80 GB SSD | 100-500 santri       |
| Enterprise | 8 GB | 4 vCPU | 160 GB SSD | 500+ santri          |

**Recommended Providers:** DigitalOcean, Vultr, Contabo, IDCloudHost

---

## Step 1: Initial Server Setup

```bash
# SSH to your VPS
ssh root@YOUR_VPS_IP

# Run automated setup script
curl -sSL https://raw.githubusercontent.com/your-org/pesantren/main/scripts/setup-vps.sh | bash
```

### OR Manual Setup:

```bash
# Update system
apt update && apt upgrade -y

# Install essentials
apt install -y curl wget git unzip htop ufw fail2ban ca-certificates gnupg lsb-release

# Set timezone
timedatectl set-timezone Asia/Jakarta
```

---

## Step 2: Install Docker

```bash
# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify
docker --version
docker compose version
```

---

## Step 3: Create Deploy User

```bash
# Create user
useradd -m -s /bin/bash -G sudo,docker deploy

# Set password
passwd deploy

# Setup SSH key (on your local machine)
ssh-copy-id deploy@YOUR_VPS_IP

# Switch to deploy user
su - deploy
```

---

## Step 4: Firewall Configuration

```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Verify
sudo ufw status
```

⚠️ **NEVER expose ports 5432 (PostgreSQL) or 6379 (Redis) publicly!**

---

## Step 5: Clone Project

```bash
cd /opt
sudo mkdir pesantren && sudo chown deploy:deploy pesantren
git clone https://github.com/your-org/pesantren-tursina-alam.git pesantren
cd pesantren
```

---

## Step 6: Configure Environment

```bash
# Copy template
cp .env.example .env

# Generate secure passwords
echo "DB_PASSWORD=$(openssl rand -base64 32)"
echo "REDIS_PASSWORD=$(openssl rand -base64 24)"
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "JWT_REFRESH_SECRET=$(openssl rand -hex 32)"

# Edit .env with generated values
nano .env
```

---

## Step 7: Create Directories

```bash
mkdir -p logs/{backend,nginx,system}
mkdir -p backups/postgres
mkdir -p storage/uploads/{photos,documents,invoices,leaves}
mkdir -p nginx/ssl
```

---

## Step 8: Build & Start Services

```bash
# Build all images
docker compose build

# Start services (detached)
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

---

## Step 9: Run Database Migration

```bash
# Wait for PostgreSQL to be ready
sleep 10

# Run migrations
./scripts/migrate.sh

# (Optional) Run seeder for initial data
./scripts/migrate.sh --seed
```

---

## Step 10: Setup Domain & DNS

Configure DNS records at your domain registrar:

| Type  | Name     | Value         | TTL  |
|-------|----------|---------------|------|
| A     | @        | YOUR_VPS_IP   | 3600 |
| A     | www      | YOUR_VPS_IP   | 3600 |
| A     | admin    | YOUR_VPS_IP   | 3600 |
| A     | wali     | YOUR_VPS_IP   | 3600 |
| A     | absensi  | YOUR_VPS_IP   | 3600 |
| A     | ppdb     | YOUR_VPS_IP   | 3600 |

Wait 5-30 minutes for DNS propagation.

---

## Step 11: Setup SSL (Let's Encrypt)

```bash
# Run SSL setup
sudo ./scripts/setup-ssl.sh

# After SSL is ready, enable HTTPS in nginx config:
# 1. Uncomment SSL sections in nginx/conf.d/default.conf
# 2. Uncomment SSL sections in nginx/conf.d/subdomains.conf
# 3. Restart nginx
docker compose restart nginx
```

---

## Step 12: Setup Automatic Backup

```bash
# Add cron job for daily backup at 2 AM
crontab -e

# Add this line:
0 2 * * * /opt/pesantren/scripts/backup-db.sh >> /opt/pesantren/logs/system/cron.log 2>&1
```

---

## Step 13: Monitoring

```bash
# Check health
./scripts/healthcheck.sh

# Docker resource usage
docker stats

# System resources
htop
df -h
```

---

## Post-Setup Checklist

- [ ] All services running (`docker compose ps`)
- [ ] Health endpoints responding
- [ ] Domain resolving correctly
- [ ] SSL certificate installed
- [ ] Firewall configured (only 22, 80, 443)
- [ ] Fail2Ban active
- [ ] Backup cron scheduled
- [ ] Deploy user SSH key configured
- [ ] Root login disabled
- [ ] `.env` has strong passwords
- [ ] DNS records for all subdomains

---

## Maintenance Commands

```bash
# Update application
cd /opt/pesantren && ./scripts/deploy.sh

# View realtime logs
docker compose logs -f --tail=50

# Restart single service
docker compose restart backend

# Check disk usage
du -sh backups/ logs/ storage/

# Clean Docker cache
docker system prune -f
```
