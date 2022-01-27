FROM node:13.12.0-alpine

WORKDIR /frontend
COPY ./capsulator/package.json /frontend
RUN npm install
COPY ./capsulator/ /frontend/
