const express = require('express');
const jwt = require('jsonwebtoken');

const { localPassportMiddleware, jwtPassportMiddleware } = require('../auth/auth.strategy');
const { JWT_SECRET, JWT_EXPIRY } = require('../config.js');

const authRouter = express.Router();

//Recieve the user and encrypt into a json web token
function createJwtToken(user) {
    return jwt.sign({ user }, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
}

//Checks to see if the user is valid
authRouter.post('/login', localPassportMiddleware, (request, response) => {
    //If the user is valid, the variable "user" will have the user's data inside of it
    const user = request.user.serialize();
    //Create the json web token for the user to use
    const jwtToken = createJwtToken(user);
    response.json({ jwtToken, user });
});

//Checks to see if the json web token is valid
authRouter.post('/refresh', jwtPassportMiddleware, (request, response) => {
    //If the json web token is valid, the variable "user" will have the user's data inside of it
    const user = request.user;
    //"renew" the json web token
    const jwtToken = createJwtToken(user);
    response.json({ jwtToken, user });
});

//export the authRouter function
module.exports = { authRouter };
