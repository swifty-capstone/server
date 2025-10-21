FROM node:24.7.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY src/prisma ./src/prisma

COPY src ./src

RUN npx prisma generate --schema=./src/prisma/schema.prisma

EXPOSE 3000
CMD ["npm", "start"]
