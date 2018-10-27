const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const { HTTP_STATUS_CODES } = require('../app/config');
const { startServer, stopServer, app } = require('../app/server.js');
const { User } = require('../app/user/user.model');

const expect = chai.expect; // So we can do "expect" instead of always typing "chai.expect"
chai.use(chaiHttp); // implements chai http plugin

describe('Integration tests for: /api/user', function () {
    let testUser;

    // Mocha Hook: Runs before ALL the "it" test blocks.
    before(function () {
        // Be sure to always return a promise to Mocha when doing asynchronous work,
        // Otherwise Mocha will just asume your work is done even if it isn't.

        // Starts our Express Server, so we can test it.
        return startServer(true);
    });

    // Mocha Hook: Runs before EACH "it" test block.
    beforeEach(function () {
        testUser = createFakerUser();
        // Create a randomized test user.
        return User.create(testUser)
            .then(() => { })
            .catch(err => {
                console.error(err);
            });
    });

    // Mocha Hook: Runs after EACH "it" test block.
    afterEach(function () {
        // Be sure to always return a promise to Mocha when doing asynchronous work,
        // Otherwise Mocha will just asume your work is done even if it isn't.
        return new Promise((resolve, reject) => {
            // Deletes the entire database.
            mongoose.connection.dropDatabase()
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    console.error(err);
                    reject(err);
                });
        });
    });

    // Mocha Hook: Runs after ALL the "it" test blocks.
    after(function () {
        // Be sure to always return a promise to Mocha when doing asynchronous work,
        // Otherwise Mocha will just asume your work is done even if it isn't.

        // Shuts down our Express Server, since we don't need it anymore.
        return stopServer();
    });

    it('Should create a new user', function () {
        let newUser = createFakerUser();
        return chai.request(app)
            .post('/api/user')
            .send(newUser)
            .then(res => {
                expect(res).to.have.status(HTTP_STATUS_CODES.CREATED);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'name', 'username', 'email');
                expect(res.body.name).to.equal(newUser.name);
                expect(res.body.email).to.equal(newUser.email);
                expect(res.body.username).to.equal(newUser.username);
            });
    });

    function createFakerUser() {
        return {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            username: `${faker.lorem.word()}${faker.random.number(100)}`,
            password: faker.internet.password(),
            email: faker.internet.email()
        };
    }
});