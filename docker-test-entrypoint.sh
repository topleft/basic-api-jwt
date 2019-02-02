BASIC_DB_TEST=postgres://localhost:5432/basic_db_test npm run knex -- migrate:latest --env test --knexfile ./knexfile.js
npm run test
