# Use Node 20 (or Bun if needed)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# Expose the port your app uses
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
