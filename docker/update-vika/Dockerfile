FROM node:16
WORKDIR /root/bot
COPY ../.././package.json ./package.json
COPY ../.././package-lock.json ./package-lock.json
RUN npm i --registry=https://registry.npmmirror.com
COPY . .
CMD node src/