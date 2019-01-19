const moment = require('moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const knex = require('../../db/connection');

const auth = {

  encodeToken (user) {
    const playload = {
      exp: moment().add(14, 'days').unix(),
      iat: moment().unix(),
      sub: user.id,
      username: user.username
    };
    return jwt.sign(playload, process.env.TOKEN_SECRET);
  },

  decodeToken (token) {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    const now = moment().unix();
    return new Promise((resolve, reject) => {
      if (!payload) {
        reject(new Error('Invalid token.'));
      } else if (payload.exp && now > payload.exp) {
        reject(new Error('Token has expired.'));
      } else {
        resolve(payload);
      }
    });
  },

  comparePass (userpass, dbpass) {
    bcrypt.compareSync(userpass, dbpass);
  },

  checkAuthentication (req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
      const error = new Error('Please log in.');
      error.status = 401;
      return next(error);
    }
    // decode the token
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    auth.decodeToken(token)
      .then(payload => {
        return knex('Users').where({ id: parseInt(payload.sub) }).first()
          .then(user => {
            req.user = { id: user.id };
            next();
          });
      })
      .catch(error => {
        error.status = 401;
        return next(error);
      });
  },

  createUser (user) {
    return new Promise((resolve, reject) => {
      this.validateUserAndPassword(user)
        .then(() => {
          const salt = bcrypt.genSaltSync();
          const hash = bcrypt.hashSync(user.password, salt);
          knex('Users').insert({
            username: user.username,
            password: hash
          }, '*')
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
  },

  editUser (user, id) {
    return this.validateUserAndPassword(user)
      .then(() => {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(user.password, salt);
        return knex('Users').where({ id: id }).update({
          username: user.username,
          password: hash
        }, '*');
      });
  },

  validateUserAndPassword (user) {
    return new Promise((resolve, reject) => {
      if (user.username.length < 6) {
        const err = new Error('Username must be longer than 6 characters');
        err.status(400);
        reject(err);
      } else if (user.password.length < 6) {
        const err = new Error('Password must be longer than 6 characters');
        err.status(400);
        reject(err);
      } else {
        resolve();
      }
    });
  },

  registerUser (req, res, next) {
    auth.createUser(req.body.user)
      .then(user => { return auth.encodeToken(user[0]); })
      .then(token => {
        res.status(200).json({
          message: `Success. '${req.body.user.username}' has been created.`,
          token: token
        });
      })
      .catch(err => {
        next(err);
      });
  },

  login (req, res, next) {
    const username = req.body.user.username;
    const password = req.body.user.password;
    return knex('Users').where({ username }).first()
      .then(user => {
        auth.comparePass(password, user.password);
        return user;
      })
      .then(user => { return auth.encodeToken(user); })
      .then(token => {
        res.status(200).json({
          message: 'Success',
          token: token
        });
      })
      .catch(err => {
        next(err);
      });
  },

  getCurrentUser (req, res, next) {
    knex('Users').where({ id: parseInt(req.user.id) }).first()
      .then(user => {
        let result = Object.assign({}, user);
        delete result.password;
        res.status(200).json({ data: result });
      })
      .catch(err => {
        next(err);
      });
  }

};

module.exports = auth;
