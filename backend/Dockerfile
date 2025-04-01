FROM node:18

RUN apt-get update -y && apt-get install -y --no-install-recommends 

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]