FROM node:latest

WORKDIR /bot/

COPY package.json package.json
COPY config.json config.json
COPY start.sh start.sh

RUN npm install

RUN chmod +x /bot/start.sh

ENTRYPOINT ["/bot/start.sh"]