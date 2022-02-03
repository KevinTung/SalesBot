FROM node:16
WORKDIR /root/bot
RUN npm i -g autoinstall
COPY ../.././src/sales-bot_new.js ./src/sales-bot_new.js
RUN autoinstall ./src/sales-bot_new.js
CMD npm start