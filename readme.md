[![Build Status](https://travis-ci.org/topleft/basic-api-jwt.svg?branch=master)](https://travis-ci.org/topleft/basic-api-jwt)

### Node Express Basic API with JWT Auth

A test-driven api with basic crud routes easily extended to new collections.

### Run Locally:

You will need postgresql installed on you machine. For mac users, go [here](http://postgresapp.com/).

Run these command to set up your local environment:
```
npm install
createdb basic_db
createdb basic_db_test
export BASIC_DB=postgres://localhost:5432/basic_db
export BASIC_DB_TEST=postgres://localhost:5432/basic_db_test
export TOKEN_SECRET=verysecret
```

Migrate databases (dev and testing):

```
sh resetDevDb.sh
sh resetTestDb.sh
```

Run the tests:

```
npm test
```

Run on localhost:3030:

```
gulp
```

Routes:

```
```
