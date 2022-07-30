FROM node:latest

WORKDIR /bot/

COPY commands/ commands/
COPY events/ events/
COPY package.json package.json
COPY config.json config.json
COPY start.sh start.sh
COPY index.js index.js
COPY deploy-commands.js deploy-commands.js

RUN npm install

RUN chmod +x /bot/start.sh

ENTRYPOINT ["/bot/start.sh"]