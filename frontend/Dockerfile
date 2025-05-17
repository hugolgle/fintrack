FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY vite.config.* ./
COPY . .

RUN npm install
RUN npm run build

FROM alpine

WORKDIR /app

COPY --from=build /app/dist .

CMD ["true"]