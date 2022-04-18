#!/bin/sh

cp /etc/configs/config.json `pwd`/config.json

node deploy-commands.js

node index.js