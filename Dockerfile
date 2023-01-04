FROM node:16.19.0-alpine
WORKDIR app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["pm2start","server.js"]
