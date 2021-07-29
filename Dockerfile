# Specify a base image
FROM node:14.15.4-alpine AS alpine


ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app
RUN npm ci --only=production
RUN npm run build
USER node

CMD ["npm", "run", "start"]

# # Add package file
# COPY package*.json ./

# # Install deps
# RUN npm i

# # Copy source
# # COPY src ./src
# # COPY config ./config
# # COPY tsconfig.json ./tsconfig.json

# COPY . .

# # Build dist
# RUN npm run build

# EXPOSE 6000

# CMD npm run start