const express = require('express');
const Joi = require('joi');
const workoutRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config.js');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Workout, WorkoutJoiSchema } = require('./workout.model.js');

// CREATE NEW NOTE using the express application methods
workoutRouter.post('/', jwtPassportMiddleware, (request, response) => {
    const newWorkout = {
        user: request.user.id,
        title: request.body.title,
        weight: request.body.weight,
        reps: request.body.reps,
        date: Date.now()
    };

    const validation = Joi.validate(newWorkout, WorkoutJoiSchema);
    if (validation.error) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }

    Workout.create(newWorkout)
        .then(createdWorkout => {
            return response.status(HTTP_STATUS_CODES.CREATED).json(createdWorkout.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE USER's NOTES using the express application methods
workoutRouter.get('/', jwtPassportMiddleware, (request, response) => {
    Workout.find({ user: request.user.id })
        .populate('user')
        .then(workouts => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                workouts.map(workout => workout.serialize())
            );
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// RETRIEVE ALL NOTES using the express application methods
workoutRouter.get('/all', (request, response) => {
    Workout.find()
        .populate('user')
        .then(workouts => {
            return response.status(HTTP_STATUS_CODES.OK).json(
                workouts.map(workout => workout.serialize())
            );
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});


// RETRIEVE ONE NOTE BY ID using the express application methods
workoutRouter.get('/:workoutid', (request, response) => {
    Workout.findById(request.params.workoutid)
        .populate('user')
        .then(workout => {
            return response.status(HTTP_STATUS_CODES.OK).json(workout.serialize());
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// REMOVE NOTE BY ID using the express application methods
workoutRouter.put('/:workoutid', jwtPassportMiddleware, (request, response) => {
    const workoutUpdate = {
        title: request.body.title,
        weight: request.body.weight,
        reps: request.body.reps
    };
    const validation = Joi.validate(workoutUpdate, WorkoutJoiSchema);
    if (validation.error) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: validation.error });
    }
    Workout.findByIdAndUpdate(request.params.workoutid, workoutUpdate)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

// REMOVE NOTE BY ID using the express application methods
workoutRouter.delete('/:workoutid', jwtPassportMiddleware, (request, response) => {
    Workout.findByIdAndDelete(request.params.workoutid)
        .then(() => {
            return response.status(HTTP_STATUS_CODES.NO_CONTENT).end();
        })
        .catch(error => {
            return response.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(error);
        });
});

module.exports = { workoutRouter };

