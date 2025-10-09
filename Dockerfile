# ---- Build Stage ----
    FROM oven/bun:1 AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy package and lock files
    COPY bun.lock package.json ./
    COPY prisma ./prisma/
    
    # Install dependencies (includes devDependencies)
    RUN bun install
    
    # Copy source code
    COPY . .
    
    # Generate Prisma client and build the app
    RUN bun run prisma:generate
    RUN bun run build
    
    
    # ---- Production Stage ----
    FROM oven/bun:1 AS runner
    
    WORKDIR /app
    
    # Copy only needed files
    COPY bun.lock package.json ./
    COPY prisma ./prisma/
    
    # Install only production dependencies
    RUN bun install --production
    
    # Copy built assets from builder stage
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    # Environment configuration
    ENV NODE_ENV=production
    ENV NODE_OPTIONS=--max-old-space-size=4096
    
    # Expose app port
    EXPOSE 3000
    
    # Start the app
    CMD ["bun", "run", "start"]
    