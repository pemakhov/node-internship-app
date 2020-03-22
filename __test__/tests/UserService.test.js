/* eslint-disable no-underscore-dangle */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const UtilService = require('../../src/components/User/service');
const testUser = require('../test-user');

chai.use(chaiAsPromised);

const { expect } = chai;

let TEST_USER_ID;

describe('UserComponent -> service', () => {
    it('UserComponent -> service -> create', (done) => {
        expect(UtilService.create(testUser)
            .then((data) => {
                TEST_USER_ID = data._id;
                return data;
            }))
            .to.eventually.have.a.property('_id');
        done();
    });
    it('UserComponent -> service -> findAll', (done) => {
        expect(UtilService.findAll())
            .to.eventually.be.an('array');
        done();
    });
    it('UserComponent -> service -> findById', (done) => {
        expect(UtilService.findById(TEST_USER_ID))
            .to.eventually.have.property('fullName');
        done();
    });
    it('UserComponent -> service -> updateById', (done) => {
        expect(UtilService.updateById(TEST_USER_ID, { fullName: 'Updated Name' })
            .to.eventually.have.property('ok').to.equal(1));
        done();
    });
    it('UserComponent -> service -> deleteById', (done) => {
        expect(UtilService.deleteById(TEST_USER_ID))
            .to.eventually.have.property('ok').to.equal(1);
        done();
    });
});
