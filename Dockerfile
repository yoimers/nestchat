FROM node:14.18-stretch-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . ./

EXPOSE 8080

RUN npx prisma generate && npx prisma migrate
CMD ["npm", "run", "start"]