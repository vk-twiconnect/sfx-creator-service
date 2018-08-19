FROM node:10.9.0-alpine
RUN apk add \
        zip
WORKDIR /usr/src/app

COPY . .
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
