FROM node:18

WORKDIR /soccer

COPY package*.json ./

RUN npm install axios

RUN npm install bootstrap

RUN npm install react-router-dom

RUN npm install http-proxy-middleware

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
