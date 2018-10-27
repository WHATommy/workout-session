const express = require('express');
// https://www.npmjs.com/package/joi
const Joi = require('joi');
const workoutRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config.js');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Workout, WorkoutJoiSchema } = require('./workout.model.js');

// CREATE NEW NOTE
workoutRouter.post('/', jwtPassportMiddleware, (request, response) => {
    // Remember, We can access the request body payload thanks to the express.json() middleware we used in server.js
    const newWorkout = {
        user: request.user.id,
        title: request.body.title,
        weight: request.body.weight,
        reps: request.body.reps,
        date: Date.now()
    };

    // Step 1: Validate new user information is correct.
    // Here, we use the Joi NPM library for easy validation
    // https://www.npmjs.com/package/joi
    const validation = Joi.validate(newWorkout, WorkoutJoiSchema);
    if (validation.error) {
        // Step 2A: If validation error is found, end the the request with a server error and error message.
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    // Step 2B: Attempt to create a new workout using Mongoose.Model.create
    // https://mongoosejs.com/docs/api.html#model_Model.create
    Workout.create(newWorkout)
        .then(createdWorkout => {
            // Step 3A: Return the correct HTTP status code, and the workout correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.CREATED).json(createdWorkout.serialize());
        })
        .catch(error => {
            // Step 3B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE USER's NOTES
workoutRouter.get('/', jwtPassportMiddleware, (request, response) => {
    // Step 1: Attempt to retrieve all workouts using Mongoose.Model.find()
    // https://mongoosejs.com/docs/api.html#model_Model.find
    Workout.find({ user: request.user.id })
        .populate('user')
        .then(workouts => {
            // Step 2A: Return the correct HTTP status code, and the workouts correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.OK).json(
                workouts.map(workout => workout.serialize())
            );
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE ALL NOTES
workoutRouter.get('/all', (request, response) => {
    // Step 1: Attempt to retrieve all workouts using Mongoose.Model.find()
    // https://mongoosejs.com/docs/api.html#model_Model.find
    Workout.find()
        .populate('user')
        .then(workouts => {
            // Step 2A: Return the correct HTTP status code, and the workouts correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.OK).json(
                workouts.map(workout => workout.serialize())
            );
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});


// RETRIEVE ONE NOTE BY ID
workoutRouter.get('/:workoutid', (request, response) => {
    // Step 1: Attempt to retrieve the workout using Mongoose.Model.findById()
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    Workout.findById(request.params.workoutid)
        .populate('user')
        .then(workout => {
            // Step 2A: Return the correct HTTP status code, and the workout correctly formatted via serialization.
            return response.status(HTTP_STATUS_CODES.OK).json(workout.serialize());
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// REMOVE NOTE BY ID
workoutRouter.put('/:workoutid', jwtPassportMiddleware, (request, response) => {
    const workoutUpdate = {
        title: request.body.title,
        weight: request.body.weight,
        reps: request.body.reps
    };
    // Step 1: Validate new user information is correct.
    // Here, we use the Joi NPM library for easy validation
    // https://www.npmjs.com/package/joi
    const validation = Joi.validate(workoutUpdate, WorkoutJoiSchema);
    if (validation.error) {
        // Step 2A: If validation error is found, end the the request with a server error and error message.
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    // Step 2B: Attempt to find the workout, and update it using Mongoose.Model.findByIdAndUpdate()
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    Workout.findByIdAndUpdate(request.params.workoutid, workoutUpdate)
        .then(() => {
            // Step 3A: Since the update was performed but no further data provided,
            // we just end the request with NO_CONTENT status code.
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            // Step 3B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// REMOVE NOTE BY ID
workoutRouter.delete('/:workoutid', jwtPassportMiddleware, (request, response) => {
    // Step 1: Attempt to find the workout by ID and delete it using Mongoose.Model.findByIdAndDelete()
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete
    Workout.findByIdAndDelete(request.params.workoutid)
        .then(() => {
            // Step 2A: Since the deletion was performed but no further data provided,
            // we just end the request with NO_CONTENT status code.
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            // Step 2B: If an error ocurred, return an error HTTP status code and the error in JSON format.
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { workoutRouter };

