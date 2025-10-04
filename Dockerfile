

# Build stage: install dependencies and create production assets
FROM node:22.16.0-slim AS builder
WORKDIR /app

# Install dependencies based on the lockfile for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build the production bundle
COPY . .
RUN npm run build

# Production stage: serve the built assets with Nginx
FROM nginx AS runner

# Copy a simple SPA-ready nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
