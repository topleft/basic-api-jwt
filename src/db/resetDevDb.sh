#!/bin/sh

knex migrate:rollback --env development --knexfile /knexfile.js
knex migrate:latest --env development --knexfile /knexfile.js
knex seed:run --env development --knexfile /knexfile.js
