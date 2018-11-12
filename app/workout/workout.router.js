const express = require('express');
const Joi = require('joi');
const workoutRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config.js');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Workout, WorkoutJoiSchema } = require('./workout.model.js');

// CREATE NEW WORKOUT SESSION using the express application methods
workoutRouter.post('/', jwtPassportMiddleware, (request, response) => {
    //Put the user's values into a object, newWorkout
    const newWorkout = {
        user: request.user.id,
        title: request.body.title,
        weight: request.body.weight,
        reps: request.body.reps,
        date: Date.now()
    };

    //Joi will compare the user's value with the Workout Joi Schema to make sure it is valid inputs
    const validation = Joi.validate(newWorkout, WorkoutJoiSchema);
    //Return error if Joi say its not valid
    if (validation.error) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }

    //After, using one of Mongo CRUD operators: create, we create the workout session using the updated user inputed values
    Workout.create(newWorkout)
        .then(createdWorkout => {
            //We return the user's values in a serialized json form
            return response.status(HTTP_STATUS_CODES.CREATED).json(createdWorkout.serialize());
        })
        //If anything happens that did not go the way it was expected to go, return the error
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE USER's WORKOUT SESSIONS using the express application methods
workoutRouter.get('/', jwtPassportMiddleware, (request, response) => {
    //Find workout sessions that have the same user's ID
    Workout.find({ user: request.user.id })
        //"populate" with the entire user document corresponding with the user's ID. If this was not here, it would only populate with JUST the ID
        .populate('user')
        .then(workouts => {
            //We return the user's values in a serialized json form
            return response.status(HTTP_STATUS_CODES.OK).json(
                workouts.map(workout => workout.serialize())
            );
        })
        //If anything happens that did not go the way it was expected to go, return the error
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE ALL WORKOUT SESSIONS using the express application methods
workoutRouter.get('/all', (request, response) => {
    //Find all the workout sessions
    Workout.find()
        //"populate" with the entire user document corresponding with the user's ID. If this was not here, it would only populate with JUST the ID
        .populate('user')
        .then(workouts => {
            //We return the user's values in a serialized json form
            return response.status(HTTP_STATUS_CODES.OK).json(
                workouts.map(workout => workout.serialize())
            );
        })
        //If anything happens that did not go the way it was expected to go, return the error
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});


// RETRIEVE ONE WORKOUT SESSION BY ID using the express application methods
workoutRouter.get('/:workoutid', (request, response) => {
    //Find the workout session by id
    Workout.findById(request.params.workoutid)
        //"populate" with the entire user document corresponding with the user's ID. If this was not here, it would only populate with JUST the ID
        .populate('user')
        .then(workout => {
            //We return the user's values in a serialized json form
            return response.status(HTTP_STATUS_CODES.OK).json(workout.serialize());
        })
        .catch(error => {
            //If anything happens that did not go the way it was expected to go, return the error
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// REMOVE WORKOUT SESSION BY ID using the express application methods
workoutRouter.put('/:workoutid', jwtPassportMiddleware, (request, response) => {
    //Create a object with the following user's data that wants to be updated
    const workoutUpdate = {
        title: request.body.title,
        weight: request.body.weight,
        reps: request.body.reps
    };
    //Joi will compare the user's value with the Workout Joi Schema to make sure it is valid inputs
    const validation = Joi.validate(workoutUpdate, WorkoutJoiSchema);
    if (validation.error) {
        //Return error if Joi say its not valid
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    //Then find the workout session by id and update it with the new user input(workoutUpdate)
    Workout.findByIdAndUpdate(request.params.workoutid, workoutUpdate)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            //If anything happens that did not go the way it was expected to go, return the error
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// REMOVE WORKOUT SESSION BY ID using the express application methods
workoutRouter.delete('/:workoutid', jwtPassportMiddleware, (request, response) => {
    //Find the workout session by id and remote it
    Workout.findByIdAndDelete(request.params.workoutid)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            //If anything happens that did not go the way it was expected to go, return the error
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

//export the workoutRouter CRUD functions
module.exports = { workoutRouter };

