# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Install Redis inside the same container
RUN apk add --no-cache redis

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock first for caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the rest of the application
COPY . .

# Build the NestJS app
RUN yarn build

# Expose the application and Redis ports
EXPOSE 3000 6379

# Start both Redis and the NestJS app
CMD redis-server --daemonize no & node dist/main.js
