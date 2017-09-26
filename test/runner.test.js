const authRoutes = require('./routes/auth/auth');
const basicDao = require('./dao/basic-crud');
const authDao = require('./dao/auth');

authRoutes();
authDao();
basicDao();
