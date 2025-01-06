# Build stage - Uses Alpine Linux with Node.js for smaller image size
FROM node:18-alpine AS builder

# Install required system dependencies for building
RUN apk add python3 make git --update

# Create app directory
RUN mkdir /app

# Set working directory
WORKDIR /app

# Copy package.json and tsconfig.json files first to leverage Docker layer caching
COPY package*.json tsconfig.json ./
# Copy Prisma schema and configuration
COPY prisma ./prisma/

# Install all dependencies including devDependencies
RUN npm ci

# Copy source code after installing dependencies to leverage caching
COPY . .

# Generate Prisma client for database access
RUN npx prisma generate

# Build TypeScript code into JavaScript
RUN npm run build

# Production stage - Fresh Alpine Linux with Node.js
FROM node:18-alpine

# Install curl for healthchecks and remove cache
RUN apk add --update curl && rm -rf /var/cache/apk/*

# Create app directory in production image
RUN mkdir /app

# Set working directory for production image
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy build artifacts and required files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Define the command to start the application
ENTRYPOINT ["npm", "run", "prod"]