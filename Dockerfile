# Use Node.js 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock first (for caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the rest of the application (including src/)
COPY . .

# Rebuild bcrypt inside Docker
RUN yarn remove bcrypt && yarn add bcrypt

# Build the NestJS app
RUN yarn build

# Expose the port
EXPOSE 3000

# Start the NestJS app
CMD ["node", "dist/main.js"]
