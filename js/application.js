// Personal ATDAPI id: 74 
var personalId = 74;

var createTaskRow = function(task) {
	var taskid = task.id;
	var desc = task.content;
	var dateCreated = task.created_at.slice(0,10);
	var dateDue = task.due;
	if (dateDue === null) {
		dateDue = "-";
	} else {
		dateDue = dateDue.slice(0,10);
	}
	var state = task.completed; // true if completed
	
	var newRow;
	
	var checkboxCol, taskDescCol, dateCreatedCol, dueDateCol, removeCol
	
	if (state) {
		newRow = $('<tr class="completed" data_taskid = "' + taskid + '"></tr>');
		checkboxCol = $('<td class="status"><input type="checkbox" checked /></td>');
	} else {
		newRow = $('<tr data_taskid = "' + taskid + '"></tr>');
		checkboxCol = $('<td class="status"><input type="checkbox" /></td>');
	}

		taskDescCol = $('<td class="task">' + desc + '</td>');
	
	dateCreatedCol = $('<td class="date">' + dateCreated + '</td>');
	dueDateCol = $('<td class="date">' + dateDue + '</td>');
	
	removeCol = $('<td class="remove"><button class="btn btn-sm">remove</button></td>');
	
	$(newRow).append(checkboxCol);
	$(newRow).append(taskDescCol);
	$(newRow).append(dateCreatedCol);
	$(newRow).append(dueDateCol);
	$(newRow).append(removeCol);
	
	$("#taskTable tbody").append(newRow);	
}

var getTasks = function () {
	$("#taskTable tbody").children().remove();
	
	//console.log("sending request");
	$.ajax({
		type: 'GET',
		url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=' + personalId,
		dataType: 'json',
		success: function (response, textStatus) {
			console.log("getTasks response: ", response);
			//console.log(response.tasks);
			response.tasks.forEach(function (item) {
				//console.log(item.content);
				createTaskRow(item);
			});
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
		url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=' + personalId,
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify({
			task: {
				content: taskDesc,
				due: dueDate
			}
		}),
		success: function (response, textStatus) {
			console.log("addTask response: ", response);
			getTasks();
			$("#newTask").val("");
		},
		error: function (request, textStatus, errorMessage) {
			console.log(errorMessage);
		}
	});
}



$(document).ready(function () {
	getTasks();

	$('#addTask').on('submit', function (event) {
		event.preventDefault();
		addTask();
	});
	
	$('#toggle button').on('click', function (event) {
		$('.completed').toggle();
	});
	
	var timeout;
	$('#apiId').on('input', function () {
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			if ($('#apiId').val()) {
				personalId = $('#apiId').val();
				getTasks();
			}
		}, 1000);
	});
	
	$(document).on('mouseenter', 'tr', function (event) {
		$(this).find('button').show();
	});
	$(document).on('mouseleave', 'tr', function (event) {
		$(this).find('button').hide();
	});
	
	
	$(document).on('click', '.remove button', function (event) {
		if (confirm("Are you sure you want to remove this task?")) {
			var idToDelete = $(this).closest('tr').attr("data_taskid");
			$.ajax({
				type: 'DELETE',
				url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + idToDelete + '?api_key=' + personalId,
				success: function (response, textStatus) {
					console.log("removeTask response: ", response);
					getTasks();
				},
				error: function (request, textStatus, errorMessage) {
					console.log(errorMessage);
				}
			});
		}
	});
	
	$(document).on('click', '.status input', function (event) {
		var idToUpdate = $(this).closest('tr').attr("data_taskid");
		
		var requestSuffix;
		
		if (this.checked) {
			requestSuffix = "/mark_complete?api_key=" + personalId;
		} else {
			requestSuffix = "/mark_active?api_key=" + personalId;
		}
		
		$.ajax({
			type: 'PUT',
			url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + idToUpdate + requestSuffix,
			success: function (response, textStatus) {
				console.log("updateTask response: ", response);
				getTasks();
			},
			error: function (request, textStatus, errorMessage) {
				console.log(errorMessage);
			}
		});
	});
});