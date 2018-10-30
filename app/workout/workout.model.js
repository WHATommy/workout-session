const mongoose = require('mongoose');
const Joi = require('joi');

const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    weight: { type: Number, required: true },
    reps: { type: Number, required: true },
    date: { type: Date, default: Date.now() }
});

workoutSchema.methods.serialize = function () {
    let user;
    if (typeof this.user.serialize === 'function') {
        user = this.user.serialize();
    } else {
        user = this.user;
    }

    return {
        id: this._id,
        user: user,
        title: this.title,
        weight: this.weight,
        reps: this.reps,
        date: this.date
    };
};

const WorkoutJoiSchema = Joi.object().keys({
    user: Joi.string().optional(),
    title: Joi.string().min(1).required(),
    weight: Joi.number().min(1).required(),
    reps: Joi.number().min(1).required(),
    date: Joi.date().timestamp()
});

const Workout = mongoose.model('workout', workoutSchema);

module.exports = { Workout, WorkoutJoiSchema };