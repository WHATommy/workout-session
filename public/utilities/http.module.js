window.HTTP_MODULE = {
    signupUser,
    loginUser,
    getUserWorkouts,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout
};

function signupUser(options) {
    const { userData, onSuccess, onError } = options;
    $.ajax({
        type: 'POST',
        url: '/api/user',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function loginUser(options) {
    const { userData, onSuccess, onError } = options;
    $.ajax({
        type: 'POST',
        url: '/api/auth/login',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function getUserWorkouts(options) {
    const { jwtToken, onSuccess, onError } = options;
    $.ajax({
        type: 'GET',
        url: '/api/workout',
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function getWorkoutById(options) {
    const { workoutId, onSuccess } = options;
    $.getJSON(`/api/workout/${workoutId}`, onSuccess);
}

function createWorkout(options) {
    const { jwtToken, newWorkout, onSuccess, onError } = options;

    $.ajax({
        type: 'POST',
        url: '/api/workout',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(newWorkout),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError();
            }
        }
    });
}

function updateWorkout(options) {
    const {jwtToken, workoutId, newWorkout, onSuccess, onError } = options;

    $.ajax({
        type: 'PUT',
        url: `/api/workout/${workoutId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(newWorkout),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError();
            }
        }
    });
}

function deleteWorkout(options) {
    const { workoutId, jwtToken, onSuccess, onError } = options;
    $.ajax({
        type: 'delete',
        url: `/api/workout/${workoutId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}