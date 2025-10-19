# ---- Build Stage ----
FROM oven/bun:1 AS builder

# Set working directory
WORKDIR /app

# Copy package and lock files first for better caching
COPY package.json bun.lock ./

# Copy Prisma schema early (so bun install and prisma generate cache works)
COPY prisma ./prisma/

# Install dependencies (includes devDependencies for build)
RUN bun install

# Copy all source files
COPY . .

# Generate Prisma client and build the Nest app
RUN bun run prisma:generate
RUN bun run build



# ---- Production Stage ----
FROM oven/bun:1 AS runner

WORKDIR /app

# Copy minimal necessary files
COPY package.json bun.lock ./
COPY prisma ./prisma/
COPY tsconfig.json tsconfig.build.json ./
COPY bootstrap.js ./

# Install only production dependencies
RUN apt-get update -y \
    && apt-get install -y openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && bun install --production

# Copy built output and Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy .env if you want Prisma & Nest to access environment variables
COPY .env .env

# Environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096

# Expose app port
EXPOSE 3000

# Start using bootstrap (registers tsconfig-paths, loads .env, starts main)
CMD ["node", "bootstrap.js"]
# ---- Build Stage ----
FROM oven/bun:1 AS builder

# Set working directory
WORKDIR /app

# Copy package and lock files first for better caching
COPY package.json bun.lock ./

# Copy Prisma schema early (so bun install and prisma generate cache works)
COPY prisma ./prisma/

# Install dependencies (includes devDependencies for build)
RUN bun install

# Copy all source files
COPY . .

# Generate Prisma client and build the Nest app
RUN bun run prisma:generate
RUN bun run build



# ---- Production Stage ----
FROM oven/bun:1 AS runner

WORKDIR /app

# Copy minimal necessary files
COPY package.json bun.lock ./
COPY prisma ./prisma/
COPY tsconfig.json tsconfig.build.json ./
COPY bootstrap.js ./

# Install only production dependencies
RUN apt-get update -y \
    && apt-get install -y openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && bun install --production

# Copy built output and Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096

# Expose app port
EXPOSE 3000

# Start using bootstrap (registers tsconfig-paths, loads .env, starts main)
CMD ["node", "bootstrap.js"]
