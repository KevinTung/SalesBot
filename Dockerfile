FROM node:16
RUN apt-get update && apt-get install -y libvips-dev
WORKDIR /root/bot
COPY . .
RUN npm i
CMD npm start
