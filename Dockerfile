FROM node:20

RUN apt-get update && apt-get install -y 

WORKDIR /app

COPY package*.json .

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]