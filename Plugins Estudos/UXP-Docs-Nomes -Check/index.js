const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

docs = document.getElementById("layers");
ImgConteudo = app.documents;
core.executeAsModal( async() => {docsAbertos()})

document.querySelector("#importIMG").addEventListener("click", async evt => {
	await core.executeAsModal( async() => {	docsAbertos() })
})

var marcaTodos = document.querySelector("#checkAll");
marcaTodos.addEventListener( 'change', function() {
    ckeckbox = document.querySelectorAll(".checkDocs")
	for (var i=0;i<ckeckbox.length ;i++){
		if(this.checked) {ckeckbox[i].checked=true;}else {ckeckbox[i].checked=false}
	}
});

 function docsAbertos(){
	docs.innerHTML = "";
	if(ImgConteudo.length<1){
		docs.insertAdjacentHTML('beforeend', "<h4>• Área vazia!</h4>" ); 
		document.getElementById("checkAll").disabled = true;
	}
	else{
		for(i=0;i <ImgConteudo.length;i++){
			var doc = app.documents[i];   
			app.activeDocument = doc;  
			docsNomes = ImgConteudo[i].name;
            id= app.activeDocument._id;
			docs.insertAdjacentHTML('beforeend', `<sp-checkbox size=s class = "checkDocs" id = ${id}>${docsNomes}</sp-checkbox`);
			document.getElementById("checkAll").disabled = false;
		}
	}
	document.querySelector("#checkAll").checked = false;
}

//// PROCESSAR MARCADOS
document.querySelector("#Obter_valores").addEventListener("click", async evt => {
	await core.executeAsModal( async() => {	docsAcesso()})
})

//// OBTER CHECKS MARCADOS
async function docsAcesso(){
	ckeckbox = document.getElementsByClassName("checkDocs")
	docsMarcados="";
	for (var i=0;i<ckeckbox.length;i++){
		if(ckeckbox[i].checked ==true) {
			try {
				 const docsMarcados = Number(ckeckbox[i].id);
				 app.batchPlay([{"_obj":"select","_target":[{"_id":docsMarcados,"_ref":"document"}]}], {});
				////FUNÇÕES AQUI
				alert("Scripts aqui");
				//app.batchPlay([{"_obj":"hueSaturation","adjustment":[{"_obj":"hueSatAdjustmentV2","hue":0,"lightness":0,"saturation":-100}],"colorize":false,"presetKind":{"_enum":"presetKindType","_value":"presetKindCustom"}}], {});
				///==
			} 
			catch (e) {alert(e)}
		}
	}
}


//// COMO SELECINONAR O DOCUMENTO NA AREA DE TRABALHO:
//// POR NOME: {"_obj":"select","_target":[{"_ref":"document","_name":"Untitled-1#1"}]}
//// COMO IDENTIFICAR O ID DO DOCUMENTO ATIVO:
//// POR ID: alert(app.activeDocument._id)

