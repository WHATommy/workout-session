//Use mongoose functions to make Schemas and Methods
const mongoose = require('mongoose');
//Make Joi Schemas(with data type and value restrictions) to compare with the mongoose Schema
const Joi = require('joi');
//Able to hash the sensitive informations of the users
const bcrypt = require('bcryptjs');

//User model 
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

//A userSchema method that returns everything except the password
userSchema.methods.serialize = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        username: this.username,
    };
};

//Using bcrypt to hash the password in the userSchema Model
userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

//A userSchema method that compares the the two passwords
userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

//Joi schema model that is used to compare with the mongoose schema model
const UserJoiSchema = Joi.object().keys({
    name: Joi.string().min(1).trim().required(),
    username: Joi.string().alphanum().min(4).max(30).trim().required(),
    password: Joi.string().min(3).max(50).trim().required(),
    email: Joi.string().email().trim().required()
});

//A mongoose model to initialize what the database will be named and what type of data it will contain
const User = mongoose.model('user', userSchema);

//Export the user model and the joi schema
module.exports = { User, UserJoiSchema };