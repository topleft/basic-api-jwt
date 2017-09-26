
exports.up = function(knex, Promise) {
  return knex.schema.createTable('Notes', (table) => {
    table.increments();
    table.string('body').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('Notes');
};
