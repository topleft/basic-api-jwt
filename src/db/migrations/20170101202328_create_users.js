
exports.up = function (knex) {
  return knex.schema.createTable('Users', table => {
    table.increments();
    table.string('username').unique().notNullable();
    table.specificType('password', 'char(60)').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('Users');
};
