FROM node:10

WORKDIR /usr/src

COPY knexfile.js ./
COPY package*.json ./

RUN npm install

COPY ./src ./src/.

EXPOSE 3030

CMD [ "npm", "start" ]
