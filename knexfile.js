const path = require('path');

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.BASIC_DB,
    migrations: {
      directory: path.join(__dirname, '/src/db/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/src/db/seeds')
    }
  },
  test: {
    client: 'postgresql',
    connection: process.env.BASIC_DB_TEST,
    migrations: {
      directory: path.join(__dirname, '/src/db/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/src/db/seeds')
    }
  }
};
