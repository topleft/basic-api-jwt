
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('Notes').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('Notes').insert({ body: 'test1' }),
        knex('Notes').insert({ body: 'test2' }),
        knex('Notes').insert({ body: 'test3' })
      ]);
    });
};
