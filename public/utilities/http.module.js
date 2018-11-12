//Global Functions, ;etting other files have access to these functions
window.HTTP_MODULE = {
    signupUser,
    loginUser,
    getUserWorkouts,
    getWorkoutById,
    createWorkout,
    updateWorkout,
    deleteWorkout
};

/*FUNCTION: Grabs the data from userData, onSuccess, and onError.
If successful, run the onSuccess function and send it to the /api/user router
for the server to handle the data. If not, run the onError function
*/
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

/*FUNCTION: Grabs the data from userData, onSuccess, and onError.
If successful, run the onSuccess function and send it to the /api/user/login router
for the server to handle the data. If not, run the onError function
*/
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
            /*xhr is used to send HTTP or HTTPS requests to a web server
            and load the server response data back into the script.*/
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
            /*xhr is used to send HTTP or HTTPS requests to a web server
            and load the server response data back into the script.*/
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
    const { jwtToken, workoutId, newWorkout, onSuccess, onError } = options;

    $.ajax({
        type: 'PUT',
        url: `/api/workout/${workoutId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(newWorkout),
        beforeSend: function (xhr) {
            /*xhr is used to send HTTP or HTTPS requests to a web server
            and load the server response data back into the script.*/
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
            /*xhr is used to send HTTP or HTTPS requests to a web server
            and load the server response data back into the script.*/
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