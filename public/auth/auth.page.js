// All these modules are are defined in /public/utilities
const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;
const { UserJoiSchema } = require('./user.model.js');

$(document).ready(onPageLoad);

function onPageLoad() {
    console.log('onPage is working -------------------------------------')
    $('.sign-up-form').submit(onSignUpSubmit);
    $('.login-form').submit(onLoginSubmit);
}

function onSignUpSubmit(event) {
    event.preventDefault();

    const userData = {
        name: $('.name-txt').val(),
        email: $('.email-txt').val(),
        username: $('.username-txt').val(),
        password: $('.password-txt').val()
    }

    HTTP.signupUser({
        userData,
        onSuccess: user => {
            alert(`User "${user.username}" created, you may now log in.`);
            window.open('/auth/login.html', '_self');
        },
        onError: err => {
            alert('There was a problem processing your request, please try again later.');
        }
    });
}

/* TODO: VALIDATION FOR USER INPUT
const validation = Joi.validate(userData, UserJoiSchema);

    if (validation.error) {
        alert(`Something went wrong with ${validation.error}, please enter the correect information`)
    } else {
        HTTP.signupUser({
            userData,
            onSuccess: user => {
                alert(`User "${user.username}" created, you may now log in.`);
                window.open('/auth/login.html', '_self');
            },
            onError: err => {
                alert('There was a problem processing your request, please try again later.');
            }
        });
    }
}
*/

function onLoginSubmit(event) {
    event.preventDefault();

    const userData = {
        username: $('.username-txt').val(),
        password: $('.password-txt').val()
    };

    HTTP.loginUser({
        userData,
        onSuccess: response => {
            const authenticatedUser = response.user;
            authenticatedUser.jwtToken = response.jwtToken;
            CACHE.saveAuthenticatedUserIntoCache(authenticatedUser);
            alert('Login succesful, redirecting you to homepage ...');
            window.open('/', '_self');
        },
        onError: err => {
            alert('Incorrect username or password. Please try again.');
        }
    });
}