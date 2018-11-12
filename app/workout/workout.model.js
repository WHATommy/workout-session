//mongoose is used to make Schema, methods, and models
const mongoose = require('mongoose');
//Joi is used to make Schema to compare with the user's values
const Joi = require('joi');

//The model of a user's workout session
const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    weight: { type: Number, required: true },
    reps: { type: Number, required: true },
    date: { type: Date, default: Date.now() }
});

/*a method for the workout schema to return in the following format
    id: this._id,
    user: user,
    title: this.title,
    weight: this.weight,
    reps: this.reps,
    date: this.date
*/
workoutSchema.methods.serialize = function () {
    let user;
    //Formats the user in a serialized format if it hasnt been serialized already
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

//Joi schema model that is used to compare with the mongoose schema model
const WorkoutJoiSchema = Joi.object().keys({
    user: Joi.string().optional(),
    title: Joi.string().min(1).required(),
    weight: Joi.number().min(1).required(),
    reps: Joi.number().min(1).required(),
    date: Joi.date().timestamp()
});

//A mongoose model to initialize what the database will be named and what type of data it will contain
const Workout = mongoose.model('workout', workoutSchema);

//Export the workout model and the joi schema
module.exports = { Workout, WorkoutJoiSchema };