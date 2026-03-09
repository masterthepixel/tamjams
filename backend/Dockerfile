# Simple Dockerfile for Medusa backend
# Use Node 20 (same as local dev environment)
FROM node:20-alpine

# create app directory
WORKDIR /app

# Copy package files first for dependency install cache
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prod

# Copy the rest of the backend code
COPY . .

# Build the backend (generates .medusa/server and compiles TS)
RUN pnpm build

# Expose default port
EXPOSE 9000

# Start Medusa
CMD ["pnpm", "start"]
