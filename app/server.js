//Web framework for NodeJS
const express = require('express');
//Logs the server activities
const morgan = require('morgan');
//Connect to mongoDB
const mongoose = require('mongoose');
//Authentication purposes
const passport = require('passport');

/*Functions that are withdrawn from other files
    const { functions } = require('The file location')
*/
const { PORT, HTTP_STATUS_CODES, MONGO_URL, TEST_MONGO_URL } = require('./config');
const { authRouter } = require('./auth/auth.router');
const { userRouter } = require('./user/user.router');
const { workoutRouter } = require('./workout/workout.router');
const { localStrategy, jwtStrategy } = require('./auth/auth.strategy');

//Start express server
let server;
const app = express(); //Initialize express server

//Passport 
passport.use(localStrategy);
passport.use(jwtStrategy);

// MIDDLEWARE(Every request you made in this server will go through these middleware's first)
app.use(morgan('combined')); //Intercepts and logs all the HTTP requests to the console
app.use(express.json()); //Converts the data to a json format so our server are able to use it
app.use(express.static('./public')); //Able to intercept all the HTTP request that match the files within the public folder

// ROUTER SETUP
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/workout', workoutRouter);

//Any HTTP requests that does not exist with the corresponding paths recieves a error of not found
app.use('*', function (req, res) {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ error: 'Not Found.' });
});

//Exports the listed functions of server.js
module.exports = {
    app,
    startServer,
    stopServer
};

function startServer(testEnv) {
    return new Promise((resolve, reject) => {
        let mongoUrl;

        if (testEnv) {
            //If testing env is being used, use the Test URL
            mongoUrl = TEST_MONGO_URL;
        } else {
            //If not useing the testing env, use the live DB URL
            mongoUrl = MONGO_URL;
        }
        //Connect to the database
        mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => {
            if (err) {
                //If server cannot connect to database, reject the promise and log the error
                console.error(err);
                return reject(err);
            } else {
                //If connection is successful, log the port the server is listening to and resolve the promise
                server = app.listen(PORT, () => {
                    console.log(`Express server listening on http://localhost:${PORT}`);
                    resolve();
                }).on('error', err => {
                    //If server cannot connect to database, reject the promise and log the error
                    mongoose.disconnect();
                    console.error(err);
                    reject(err);
                });
            }
        });
    });
}

function stopServer() {
    return mongoose
        .disconnect()
        .then(() => new Promise((resolve, reject) => {
            server.close(err => {
                if (err) {
                    //If server cannot disconnect from database, reject the promise and log the error
                    console.error(err);
                    return reject(err);
                } else {
                    //If server disconnect from database, resolve the promise and log the success
                    console.log('Express server stopped.');
                    resolve();
                }
            });
        }));
}