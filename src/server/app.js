// *** external dependencies *** //
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var winston = require('./config/winston');
const cors = require('cors');

// *** internal dependencies *** //
const routes = require('./routes/routes');

// *** express instance *** //
const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: winston.stream }));
}
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// *** register routes *** //
app.use('/auth/', routes.auth);
app.use('/api/', routes.notes);

// *** error handling *** //

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  const formattedError = JSON.stringify({
    error: err.message,
    stack: err.stack,
    status: err.status,
    originalUrl: req.orginalUrl
  });

  winston.error(formattedError);

  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      name: err.name
    }
  });
});

module.exports = app;
