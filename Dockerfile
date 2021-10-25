FROM node:14.18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . ./

EXPOSE 8080

RUN chmod +x ./start.sh
CMD  ["./start.sh"]