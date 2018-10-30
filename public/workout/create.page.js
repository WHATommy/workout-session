let STATE = {};
const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;

$(document).ready(onReady);

function onReady() {
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    $('.new-workout-form').on('submit', onCreateSubmit);
}

function onCreateSubmit(event) {
    event.preventDefault();
    const newWorkout = {
        title: $('.title-txt').val(),
        weight: $('.weight-txt').val(),
        reps: $('.reps-txt').val()
    };

    HTTP.createWorkout({
        jwtToken: STATE.authUser.jwtToken,
        newWorkout: newWorkout,
        onSuccess: workout => {
            alert('Workout created succesfully, redirecting ...');
            window.open(`/workout/details.html?id=${workout.id}`, '_self');
        },
        onError: err => {
            alert('Internal Server Error (see console)');
            console.error(err);
        }
    });
}