# syntax=docker/dockerfile:1

# Build stage: install dependencies and create production assets
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies based on the lockfile for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build the production bundle
COPY . .
RUN npm run build

# Production stage: serve the built assets with Nginx
FROM nginx:alpine AS runner

# Copy a simple SPA-ready nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
