const knex = require('../../db/connection');

module.exports = {

  getAll: (table) => {
    return knex(table)
    .select();
  },

  getOne: (table, id) => {
    return knex(table)
    .select()
    .where('id', id)
    .first();
  },

  addOne: (table, newDoc) => {
    return knex(table)
    .returning('*')
    .insert(newDoc);
  },

  editOne: (table, id, editedFields) => {
    return knex(table)
    .returning('*')
    .update(editedFields)
    .where('id', id);
  },

  deleteOne: (table, id) => {
    if (!id) {
      return Promise.reject('no id supplied');
    }
    return knex(table)
    .del()
    .where('id', id);
  }

};
