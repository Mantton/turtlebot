# Specify a base image
FROM node:14.15.4-alpine AS alpine

COPY package*.json ./

# Install deps
RUN npm i

COPY . .

# Build dist
RUN npm run build

CMD npm run start