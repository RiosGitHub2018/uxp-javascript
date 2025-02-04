/////// EXIBE A CAIXA DE DIÁLOGO =============
document.querySelector("#mdCanecas").addEventListener( "click",  () => document.querySelector("#dlgCanecas").uxpShowModal(
{title: "Psfx-rios: Canecas personalisadas.", resize: "both", size: {width: 350, height: 315}}




));
///////  =============

////// JS NAVEGAÇÃO DE ABAS:
function openPage(pageName,elmnt,color) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
	tabcontent[i].style.display = "none";
	}
	document.getElementById(pageName).style.display = "block";
}
openPage('tab1', this, '#535353'); document.querySelector('#btTab2').style.background = '#424242';
document.querySelector("#btTab1").addEventListener("click", evt => {
document.querySelector('#btTab2').style.background = '#424242'; document.querySelector('#btTab1').style.background = '#535353';
})
document.querySelector("#btTab2").addEventListener("click", evt => {
document.querySelector('#btTab1').style.background = '#424242'; document.querySelector('#btTab2').style.background = '#535353';
})

/*
/////// TESTES FUNÇÕES DROPDOWLIST =============
document.querySelector("#list_AC").addEventListener("change", async evt => {
	await app.batchPlay([{"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"documentID":103,"name":"Montagem13 "}], { });
	await app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"2upVertical"}]}], { }).then(result => console.log(result), error => console.log(error));
})
*/

/////// TESTES FUNÇÕES DROPDOWLIST =============
document.querySelector("#ArrangeM").addEventListener("click", async evt => {
	//await app.batchPlay([{"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"documentID":103,"name":"Montagem13 "}], { });
	//await app.batchPlay([{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"2upVertical"}]}], { }).then(result => console.log(result), error => console.log(error));
	await runModalFunction();
})



async function action1() {
    let result;
    let psAction = require("photoshop").action;

    let command = [
        // Select 2 Up Vertical menu item
        {"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"2upVertical"}]},
		{"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"documentID":103,"name":"Montagem13 "}
    ];
    result = await psAction.batchPlay(command, {}).then(result => console.log(result), error => console.log(error));
}

async function runModalFunction() { await require("photoshop").core.executeAsModal(action1, {"commandName": "Action Commands"});}





