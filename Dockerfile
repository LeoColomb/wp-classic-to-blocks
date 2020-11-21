FROM node

WORKDIR /opt/project

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY index.js .

CMD [ "node", "index.js" ]
