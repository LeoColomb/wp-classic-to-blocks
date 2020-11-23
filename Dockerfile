FROM node

WORKDIR /opt/project

COPY package.json .
COPY package-lock.json .

RUN npm install --production

COPY src src
COPY index.js .
COPY cli.js .

CMD [ "node", "cli.js" ]
