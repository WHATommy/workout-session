const express = require('express');
const Joi = require('joi');

const { HTTP_STATUS_CODES } = require('../config.js');
const { User, UserJoiSchema } = require('./user.model.js');

const userRouter = express.Router();

// CREATE NEW USER using the express application methods
userRouter.post('/', (request, response) => {
    //The user's input being placed into one variable, newUser
    const newUser = {
        name: request.body.name,
        email: request.body.email,
        username: request.body.username,
        password: request.body.password
    };

    //Joi will start comparing the user's values against Joi's model to see whether its value inputs or not
    const validation = Joi.validate(newUser, UserJoiSchema);
    if (validation.error) {
        //If its not valid, then return a error
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    //Find users
    User.findOne({
        //Finds either the email or username inputted by the user already exist
        $or: [
            { email: newUser.email },
            { username: newUser.username }
        ]
    }).then(user => {
        //If user already exist, then return with the error letting them know that its been already taken
        if (user) {
            return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Database Error: A user with that username and/or email already exists.' });
        }
        //If user does not exist yet, hash the user's inputted password
        return User.hashPassword(newUser.password);
    }).then(passwordHash => {
        //Then, replace the raw user password with the hashed password, for security reasons
        newUser.password = passwordHash;
        //After, using one of Mongo CRUD operators: create, we create the user using the updated user inputted values
        User.create(newUser)
            //using the user's updated input values, we return the user's values in a serialized json form
            .then(createdUser => {
                return response.status(HTTP_STATUS_CODES.CREATED).json(createdUser.serialize());
            })
            //If anything happens that did not go the way it was expected to go, log and return the error
            .catch(error => {
                console.error(error);
                return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error.message
                });
            });
    });
});

// RETRIEVE USERS using the express application methods
userRouter.get('/', (request, response) => {
    //Find users 
    User.find()
        //Then, when alll the users are found, respond with the status of OK(200) and map out all the users in a json and serialize format
        .then(users => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                users.map(user => user.serialize())
            );
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});
// RETRIEVE ONE USER using the express application methods
userRouter.get('/:userid', (request, response) => {
    User.findById(request.params.userid)
        .then(user => {
            return response.status(HTTP_STATUS_CODES.OK).json(user.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { userRouter };