# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
