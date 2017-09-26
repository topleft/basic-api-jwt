(function(appConfig) {

  'use strict';

  // *** main dependencies *** //
  const path = require('path');
  const bodyParser = require('body-parser');
  const morgan = require('morgan');
  const cors = require('cors');

  appConfig.init = function(app, express) {

    // *** app middleware *** //
    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('dev'));
    }
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(bodyParser.json());

  };

})(module.exports);
