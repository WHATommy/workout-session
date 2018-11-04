let STATE = {};
const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;
const ETC = window.ETC_MODULE;

$(document).ready(onReady);

function onReady() {
    STATE.workoutId = ETC.getQueryStringParam('id');
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    getWorkoutById({
        workoutId: STATE.workoutId,
        onSuccess: RENDER.renderEditableWorkout
    });

    $('.workout-edit-form').on('submit', onEditSubmit);
}

function onEditSubmit(event) {
    event.preventDefault();
    const newWorkout = {
        title: $('.title-txt').val(),
        weight: $('.weight-txt').val(),
        reps: $('.reps-txt').val()
    };

    updateWorkout({
        workoutId: STATE.workoutId,
        newWorkout: newWorkout,
        jwtToken: STATE.authUser.jwtToken,
        onSuccess: workout => {
            alert('Workout changes saved succesfully, redirecting ...');
            window.open(`/workout/details.html?id=${STATE.workoutId}`, '_self');
        },
        onError: err => {
            alert('There was a problem editing this Workout, please try again later.');
        }
    });
}