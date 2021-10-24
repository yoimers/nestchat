# FROM node:14-buster-slim


FROM node:14-stretch-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . ./

EXPOSE 8080

CMD ["npm", "run", "start"]