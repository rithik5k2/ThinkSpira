# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy built frontend from builder stage
COPY --from=builder /app/build ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
