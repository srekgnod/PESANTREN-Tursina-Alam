# ============================================
# Pesantren Tursina Alam — Backend Dockerfile
# Multi-stage production build (Golang)
# ============================================

# ── Stage 1: Build ──
FROM golang:1.23-alpine AS builder

WORKDIR /build

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Cache Go modules
COPY backend/go.mod backend/go.sum ./
RUN go mod download && go mod verify

# Copy source
COPY backend/ .

# Build optimized binaries
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w -X main.version=$(date +%Y%m%d)" \
    -trimpath -o /build/bin/server ./cmd/server

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" \
    -trimpath -o /build/bin/seeder ./cmd/seeder

# ── Stage 2: Production ──
FROM alpine:3.20 AS production

# Security: non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Runtime dependencies only
RUN apk add --no-cache ca-certificates tzdata curl

# Timezone
ENV TZ=Asia/Jakarta

WORKDIR /app

# Copy binaries
COPY --from=builder /build/bin/server ./server
COPY --from=builder /build/bin/seeder ./seeder

# Copy migrations
COPY backend/migrations ./migrations

# Create necessary directories with correct ownership
RUN mkdir -p /app/uploads/photos /app/uploads/documents /app/uploads/invoices /app/uploads/leaves \
             /app/logs && \
    chown -R appuser:appgroup /app

# Switch to non-root
USER appuser

EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

CMD ["./server"]
