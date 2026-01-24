# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Increase memory for Node
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine

WORKDIR /app

# Copy built assets from the 'build' stage
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json* ./

# Install production dependencies (serve)
RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# Command to start the server
CMD ["npm", "start"]
