/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(chaiHttp);

const server = require('../../src/server/app');
const auth = require('../../src/server/controllers/auth');

const tests = () => {
  describe('encodeToken()', () => {
    it('should return a token', done => {
      const results = auth.encodeToken({ id: 1 });
      should.exist(results);
      results.should.be.a('string');
      done();
    });
  });

  describe('decodeToken()', () => {
    it('should return a token', () => {
      const token = auth.encodeToken({ id: 1, username: 'user123' });
      should.exist(token);
      return auth.decodeToken(token)
        .then(result => {
          result.sub.should.eql(1);
          result.username.should.eql('user123');
        })
        .catch(err => {
          err.should.not.exist();
        });
    });
  });

  describe('checkAuthentication()', () => {
    it('should deny access if a request is not authenticated', done => {
      chai.request(server)
        .get('/auth/current_user')
        .end((err, res) => {
          err.status.should.eql(401);
          res.status.should.eql(401);
          res.body.error.message.should.contain('Please log in');
          done();
        });
    });

    it('should ALLOW access if a request is authenticated', done => {
      chai.request(server)
        .post('/auth/register')
        .send({ user: {
          username: 'user123',
          password: 'password123'
        }
        })
        .end((err, res) => {
          expect(err).to.be.null;
          chai.request(server)
            .get('/auth/current_user')
            .set('authorization', 'Bearer ' + res.body.token)
            .end((err, res) => {
              expect(err).to.be.null;
              res.status.should.eql(200);
              res.type.should.eql('application/json');
              res.body.data.should.exist;
              should.not.exist(res.body.data.password);
              done();
            });
        });
    });
  });
};

if (process.env.NODE_ENV === 'test') {
  module.exports = tests;
}
