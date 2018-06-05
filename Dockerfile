FROM node:9-alpine

RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN yarn install

EXPOSE 3000

ENTRYPOINT ["yarn", "start"]
