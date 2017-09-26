const moment = require('moment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const knex = require('../../db/connection');

const auth = {

  encodeToken(user) {
    const playload = {
      exp: moment().add(14, 'days').unix(),
      iat: moment().unix(),
      sub: user.id,
      username: user.username
    };
    return jwt.sign(playload, process.env.TOKEN_SECRET);
  },

  decodeToken(token) {
    // is jwt verify async?
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    const now = moment().unix();
    return new Promise((resolve, reject) => {
      // TODO what does jwt verify return if token is invalid?
      if (!payload) {
        reject('Invalid token.');
      } else if (payload.exp && now > payload.exp) {
        reject('Token has expired.');
      } else {
        resolve(payload);
      }
    });
  },

  comparePass(userpass, dbpass) {
    bcrypt.compareSync(userpass, dbpass);
  },

  checkAuthentication(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
      return res.status(400).json({
        message: 'Please log in.'
      });
    }
    // decode the token
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    auth.decodeToken(token)
      .then((payload) => {
        return knex('Users').where({id: parseInt(payload.sub)}).first()
          .then((user) => {
            req.user = {id: user.id};
            next();
          });
      })
      .catch((err) => {
        return res.status(401).json({
          message: err
        });
      });
  },

  createUser(user) {
    return new Promise((resolve, reject) => {
      this.handleUserErrors(user)
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

  editUser(user, id) {
    return this.handleUserErrors(user).then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(user.password, salt);
      return knex('Users').where({id: id}).update({
        username: user.username,
        password: hash
      }, '*');
    });
  },

  handleUserErrors(user) {
    return new Promise((resolve,reject) => {
      if (user.username.length < 6) {
        reject({
          err:'username_length',
          message:'Username must be longer than 6 characters'
        });
      } else if (user.password.length < 6) {
        reject({
          err:'password_length',
          message:'Password must be longer than 6 characters'
        });
      } else {
        resolve();
      }
    });
  },

  registerUser(req, res, next) {
    auth.createUser(req.body.user)
      .then((user) => { return auth.encodeToken(user[0]); })
      .then((token) => {
        res.status(200).json({
          message: `Success. '${req.body.user.username}' has been created.`,
          token: token
        });
      })
      .catch((err) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(400).json({message: 'Regsitration failed'});
        }
      });
  },

  login(req, res, next) {
    const username = req.body.user.username;
    const password = req.body.user.password;
    return knex('Users').where({username}).first()
    .then((user) => {
      auth.comparePass(password, user.password);
      return user;
    })
    .then((user) => { return auth.encodeToken(user); })
    .then((token) => {
      res.status(200).json({
        message: 'Success',
        token: token
      });
    })
    .catch((err) => {
      res.status(400).json({message: 'Login failed.'});
    });
  },

  getCurrentUser(req, res) {
    knex('Users').where({id: parseInt(req.user.id)}).first()
    .then((user) => {
      let result = Object.assign({}, user);
      delete result.password;
      res.status(200).json({data: result});
    })
    .catch((err) => {
      res.status(500).json({err: 'not-found', message: 'An error ocurred while getting the current user.'});
    });
  }

};

module.exports = auth;
