# Simple Dockerfile for Medusa backend
# Use Node 20 (same as local dev environment)
FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@10.30.3

# Copy only package files first for dependency layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (including dev deps for build step)
RUN pnpm install --frozen-lockfile

# Copy backend source code
# Note: .dockerignore excludes node_modules, .env, build artifacts, etc.
COPY . .

# Build with dummy DATABASE_URL if not provided
# (medusa build only generates TypeScript, doesn't connect to DB)
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" \
    STORE_CORS="*" \
    ADMIN_CORS="*" \
    AUTH_CORS="*" \
    JWT_SECRET="build-secret" \
    COOKIE_SECRET="build-secret" \
    NODE_ENV="production" \
    pnpm build

# Remove dev dependencies to reduce image size
# Keep only runtime dependencies
RUN pnpm prune --prod

# Expose default port
EXPOSE 9000

# Start Medusa server with production config from Railway env vars
CMD ["pnpm", "start"]
