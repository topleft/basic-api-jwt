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

### End Points:

#### Notes
---

> ##### GET /api/notes

```
response

      {  
        data: [
          {
            id: 1
            body: 'finish api markdown'
          },
          {
            id: 2,
            body: 'make coffee'
          },
          {
            id: 3,
            body: 'buy socks'
          }
        ]
      }
```

> ##### GET /api/notes/:id

```
response

      {
        data: {
          id: 1
          body: 'finish api markdown'
        },
      }
```

> ##### POST /api/notes

```
post body

      {
        body: 'take a note'
      }

response

      {
        data: {
          id: 4,
          body: 'take a note'
        },
        "message": "Created new row in Notes"
      }

```

> ##### PUT /api/notes/:id

```
body
      {
        body: 'update a note'
      }

response
      {
        data: {
          id: 1,
          body: 'update a note'
        },
        "message": "Edited id 1 in Notes"
      }

```
> ##### DELETE /api/notes/:id

```
response
      {
        "message": "Deleted id 1 in Notes"
      }
```

#### Auth
---
> ##### POST /auth/register

```
body  

      {
        user: {
          username: String, // > 6 characters
          password: String  // > 6 characters
        }
      }

response

      {
        message: String,
        token: JWT Token,
      }

```

---

> ##### POST /auth/login

```
body  

      {
        user: {
          username: String,
          password: String  
        }
      }

response

      {
        message: String,
        token: JWT Token,
      }

```
---

> ##### GET /auth/current_user

```
header  

      Authorization: 'Bearer ' + token

response

      {
        message: String,
        data: {
          username: String,
          _id: String
        }
      }

```
