/* eslint-disable no-underscore-dangle */
const htmlParser = require('htmlparser2');
const request = require('supertest');
const chai = require('chai');
const server = require('../../src/server/server');
const testUser = require('../test-user');

const { expect } = chai;
// Please, insert an existing user ID from your database collection
const userId = '5e583444e156851804e06ac5';

const parser = new htmlParser.Parser({
    onopentag(name, attribs) {
        if (name === 'input' && attribs.id === 'csrf-main') {
            testUser._csrf = attribs.value;
        }
    },
});

describe('UserComponent -> controller', () => {
    it('UserComponent -> controller -> /v1/users/ (method get)', (done) => {
        request(server)
            .get('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(401)
            .then(() => done())
            .catch((err) => done(err));
    });
    it(`UserComponent -> controller -> /v1/users/${userId}`, (done) => {
        request(server)
            .get(`/v1/users/${userId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBodyData = expect(body.data);

                expectBodyData.to.have.property('_id').and.to.equal(userId);
                expectBodyData.to.have.property('fullName');
                expectBodyData.to.have.property('email');

                done();
            })
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v1/users/WRONG_ID', (done) => {
        request(server)
            .get('/v1/users/WRONG_ID')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(422)
            .then(() => done())
            .catch((err) => done(err));
    });
    it('UserComponent -> controller -> /v1/users/ (method post)', (done) => {
        request(server)
            .get('/v1/users')
            .end((err, res) => {
                parser.write(res.text);

                request(server)
                    .post('/v1/users')
                    .set('Content-Type', 'application/json')
                    .set('cookie', res.headers['set-cookie'])
                    .send(JSON.stringify(testUser))
                    .expect(403, done);
            });
    });
    // it('UserComponent -> controller -> /v1/users/update', (done) => {
    //     request(server)
    //         .get('/v1/users')
    //         .end((err, res) => {
    //             parser.write(res.text);

    //             request(server)
    //                 .post('/v1/users/update')
    //                 .set('Content-Type', 'application/json')
    //                 .set('cookie', res.headers['set-cookie'])
    //                 .send(JSON.stringify({
    //                     id: userId,
    //                     fullName: 'CHANGED NAME',
    //                     _csrf: testUser._csrf,
    //                 }))
    //                 .expect(302, done);
    //         });
    // });
    // it('UserComponent -> controller -> /v1/users/delete', (done) => {
    //     request(server)
    //         .get('/v1/users')
    //         .end((err, res) => {
    //             parser.write(res.text);

    //             request(server)
    //                 .post('/v1/users/delete')
    //                 .set('Content-Type', 'application/json')
    //                 .set('cookie', res.headers['set-cookie'])
    //                 .send(JSON.stringify({
    //                     id: '5e6a9f8b565e646597bd4582',
    //                     _csrf: testUser._csrf,
    //                 }))
    //                 .expect(302, done);
    //         });
    // });
});
