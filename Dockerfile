FROM node:14-buster-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . ./

EXPOSE 8080

CMD ["node", "./dist/main.js"]