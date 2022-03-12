<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

API server for mentoring system.

## Installation

```bash
$ yarn install
  
# every time pull new code run
$ yarn prisma generate
```

## Environment variable

```
DATABASE_URL="postgresql://<username>:<password>@<address>:<port>/<database>?schema=<schema_name>"
JWT_SECRET=<jwt_secret_string>
PORT=8080
```

## Running the app

```bash
# apply migrations to database
$ yarn prisma migrate deploy

# start prisma studio server
$ yarn prisma studio

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## API documentation

/v1/docs

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
