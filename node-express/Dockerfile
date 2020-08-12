# FROM node:12.4-alpine

# RUN mkdir /app
# WORKDIR /app

# COPY package.json package.json
# RUN npm install && mv node_modules /node_modules

# COPY . .

# LABEL maintainer="tracy"

# CMD node index.js

FROM node:8

WORKDIR /home/nodejs/app

COPY . .

RUN npm install --production

EXPOSE 3000

ENV NODE_ENV production
# same as npm start
CMD ["npm","start"]

