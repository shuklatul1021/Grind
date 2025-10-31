FROM node:alpine3.10

WORKDIR /apps/backend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "run", "dev"]