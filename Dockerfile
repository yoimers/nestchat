FROM node:14.18-stretch-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . ./

EXPOSE 8080

RUN npm run prisma:generate && npm run prisma:migrate
CMD ["npm", "run", "start"]