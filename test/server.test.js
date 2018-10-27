const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const { startServer, stopServer, app } = require('../app/server.js')

describe('Intergration test for: /', function () {
    before(function() {
        return startServer(true)
    });

    after(function() {
        return stopServer(true);
    });

    it('Should return index.html', function() {
        chai.request(app)
            .get('/')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                expect(res.text).to.have.string('<!DOCTYPE html>')
            });
    });
});