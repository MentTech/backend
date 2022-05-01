<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="https://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

API server for mentoring system.

## Installation

- Open `.env.example` file and change the variables to your needs.
- Rename `.env.example` to `.env`
- Run these following commands:

```bash
$ yarn install
```

## Environment variable

```
DATABASE_URL="postgresql://<username>:<password>@<address>:<port>/<database>?schema=<schema_name>"
JWT_SECRET=<jwt_secret_string>
JWT_EXPIRE=<jwt_expire_time_in_second>
MAIL_SMTP_HOST=<smtp_host>
MAIL_USERNAME=<email_username>
MAIL_PASSWORD=<email_password>
MAIL_FROM=<from_email>
FRONT_END_URL=<front_end_url>
PORT=8080
```

```

## Running the app

```bash
# apply migrations to database (development)
$ yarn prisma migrate dev

# apply migrations to database (deployment)
$ yarn prisma migrate deploy

# every time pull new code run
$ yarn prisma generate

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

`/v1/docs`

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
