# ============================================
# Pesantren Tursina Alam — Frontend Dockerfile
# Multi-stage production build
# ============================================

# ── Stage 1: Dependencies ──
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files for caching
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# ── Stage 2: Build ──
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .

# Build-time environment (API URL injected at build)
ARG VITE_API_URL=/api/v1
ARG VITE_APP_NAME="Pesantren Tursina Alam"
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}

RUN npm run build

# ── Stage 3: Production (Nginx static serve) ──
FROM nginx:1.27-alpine AS production

# Security: run as non-root
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Security: remove server version
RUN sed -i 's/# server_tokens off;/server_tokens off;/' /etc/nginx/nginx.conf 2>/dev/null || true

# Create cache directories with correct permissions
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx && \
    chown -R appuser:appgroup /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
