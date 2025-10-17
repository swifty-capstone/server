FROM node:24.7.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "start"]