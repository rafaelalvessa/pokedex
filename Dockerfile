FROM node:lts
WORKDIR /usr/src/pokedex
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build
EXPOSE 5000
CMD ["node", "build/index.js"]
