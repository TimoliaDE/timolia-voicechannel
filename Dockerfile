FROM node:latest

WORKDIR /bot/

COPY ./ /bot/

RUN npm install

RUN chmod +x start.sh
ENTRYPOINT ["start.sh"]