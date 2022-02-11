FROM node:14 as builder
WORKDIR /bhargav/app
COPY package*.json ./

RUN npm install -g npm
RUN npm install
COPY . .

COPY ./src/ormconfig.docker.ts ./src/ormconfig.ts
RUN npm run build

FROM node:14
WORKDIR /bhargav/app
COPY package*.json ./
RUN npm install -g npm
RUN npm install

COPY --from=builder /bhargav/app/dist ./dist

COPY .env .

EXPOSE 8800

CMD node dist/main.js
