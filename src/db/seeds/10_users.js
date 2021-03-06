'use strict';

const users = [
  {
    username: 'seedUserOne',
    password: 'seedPasswordOne'
  },
  {
    username: 'seedUserTwo',
    password: 'seedPasswordTwo'
  }
];

exports.seed = knex => {
  return knex('Users').del()
    .then(() => {
      return knex('Users').insert(users);
    });
};
