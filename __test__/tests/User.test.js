/* eslint-disable no-underscore-dangle */
const htmlParser = require('htmlparser2');
const request = require('supertest');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const server = require('../../src/server/server');
const UtilService = require('../../src/components/User/service');
const testUser = require('../test-user');
const testAdmin = require('../test-admin');

chai.use(chaiAsPromised);

const { expect } = chai;
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTc4ZmY1NTk2ZTE2ZTIxMzg5NzEwZjMiLCJuYW1lIjoiU2VyZ2UiLCJpYXQiOjE1ODUxNjUyOTksImV4cCI6MTU4NTE3MjQ5OX0.EhYAjJBmEpBhi20ISvepurjcBuYCmiCjNZH6pcyBW2w';

let testUserId;
let csrfToken;

const csrfParser = new htmlParser.Parser({
    onopentag(name, attribs) {
        if (name === 'input' && attribs.id === 'csrf-main') {
            testUser._csrf = attribs.value;
            testAdmin._csrf = attribs.value;
            csrfToken = attribs.value;
        }
    },
});

describe('UserComponent -> controller', () => {
    before(() => {
        UtilService.create(testUser)
            .then((data) => {
                testUserId = data._id.toString();
            });
    });
    after(() => {
        UtilService.deleteById(testUserId);
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
    it(`UserComponent -> controller -> /v1/users/${testUserId}`, (done) => {
        request(server)
            .get(`/v1/users/${testUserId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBodyData = expect(body.data);
                expectBodyData.to.have.property('_id').and.to.equal(testUserId);
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
    it('UserComponent -> controller -> /v1/users/ (method post, creating user)', (done) => {
        request(server)
            .get('/v1/auth')
            .end((errLogin, resLogin) => {
                // parses csrf token
                csrfParser.write(resLogin.text);
                request(server)
                    .post('/v1/users')
                    .set('Content-Type', 'application/json')
                    .set('cookie', resLogin.headers['set-cookie'])
                    .send(JSON.stringify(testAdmin))
                    .expect(401, done);
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
                        id: testUserId,
                        fullName: 'CHANGED NAME',
                        _csrf: testUser._csrf,
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
                        id: testUserId,
                        _csrf: testUser._csrf,
                    }))
                    .expect(403, done);
            });
    });
});
