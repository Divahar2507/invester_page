# Frontend Dockerfile - React Vite Application
# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Increase memory for Node
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
RUN npm install tailwindcss@3.4.17 postcss@8.4.38 autoprefixer@10.4.19
RUN node -e "console.log('INSTALLED TAILWIND VERSION:', require('tailwindcss/package.json').version)"
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
