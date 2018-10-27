window.RENDER_MODULE = {
    renderWorkoutsList,
    renderWorkoutDetails,
    renderEditableWorkout
};

function renderWorkoutsList(workouts) {
    const workoutsHtml = workouts.map(workoutToHtml).join('<hr/>');
    $('#workout-list').html(workoutsHtml);

    function workoutToHtml(workout) {
        let workoutSummary = workout.content;
        if (workoutSummary.length > 120) {
            workoutSummary = `${workout.content.substring(0, 120)}...`;
        }
        return `
        <div id="workout-card" data-workout-id="${workout.id}">
            <h3 class="card-header">${workout.title}
            <button id="delete-workout-btn">Delete</button></h3>
            <p class="card-content">${workoutSummary}</p>
            <p class="card-info">
                <i>${workout.user.name} | Last update on ${new Date(workout.updateDate).toLocaleDateString()}</i>
            </p>
        </div>
        `;
    }
}

function renderWorkoutDetails(workout) {
    $('#workout-details').html(`
        <br/>
        <button id="edit-workout-btn">Edit Workout</button>
		<h1>${workout.title}</h1>
		<i>${workout.user.name} | ${new Date(workout.updateDate).toLocaleString()}</i>
		<p>${workout.content}</p>
	`);
}

function renderEditableWorkout(workout) {
    $('#title-txt').prop('disabled', false).val(workout.title);
    $('#content-txt').prop('disabled', false).val(workout.content);
}