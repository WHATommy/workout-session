//Global Functions, ;etting other files have access to these functions
window.RENDER_MODULE = {
    renderWorkoutsList,
    renderWorkoutDetails,
    renderEditableWorkout
};

function renderWorkoutsList(workouts) {
    const workoutsHtml = workouts.map(workoutToHtml).join('<hr/>');
    $('.workout-list').html(workoutsHtml);

    function workoutToHtml(workout) {
        return `
        <div class="workout-card" data-workout-id="${workout.id}">
            <h3 class="card-header">${workout.title}
            <button class="delete-workout-btn">Delete</button>
            </h3>
            <p class="card-weight">Weight: ${workout.weight} lb</p>
            <p class="card-reps">Reps: ${workout.reps} reps</p>
            <p class="card-info">
                <i>${workout.user.name} | Last update on ${new Date(workout.date).toLocaleDateString()}</i>
            </p>
        </div>
        `;
    }
}

function renderWorkoutDetails(workout) {
    $('.workout-details').html(`
        <br/>
        <button class="edit-workout-btn">Edit Workout</button>
        <a href="/" class="button">Back to Home</a>
		<h1>${workout.title}</h1>
		<i>${workout.user.name} | ${new Date(workout.date).toLocaleString()}</i>
        <p>${workout.weight} lb</p>
        <p>${workout.reps} reps</p>
	`);
}

function renderEditableWorkout(workout) {
    $('.title-txt').prop('disabled', false).val(workout.title);
    $('.weight-txt').prop('disabled', false).val(workout.weight);
    $('.reps-txt').prop('disabled', false).val(workout.reps);
}