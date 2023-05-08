FROM node:12.18.4-alpine

RUN apk add --update python make g++\
   && rm -rf /var/cache/apk/*
   
WORKDIR /cache
COPY package.json .
COPY package-lock.json .
RUN npm install

FROM node:12.18.4-alpine
WORKDIR /build
COPY . .
COPY --from=0 /cache/node_modules ./node_modules
RUN npm run i18n:sheet
RUN npm run env:firebase-sw
RUN npm run build

FROM nginx
WORKDIR /app
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=1 /build/dist/ /var/www/html
