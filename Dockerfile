FROM node:7.7.4

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
