const path = require('path');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      port: process.env.DATABASE_PORT,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
    pool: {
      min: 0,
      max: 4
    },
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
