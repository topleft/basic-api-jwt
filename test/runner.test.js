const authRoutes = require('./routes/auth/auth');
const basicDao = require('./controllers/basic-crud');
const authDao = require('./controllers/auth');

authRoutes();
authDao();
basicDao();
