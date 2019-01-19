/* eslint-disable no-unused-expressions */

process.env.NODE_ENV = 'test';

const knex = require('../../../src/db/connection');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../../src/server/app');

const tests = () => {
  describe('auth/login', () => {
    describe('errors', () => {
      it('should not login unregistered user', done => {
        chai.request(server)
          .post('/auth/login')
          .send({
            user: {
              username: 'user',
              password: 'pass'
            }
          })
          .end((err, res) => {
            expect(err.status).to.equal(401);
            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('Login failed.');
            done();
          });
      });
    });

    describe('success', () => {
      const user = {
        username: 'user123',
        password: 'pass123'
      };

      before(done => {
        chai.request(server)
          .post('/auth/register')
          .send({
            user
          })
          .end(() => {
            done();
          });
      });

      after(done => {
        knex('Users').del().then(() => {
          done();
        });
      });

      it('should login a user', done => {
        chai.request(server)
          .post('/auth/login')
          .send({
            user
          })
          .end((err, res) => {
            expect(err).to.be.null;
            res.body.token.should.exist;
            res.body.message.should.contain('Success');
            done();
          });
      });
    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
