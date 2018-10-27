const mongoose = require('mongoose');
// https://www.npmjs.com/package/joi
const Joi = require('joi');

// Each Mongoose schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const workoutSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    weight: { type: Number, required: true },
    reps: { type: Number, required: true },
    date: { type: Date, default: Date.now() }
});

// Here we define a Mongoose instance method, to learn more about them, see:
// https://mongoosejs.com/docs/guide.html#methods
workoutSchema.methods.serialize = function () {
    let user;
    // We serialize the user if it's populated to avoid returning any sensitive information, like the password hash.
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

// To validate that data used to create a new user is valid, we will use "Joi", a NPM library that
// allows you to create "blueprints" or "schemas" to ensure validation of key information. To learn more:
// https://www.npmjs.com/package/joi
const WorkoutJoiSchema = Joi.object().keys({
    // To learn more about Joi string validations, see:
    // https://github.com/hapijs/joi/blob/v13.6.0/API.md#string---inherits-from-any
    user: Joi.string().optional(),
    title: Joi.string().min(1).required(),
    weight: Joi.number().min(1).required(),
    reps: Joi.number().min(1).required(),
    date: Joi.date().timestamp()
});

// To learn more about how Mongoose schemas and models are created, see:
// https://mongoosejs.com/docs/guide.html
const Workout = mongoose.model('workout', workoutSchema);
// To learn more about Mongoose Models vs Schemas, see:
// https://stackoverflow.com/questions/9127174/why-does-mongoose-have-both-schemas-and-models
module.exports = { Workout, WorkoutJoiSchema };