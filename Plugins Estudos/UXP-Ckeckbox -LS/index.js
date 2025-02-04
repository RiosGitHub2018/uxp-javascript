const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

restoreCheckboxes ();
document.querySelector("#salvar").addEventListener("click", async evt => {
	savefunction() 
})

function savefunction(){
	var checkboxes = document.querySelectorAll('.checks');
	var checked = {};
	for (var i = 0; i < checkboxes.length; i ++) {
		if (checkboxes[i].checked) {
		checked[checkboxes[i].id] = checkboxes[i].value;
		}
	}
	localStorage.setItem('checked_boxes', JSON.stringify(checked)); 
	console.log(checked);
}

function restoreCheckboxes () {
	var checkbox = document.querySelectorAll('.checks');
	var checkboxStates = localStorage.getItem('checked_boxes');
	if (checkboxStates) {
		checkboxStates = JSON.parse(checkboxStates); // <-- parse string to object
		for (i = 0; i < checkbox.length; i ++) {
			if (checkboxStates.hasOwnProperty(checkbox[i].id)) {
			checkbox[i].checked = true;
			}
		}
	}
}
