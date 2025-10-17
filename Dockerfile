FROM node:24.7.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]