/* eslint-disable no-unused-expressions */

const knex = require('../../src/db/connection');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const crud =
  require('../../src/server/controllers/basic-crud');
const fixtures =
  require('../fixtures/index');
chai.use(chaiAsPromised);

const tables = ['Notes'];

const tests = () => {
  tables.forEach(table => {
    describe(`${table} helpers`, () => {
      describe('getAll', () => {
        before(() => {
          return knex(table).del()
            .then(result => {
              return knex(table)
                .insert(fixtures[table].items)
                .should.be.fulfilled;
            });
        });

        it(`should get an array of ${table}`, () => {
          return crud.getAll(table)
            .should.eventually.have.length(3);
        });
      });

      describe('getOne', () => {
        before(() => {
          return knex(table).del()
            .then(result => {
              return knex(table)
                .insert(fixtures[table].items)
                .should.be.fulfilled;
            });
        });

        it(`should get a row in ${table}`, () => {
          return crud.getOne(table, fixtures[table].items[0].id)
            .should.eventually.include(fixtures[table].items[0]);
        });
      });

      describe('addOne', () => {
        before(done => {
          knex(table).del()
            .then(result => {
              done();
            });
        });

        it(`should create a row in ${table}`, () => {
          return crud.addOne(table, fixtures[table].items[0])
            .should.be.fulfilled
            .then(res => {
              return knex(table).select().where({ id: res[0].id });
            })
            .then(result => {
              expect(result[0]).to.have.property('id');
              expect(result[0]).to.include(fixtures[table].items[0]);
            });
        });
      });

      describe('editOne', () => {
        let id;

        beforeEach(() => {
          return knex(table).del()
            .then(result => {
              return knex(table)
                .returning('id')
                .insert(fixtures[table].items[0]);
            })
            .then(res => {
            // insert is successful it will return an array of ids
              res.should.be.a.array;
              id = res[0];
            });
        });

        it(`should edit a row in ${table}`, () => {
          return crud.editOne(table, id, fixtures[table].edit)
            .then(() => {
              return knex(table)
                .select()
                .where('id', id);
            })
            .then(result => {
              expect(result[0]).to.have.property('id');
              expect(result[0]).to.include(fixtures[table].edit);
            });
        });
      });

      describe('deleteOne', () => {
        let rowFromDb;

        before(() => {
          return knex(table).select().first()
            .should.be.fulfilled
            .then(result => {
              rowFromDb = result;
            });
        });

        it('should not delete if no id is passed', () => {
          return crud.deleteOne(table)
            .should.be.rejectedWith('no id supplied');
        });

        it('should not delete if the argument is not a number', () => {
          return crud.deleteOne(table, ['id'])
            .should.be.rejected;
        });

        it(`should remove a row from ${table}`, () => {
          return crud.deleteOne(table, rowFromDb.id)
            .should.be.fulfilled
            .then(() => {
              return knex(table).select().where('id', rowFromDb.id)
                .should.eventually.be.empty;
            });
        });
      });
    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
