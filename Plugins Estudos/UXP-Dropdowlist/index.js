const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

const list_MD = document.getElementById("list_MD");

document.querySelector("#btnDlgView").addEventListener("click", async () => dlgDropdow());
function dlgDropdow() {
	document.querySelector("#dlg").show({ title: "Config Espampa", resize: "both", size: { width: 260, height: 60 } })
	setTimeout(() => document.querySelector("#list_MD").focus(), 2);
}

corregarLista();
async function corregarLista() {
	conteudo_Obj = new Array();
	//// RESGATA DO LOCALSTORAG SE NAO EXISTIR ADICIONA OS ITENS PADROES:
	conteudo_Obj = JSON.parse(localStorage.getItem("conteudo")) || [{
			Legenda: '✅  Selecione',
			CodigoCor: "ffffff"
		}, {
			Legenda: '✅  Aluminio',
			CodigoCor: "eff3ff"
		}, {
			Legenda: '✅  Choop',
			CodigoCor: "eff3ff"
		}, {
			Legenda: '✅  Toda preta',
			CodigoCor: "020101"
		}, {
			Legenda: '✅  Toda branca',
			CodigoCor: "ffffff"
		}, {
			Legenda: '✅  Dupla',
			CodigoCor: "ffffff"
		}];	
	conteudo = conteudo_Obj.map(function (itemList) { return itemList.Legenda });
	////////// FUNC ADD OS ITENS DO ARRAY NA LISTA
	for (var i = 0; i < conteudo.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${conteudo[i]}</option>`); }
}

document.querySelector("#list_MD").addEventListener("change", evt => {	textSelectItens();})

document.querySelector("#AddPresets").addEventListener("click", async () => {
	dlgPresets(); document.querySelector("#et_new_preset").value = "";
	process = "adicionar";
});

////////// EDITAR ITEM DA LISTA
document.querySelector("#btnEdit").addEventListener("click", async () => {
	dlgPresets();
	document.querySelector('#btnColor').style.background = `#${refColor}`
	document.querySelector("#et_new_preset").value = legenda.split("✅  ")[1];
	process = null;
});

////////// RESETA LISTA
document.querySelector("#btnDesfault").addEventListener("click", async evt => {
	list_MD.innerHTML = ""; localStorage.removeItem("conteudo"); corregarLista();
	textSelectItens();
});

////////// REMOVE ITEM SELECIONADDO
document.querySelector("#btnRemover").addEventListener("click", async evt => {
	const item = Number(list_MD.selectedIndex);
	if (item < 6) { app.showAlert("Você não pode remover esse ítem, faz parte dos presets do Sistema!") }
	else if (conteudo_Obj.length == 8) { list_MD.innerHTML = ""; localStorage.removeItem("conteudo"); corregarLista(); }
	else { conteudo_Obj.splice(item, 1); atualizaLista(); }
	document.querySelectorAll('#list_MD option:last-child').item(0).selected = true;
	textSelectItens();
});

document.querySelector("#btnOK").addEventListener("click", async () => {
	savePresets(); 	textSelectItens();
});

document.querySelector("#btnClose").addEventListener("click", async () => {
	document.querySelector('#dlgPresets').close('OK');
});

function dlgPresets() {
	document.querySelector("#dlgPresets").show({ title: "Pressets", resize: "both", size: { width: 290, height: 60 } })
	setTimeout(() => document.querySelector("#et_new_preset").focus(), 16);
	document.querySelector('#btnColor').style.background = '#686868'
}

function savePresets() {if (process == "adicionar"){ novoItemADD(); } else {edidadoOKItem()}}

function novoItemADD(){
	nomePreset = "✅  " + document.getElementById("et_new_preset").value;
	var presetsExistents = conteudo_Obj.map(function (itemList) {return itemList.Legenda});
	if(nomePreset == "✅  ") {alert("Adicione nome do preset!"); return;}
	else if(presetsExistents.includes(nomePreset) == true) {alert("Esse preset já consta na lista, adicione outro nome!"); return;}
	else if( typeof corHexObtida === "undefined" || document.querySelector('#btnColor').style.background == "#686868" ){alert("Adicione uma cor para processeguir!"); return;}
	else{
		document.querySelector('#dlgPresets').close('OK');
		codigoColor = corHexObtida;
		if (conteudo_Obj.length == 6) {conteudo_Obj.splice(6, 0, {Legenda: "-", CodigoCor: "-" })};
		conteudo_Obj.push({ Legenda: nomePreset, CodigoCor: codigoColor });
		var conteudo = conteudo_Obj.map(function (itemList) { return itemList.Legenda });
		localStorage.setItem("conteudo", JSON.stringify(conteudo_Obj));
		list_MD.innerHTML = "";
		for (var i = 0; i < conteudo.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${conteudo[i]}</option>`); }
		document.querySelectorAll('#list_MD option:last-child').item(0).selected = true;
	}
}

function edidadoOKItem(){
	document.querySelector('#dlgPresets').close('OK');
	nomePreset = "✅  " + document.getElementById("et_new_preset").value;
	codigoColor = corHexObtida;
	try {conteudo_Obj.splice(sel, 1, { Legenda: nomePreset, CodigoCor: codigoColor });}
	catch(e){alert(e) };
	atualizaLista();
	list_MD.selectedIndex = sel;
}

function atualizaLista() {
	var conteudo = conteudo_Obj.map(function (itemList) { return itemList.Legenda });
	localStorage.setItem("conteudo", JSON.stringify(conteudo_Obj)); //// Salva no localStorage
	conteudo_Obj = JSON.parse(localStorage.getItem("conteudo"));  //// Resgata do localStorage
	list_MD.innerHTML = "";  //// Esvazia a lista;
	for (var i = 0; i < conteudo.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${conteudo[i]}</option>`); } //// Adiciona os itens atualizados;
}

document.getElementById('btnColor').addEventListener('click', async () => {
	await core.executeAsModal(async () => {
		const result = await app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }], color: { _obj: 'RGBColor', red: 0, green: 0, blue: 0, } }], {});
		const color = result[0].RGBFloatColor ?? null;
		color && (document.querySelector('#btnColor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`)
		//RGB to HEX conversion
		const rgbToHex = (r, g, b) => [r, g, b].map(x => {
			const hex = x.toString(16)
			return hex.length === 1 ? '0' + hex : hex
		}).join('');
		corHexObtida = rgbToHex(parseInt(color.red), parseInt(color.grain), parseInt(color.blue));
	})
});

async function textSelectItens(){
	sel = list_MD.selectedIndex;
	legenda = conteudo_Obj.map(function (itemList) { return itemList.Legenda; })[sel];
	refColor = conteudo_Obj.map(function (itemList) { return itemList.CodigoCor; })[sel];
	document.getElementById("resultlist").innerHTML = `Result: ${refColor} : ${legenda}`; 
}


// ////// 	SUBTITUIR ITENS DO ARRAY
// const months = [
// 	{nome: 'Banana', valor: "01"},
// 	{nome: 'Laranja', valor: "02"},
// 	{nome: 'Abacaxi', valor: "03"},
// ];

// index = 1;

// months.splice(index, 1, {nome: 'limão', valor: "04"});
// console.log(months);

// var numeros = [1, 2, 3, 4, 5, 7, 8, 9, 10];
// numeros.splice(numeros.indexOf(3), 1);
// alert(numeros);

// var numeros = ["abacate", "Beringela", "Cenoura", "Uva"];
// numeros.splice(0, 1);
// alert(numeros);


// const months = ['Jan', 'March', 'April', 'June'];
// months.splice(1, 0, 'Feb');
// // inserts at index 1
// console.log(months);
// // expected output: Array ["Jan", "Feb", "March", "April", "June"]

//  /// VERIFICA SE O ITEM JÁ EXIST
// let nomes = ['Matheus', 'Henrique', 'João', 'Pedro'];
// nomes.includes('Matheus'); // retorna true;

