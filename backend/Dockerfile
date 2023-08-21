FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install bcrypt jsonwebtoken express-validator

RUN npm install dotenv

RUN npm install

COPY . .

EXPOSE 3001
CMD ["node", "server.js"]