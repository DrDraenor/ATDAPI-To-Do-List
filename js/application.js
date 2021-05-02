// Personal ATDAPI id: 74 

var getTasks = function () {
	$("#taskTable tbody").children().remove();
	console.log("sending request");
	$.ajax({
		type: 'GET',
		url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=74',
		dataType: 'json',
		success: function (response, textStatus) {
			console.log(response);
			
			
			
			
		},
		error: function (request, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});
}

var addTask = function () {
	var taskDesc = $("#newTask").val();
	
	var dueDate = null;
	var dueDateInput = $("#newTaskDueDate").val();
	if (dueDateInput != null) {
		dueDate = dueDateInput;
	}
	
	console.log("Adding task: ", taskDesc, dueDate);
	
	$.ajax({
		type: 'POST',
		url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=74',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify({
			task: {
				content: taskDesc,
				due: dueDate
			}
		}),
		success: function (response, textStatus) {
			console.log(response);
		},
		error: function (request, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});
	getTasks();
	$("#newTask").val("");
}



$(document).ready(function () {
	getTasks();

	$('#addTask').on('submit', function (event) {
		console.log("123");
		event.preventDefault();
		console.log("321");
		addTask();
	});
});