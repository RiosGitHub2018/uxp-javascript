const app = require("photoshop").app;
const action = require("photoshop").action;

// const host = require("uxp").host;
// const {entrypoints} = require("uxp");
////////////// IMPORTA FUNÇÕES DE JX EXTERNOS
const {removeSature, ajNiveis, curvas, desfazer} = require("./scripts/funcs.js");

function runScript_01() { removeSature()}
function runScript_02() { ajNiveis()}
function runScript_03() { curvas()}
function runScript_04() { desfazer()}
////====


//////////ADICIONAR CAMADA DE TEXTO;
async function camadaText_add() {
	let textName_value = document.getElementById("textName").value;
	if(textName_value =="" ){app.showAlert("Adicione um nome")}
	else{	await meuTexto(textName_value);}
}

async function meuTexto(theText) {
	await require("photoshop").core.executeAsModal(async () => {	await require('photoshop').action.batchPlay([{"_obj": "make","_target": [{"_ref": "textLayer"}],"using": {"_obj": "textLayer","textKey": theText,"textShape": [{"_obj": "textShape","char": {"_enum": "char","_value": "box"},"bounds": {"_obj": "rectangle","top": 100,"left": 100,"bottom": 400,"right": 500}}],"textStyleRange": [{"_obj": "textStyleRange","from": 0,"to": theText.length,"textStyle": {"_obj": "textStyle","fontName":"Arial","fontPostScriptName":"Arial","fontScript":0,"fontStyleName":"Regular","size": {"_unit": "pixelsUnit","_value": 80},"color": {"_obj": "RGBColor","red": 100,"green": 0,"blue": 240},}}]} }], {});});
}
////====

/*
////////// ALTERA A COR DO PLANO DE FUNDO DO BOTÃO;
document.getElementById('btnColor').addEventListener('click', async () => {
	///////////////
	const result = await action.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }]}],{ });
	const color = result[0].RGBFloatColor ?? null
	document.querySelector('#btnColor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`
	
	const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {const hex = x.toString(16)
	return hex.length === 1 ? '0' + hex : hex	}).join('');///CONVERT RGB PARA HEXADECIMAL
	newcolorhex = rgbToHex(parseInt(color.red), parseInt(color.grain), parseInt(color.blue));
	document.querySelector('#btnColor').textContent = newcolorhex;
})
////====
*/

function savePresets(){
	app.showAlert("");
  var nomePreset = document.getElementById("adicionar").value;
  document.getElementById("list_MD").insertAdjacentHTML("beforeend", `<option>${nomePreset}</option>`);
  document.querySelectorAll('#list_MD option:last-child').item(0).selected =  true; //SELECIONA O NOVO ITEM ADICIONADO:
  conteudo.push(nomePreset); //ADICIONA O NOVO ITEM NO ARRAY CONTEUDO
  document.getElementById("adicionar").value = ""; //LIMPAR O CAMPO DE TEXTO
  novositens();
}

////////// ARRAY NOVOS ITENS NO ARRAY CONTEUDO
function novositens() {
	for (var i = 0; i < conteudo.length; i++) {
		var optn = conteudo[i];
		app.showAlert(optn);
		}
}
  //////////////////////
  ///======

////////// EXIBE O TEXTO DA OPÇAO MARCADA NA LISTA
document.querySelector("#list_MD").addEventListener("change", evt => {
	var e = document.getElementById("list_MD");
	app.showAlert(e.value);
})

////////// FUNC ADD OS ITENS DO ARRAY NA LISTA
var select = document.getElementById("list_MD");
var conteudo = ["Selecione", "HTML", "CSS", "JS", "PHP", "jQuery"];

function itensArray() {
	for (var i = 0; i < conteudo.length; i++) {
		var optn = conteudo[i];
		var el = document.createElement("option");
		el.textContent = optn;
		select.appendChild(el);
		}
	}
window.addEventListener("load", itensArray);
////////////// EXECUTA O A FUNÇÃO ITENSARRAY() APÓS TODOS OS ELEMENTOS HTML SEREM RENDERISADOS:
///===

////// DESMARCA GRUPOS BUTTONS RADIO:
function g1Radio(){desmarCar("r5"); desmarCar("r6"); desmarCar("r7"); desmarCar("r8");}
function g2Radio(){desmarCar("r1"); desmarCar("r2"); desmarCar("r3"); desmarCar("r4");}
function desmarCar(r){ document.getElementById(r).checked= false;}
///===


////// DESABILITA ELEMENTOS POR  CHECKBOX:
async function functionCheck(){
	var check_01 = document.querySelector("#check_01");
	if(check_01.checked == true ){desAB("r1", false ); desAB("r2", false); desAB("r3", false); desAB("r4", false);} 
	else{	desAB("r1", true); desAB("r2", true); desAB("r3", true); desAB("r4", true);}
}
async function desAB(r,v){ document.getElementById(r).disabled= v;}





