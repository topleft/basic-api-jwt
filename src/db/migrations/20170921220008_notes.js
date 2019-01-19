
exports.up = function (knex) {
  return knex.schema.createTable('Notes', table => {
    table.increments();
    table.string('body').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Notes');
};
