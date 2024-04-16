FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
RUN npm run postinstall
EXPOSE 8081
CMD ["node", "dist/app.js"]
