#!/bin/sh

npm run knex migrate:rollback --env test --knexfile ../knexfile.js
npm run knex migrate:latest --env test --knexfile ../knexfile.js
npm run knex seed:run --env test --knexfile ../knexfile.js
