# ============================
# Backend Dockerfile (Bun)
# ============================

FROM oven/bun:1.3.3

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Copy necessary files for dependency installation
COPY ../package.json ./package.json
COPY ../bun.lock ./bun.lock
COPY ../turbo.json ./turbo.json
COPY ../packages ./packages
COPY ../apps/cosketch-backend ./apps/cosketch-backend

# Install deps
RUN bun install

# Expose backend port
EXPOSE 9000

# Run the server with database deployment
CMD ["bun", "run", "start:backend"]