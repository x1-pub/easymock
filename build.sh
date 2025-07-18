#!/bin/bash

git pull

cd ./web
yarn
npm run build

cd ../services
yarn
npm run build

cd ../proxy
yarn

cd ../
pm2 restart all