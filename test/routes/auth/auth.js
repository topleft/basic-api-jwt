const register = require('./register');
const login = require('./login');

module.exports = () => {
  console.log('DB CONNECTION', process.env.BASIC_DB_TEST);
  describe('auth routes', () => {
    register();
    login();
  });
};
