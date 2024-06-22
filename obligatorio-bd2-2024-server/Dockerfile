# Stage 1: Build the application
FROM node:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the build output and node_modules from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Define the command to run the application
CMD ["node", "dist/app.js"]
