# ========== Stage 1: Dependencies ==========
FROM node:20-slim AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ========== Stage 2: Build ==========
FROM node:20-slim AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create template database (empty with correct schema)
RUN mkdir -p /app/data && \
    DATABASE_URL="file:/app/data/template.db" npx prisma db push

# Build Next.js
RUN npm run build

# ========== Stage 3: Runner ==========
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_PATH=/app/data/app.db
ENV DATABASE_URL=file:/app/data/app.db

# Install ffmpeg, yt-dlp, and Python (required by yt-dlp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    curl \
    ca-certificates \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy template database to a location OUTSIDE the volume mount path
COPY --from=builder /app/data/template.db /app/template.db

# Create data directory for SQLite
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Copy startup script
COPY --chown=nextjs:nodejs <<'EOF' /app/start.sh
#!/bin/sh
# Initialize database from template if it doesn't exist
if [ ! -f /app/data/app.db ]; then
  echo "Initializing database..."
  cp /app/template.db /app/data/app.db
  echo "Database initialized."
fi
exec node server.js
EOF
RUN chmod +x /app/start.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["/app/start.sh"]
