# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy project files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY ./src ./src
COPY ./public ./public

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
 
