const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../user/user.model');
const { JWT_SECRET } = require('../config');

//localStrategy is used when the user is logging in with a username and password
const localStrategy = new LocalStrategy((username, password, passportVerify) => {
    let user;
    //Find the user's username
    User.findOne({ username: username }).then(_user => {
        //Input the username in the variable: user
        user = _user;
        //If username does not exist, then reject the promise and alert that there was an error
        if (!user) {
            return Promise.reject({
                reason: 'LoginError',
                message: 'Incorrect username or password'
            });
        }
        //Now that we verified the user exist, we need to verify the password now
        return user.validatePassword(password);
    }).then(isValid => {
        //If password is not correct, then reject the promise and alert that there was an error
        if (!isValid) {
            return Promise.reject({
                reason: 'LoginError',
                message: 'Incorrect username or password'
            });
        }
        //return the callback function, makes sure user is allowed access
        return passportVerify(null, user);
    }).catch(err => {
        //If an error has occurred during the process, get rid of the passportVerify's username and password and return error
        if (err.reason === 'LoginError') {
            return passportVerify(null, false, err.message);
        }
        return passportVerify(err, false);
    });
});

//Used if the user already has a json web token and wants to access sensitive user data
const jwtStrategy = new JwtStrategy(
    //Below are json web token functions that will check if the user's json web token is valid
    {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        algorithms: ['HS256']
    },

    (token, done) => {
        done(null, token.user);
    }
);

//create a piece of middleware we can use for all our endpoints
const localPassportMiddleware = passport.authenticate('local', { session: false });
const jwtPassportMiddleware = passport.authenticate('jwt', { session: false });

//export the strategies and middlewares
module.exports = {
    localStrategy,
    jwtStrategy,
    localPassportMiddleware,
    jwtPassportMiddleware
};