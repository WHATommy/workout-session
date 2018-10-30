let STATE = {};
const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;

$(document).ready(onPageLoad);

function onPageLoad() {
    updateAuthenticatedUI();

    if (STATE.authUser) {
        HTTP.getUserWorkouts({
            jwtToken: STATE.authUser.jwtToken,
            onSuccess: RENDER.renderWorkoutsList
        });
    }

    $('.logout-btn').on('click', onLogoutBtnClick);
    $('.workout-list').on('click', '.delete-workout-btn', onDeleteWorkoutBtnClick);
    $('.workout-list').on('click', '.workout-card', onWorkoutCardClick);
}

function onLogoutBtnClick(event) {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
        CACHE.deleteAuthenticatedUserFromCache();
        window.open('/auth/login.html', '_self');
    }
}

function onWorkoutCardClick(event) {
    const workoutId = $(event.currentTarget).attr('data-workout-id');
    window.open(`workout/details.html?id=${workoutId}`, '_self');
}

function onDeleteWorkoutBtnClick(event) {
    event.stopImmediatePropagation();
    const workoutId = $(event.currentTarget)
        .closest('.workout-card')
        .attr('data-workout-id');
    const userSaidYes = confirm('Are you sure you want to delete this workout?');
    if (userSaidYes) {
        HTTP.deleteWorkout({
            workoutId: workoutId,
            jwtToken: STATE.authUser.jwtToken,
            onSuccess: () => {
                alert('Workout deleted succesfully, reloading results ...');
                HTTP.getUserWorkouts({
                    jwtToken: STATE.authUser.jwtToken,
                    onSuccess: RENDER.renderWorkoutsList
                });
            }
        });
    }
}

function updateAuthenticatedUI() {
    const authUser = CACHE.getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
        $('.greeting').html(`Welcome, ${authUser.name}`);
        $('.auth-menu').removeAttr('hidden');
    } else {
        $('.unauth-menu').removeAttr('hidden');
    }
}