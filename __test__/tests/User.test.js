/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const server = require('../../src/server/server');
const UtilService = require('../../src/components/User/service');
const testUser = require('../test-user');

chai.use(chaiAsPromised);

const { expect } = chai;

let TEST_USER_ID;

describe('UserComponent -> controller', () => {
    before(() => {
        UtilService.create(testUser)
            .then((data) => {
                TEST_USER_ID = data._id.toString();
            });
    });
    after(() => {
        UtilService.deleteById(TEST_USER_ID);
    });
    it('UserComponent -> controller -> /v1/users/ (method get)', (done) => {
        request(server)
            .get('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(401)
            .then(() => done())
            .catch((err) => done(err));
    });
    it(`UserComponent -> controller -> /v1/users/${TEST_USER_ID}`, (done) => {
        request(server)
            .get(`/v1/users/${TEST_USER_ID}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBodyData = expect(body.data);
                expectBodyData.to.have.property('_id').and.to.equal(TEST_USER_ID);
                done();
            })
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v1/users/WRONG_ID', (done) => {
        request(server)
            .get('/v1/users/WRONG_ID')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(422)
            .then(() => done())
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v1/users/ (method post)', (done) => {
        request(server)
            .get('/v1/users')
            .end((err, res) => {
                request(server)
                    .post('/v1/users')
                    .set('Content-Type', 'application/json')
                    .set('cookie', res.headers['set-cookie'])
                    .send(JSON.stringify(testUser))
                    .expect(403, done);
            });
    });
    it('UserComponent -> controller -> /v1/users/update', (done) => {
        request(server)
            .get('/v1/users')
            .end((err, res) => {
                request(server)
                    .post('/v1/users/update')
                    .set('Content-Type', 'application/json')
                    .set('cookie', res.headers['set-cookie'])
                    .send(JSON.stringify({
                        id: TEST_USER_ID,
                        fullName: 'CHANGED NAME',
                    }))
                    .expect(403, done);
            });
    });
    it('UserComponent -> controller -> /v1/users/delete', (done) => {
        request(server)
            .get('/v1/users')
            .end((err, res) => {
                request(server)
                    .post('/v1/users/delete')
                    .set('Content-Type', 'application/json')
                    .set('cookie', res.headers['set-cookie'])
                    .send(JSON.stringify({
                        id: TEST_USER_ID,
                    }))
                    .expect(403, done);
            });
    });
});
