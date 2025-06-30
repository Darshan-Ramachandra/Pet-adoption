# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1

###############################
# Build Stage
###############################
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install build dependencies only (no dev deps in final image)
COPY --link package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy all source files (excluding files in .dockerignore)
COPY --link . .

# Build the React app (output to dist/)
RUN npm run build

###############################
# Production Stage
###############################
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy built app and only production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the port Vite preview uses by default
EXPOSE 4173

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

# Use Vite's preview server to serve the built app
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
