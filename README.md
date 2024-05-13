# reservation
# client
the frontend of the project, powered by vue, graphql, and restful API.

## Installation

```bash
$ yarn install
```

## Running the app
the service will run on localhost:8080, you need to proxy backend with localhost:3000
```bash
# development
$ yarn serve
```

## Build the bundle
```bash
# development
$ yarn build
```

# server
the backend of the project. It will serve the frontend page by static files. So after building of the frontend client, you can just run the backend.

## Installation

```bash
$ yarn install
```

## Running the app
the service will run on localhost:3000
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## API doc
See [swagger](http://localhost:3000/api). It shows data schema and API details.
See [graphql playground](http://localhost:3000/graphql). It shows graphql playground

## Unit-Test
```bash
yarn run test:cov
```

## Develop locally
For local development, you could put your mongo_url in .env file. And putting .env into .gitignore is a better way.
```bash
# .env
MONGO_URL = 'mongodb://localhost:27017/test'
```

# Run with docker
Build docker image with Dockerfile. We name the example image as 'space', which is used in the docker-compose file. In the docker-compose file, you should keep your MONGO_URL secret.
```bash
# build fe
$ cd client
$ yarn build

# build image
docker build . -t reservation

# docker compose
docker-compose up -d
```

# Others
The server will init admin users (you also could add admin user by change the env ADMIN_PHONE and ADMIN_PASSWORD);
If you use admin_user to login, you could visit all reservations of the whole system.
If you use ordinary user, you could only visit your own reservations.
