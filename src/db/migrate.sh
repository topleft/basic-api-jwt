#!/bin/sh

docker-compose run db-manager knex migrate:latest --env development --knexfile app/knexfile.js
docker-compose run db-manager knex migrate:latest --env test --knexfile app/knexfile.js
