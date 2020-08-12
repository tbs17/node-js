FROM node:8

WORKDIR /home/nodejs/app

COPY . .

RUN npm install --production

EXPOSE 3000

ENV NODE_ENV production

CMD ["node","index.js"]