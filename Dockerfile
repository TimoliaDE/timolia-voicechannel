FROM node:latest

WORKDIR /
RUN npm install
RUN chmod +x /start.sh
ENTRYPOINT ["/start.sh"]