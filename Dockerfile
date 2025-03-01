# Use Node.js 20
FROM node:20-alpine

# Install Redis inside the container
RUN apk add --no-cache redis

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock first (for caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Install NestJS CLI globally
RUN yarn global add @nestjs/cli

# Rebuild bcrypt inside Docker
RUN yarn remove bcrypt && yarn add bcrypt

# Copy the rest of the application
COPY . .

# Build the NestJS app
RUN yarn build

# Expose the application and Redis ports
EXPOSE 3000 6379

# Start both Redis and the NestJS app
CMD sh -c "redis-server --daemonize no && node dist/main.js"
