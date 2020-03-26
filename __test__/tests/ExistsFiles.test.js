const chai = require('chai');
const path = require('path');

// expect path
chai.use(require('chai-fs'));

const { expect } = chai;

describe('EXIST FILES', () => {
    it('CodeStyle', (done) => {
        expect(path.join(__dirname, '../../.eslintrc.json')).to.be.a.path();

        done();
    });
    it('Credentials', (done) => {
        expect(path.join(__dirname, '../../.env')).to.be.a.path();

        done();
    });
    it('package.json', (done) => {
        expect(path.join(__dirname, '../../package.json')).to.be.a.path();

        done();
    });
    it('package-lock.json', (done) => {
        expect(path.join(__dirname, '../../package-lock.json')).to.be.a.path();

        done();
    });
});
