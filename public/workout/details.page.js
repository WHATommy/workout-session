let STATE = {};
const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;
const ETC = window.ETC_MODULE;

$(document).ready(onReady);

function onReady() {
    STATE.workoutId = ETC.getQueryStringParam('id');
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    HTTP.getWorkoutById({
        workoutId: STATE.workoutId,
        onSuccess: RENDER.renderWorkoutDetails
    });

    $('.workout-details').on('click', '.edit-workout-btn', onEditWorkoutBtnClick);
}

function onEditWorkoutBtnClick(event) {
    event.preventDefault();
    window.open(`/workout/edit.html?id=${STATE.workoutId}`, '_self');
}
