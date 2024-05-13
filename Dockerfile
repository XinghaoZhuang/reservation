FROM node:20-alpine as builder

# frontend
COPY client/dist ./client/dist

# backend
COPY server/src ./src
COPY server/package.json .
COPY server/yarn.lock .
COPY server/nest-cli.json .
COPY server/yarn.lock .
COPY server/tsconfig.json .

RUN yarn install
RUN yarn run build
CMD [ "node", "dist/main.js" ]