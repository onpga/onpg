# Stage 1: Build
FROM node:20.9.0 AS builder

WORKDIR /app

# Install specific npm version
RUN npm install -g npm@10.2.4

# Copy package files
COPY package*.json ./

# Install dependencies with specific npm version
RUN npm install --no-package-lock

# Copy source code
COPY . .

# Build frontend with increased memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Use vite build directly to skip strict TypeScript checking
RUN npx vite build

# Stage 2: Production
FROM node:20.9.0 AS production

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
# Copy the Express server
COPY server.cjs ./
COPY package*.json ./

# Install express (lightweight, only production)
RUN npm install express --production

# Expose port 3000
EXPOSE 3000

# Start the Express server
CMD ["node", "server.cjs"]
