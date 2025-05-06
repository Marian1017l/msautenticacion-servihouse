# Etapa de construcción
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g typescript ts-node prisma
COPY prisma ./prisma
RUN npx prisma generate


COPY . .

EXPOSE 8001

CMD [ "npm", "start" ]