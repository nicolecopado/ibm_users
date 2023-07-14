FROM node:16.14.2

WORKDIR /app

COPY package*.json ./

RUN npm install
#ENV DATABASE_STRING DATABASE=bludb;HOSTNAME=1bbf73c5-d84a-4bb0-85b9-ab1a4348f4a4.c3n41cmd0nqnrk39u98g.databases.appdomain.cloud;PORT=32286;PROTOCOL=TCPIP;UID=mgh62667;PWD=H0YvJQ02LxhMh2jJ;Security=SSL
#ENV JWT_SECRETKEY carlos123
COPY . .

CMD ["npm", "start"]