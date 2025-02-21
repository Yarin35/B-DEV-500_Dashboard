FROM node:14

WORKDIR /app

COPY package*.json .
RUN npm install && npm i -g nodemon

COPY . .

EXPOSE 8080

CMD ["nodemon", "src/app.js"]
