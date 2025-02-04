const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

const  list_MD = document.getElementById("list_MD");

document.querySelector("#btnDlgView").addEventListener( "click", async () => dlgDropdow());
function dlgDropdow(){
	document.querySelector("#dlg").show({title: "Pressets", resize: "both",size: {  width: 260, height: 60}})
	setTimeout(() => document.querySelector("#list_MD").focus(), 2);
}

////////// EXIBE O TEXTO DA OPÇAO MARCADA NA LISTA
document.querySelector("#list_MD").addEventListener("change", evt => {verResult_list();})

////////// FUNC ADD OS ITENS DO ARRAY NA LISTA
var select = list_MD;
var conteudo = [];

function itensArray() {
	//// RESGATA DO LOCALSTORAG SE NÃO EXISTIR ADICIONA OS ITENS PADRÕES:
	const conteudo = JSON.parse(localStorage.getItem('itens')) || ["Selecione", "Alumínio", "Choop", "Toda Preta", "Toda Branca", "Dupla"];
	localStorage.setItem('itens', JSON.stringify(conteudo));

	for (var i = 0; i < conteudo.length; i++) {
		var optn = conteudo[i];
		var el = document.createElement("option");
		el.textContent = optn;	select.appendChild(el);
		}
	}
//window.addEventListener("load", itensArray);
////////////// EXECUTA O A FUNCAO ITENSARRAY() APOS TODOS OS ELEMENTOS HTML SEREM RENDERISADOS:
///===

function savePresets(){
	atualizarLista();
	if(conteudo.length == 6){list_MD.insertAdjacentHTML("beforeend", `<option>-</option>`);}
	novoItemADD(); atualizarLista();
  }
  
function novoItemADD(){
	var codigoColor = "[" + newcolorhex + "] ✅ ";
	var nomePreset = document.getElementById("et_new_preset").value;
	list_MD.insertAdjacentHTML("beforeend", `<option>${codigoColor + nomePreset}</option>`);
}

////////// ATULISALISTA
function atualizarLista(){
	conteudo = [];
	var sel = list_MD;
	var options = sel.options;
	for(var i = 0; i < options.length;i++){	conteudo.push(options[i].value);}
	//// SALVA OS DADOS NO LOCALsTORAGE
	localStorage.setItem('itens', JSON.stringify(conteudo));
	 //// RESETA ALISTA
	list_MD.innerHTML = "";
	 //// RECARREGA ATUALIZADO
	itensArray();
	document.querySelectorAll('#list_MD option:last-child').item(0).selected =  true; //SELECIONA O NOVO ITEM ADICIONADO:
}

////////// REMOVE ITEM SELECIONADDO
document.querySelector("#btnRemover").addEventListener( "click", async evt => { 
	const item = list_MD.selectedIndex;
	atualizarLista();
	if( item <6 ){app.showAlert("Você não pode remover esse ítem, faz parte dos presets do Sistema!")}
	else if (conteudo.length == 8){
		select.removeChild(select.options[item]); list_MD.selectedIndex = item;
		select.removeChild(select.options[6]);list_MD.selectedIndex = 5;
	}
	else{select.removeChild(select.options[item]); list_MD.selectedIndex = item;	}
	atualizarLista();
});
///======

////////// RESETA LISTA
document.querySelector("#btnDesfault").addEventListener( "click", async evt => { 
    list_MD.innerHTML = "<option>Selecione</option><option>Alumínio</option><option>Choop</option><option>Toda Preta</option><option>Toda Branca</option><option>Dupla</option>";
	atualizarLista(); verResult_list();
});
///======

document.querySelector("#AddPresets").addEventListener( "click", async () => {
	dlgPresets(); document.querySelector("#et_new_preset").value="";
});

document.querySelector("#btnEdit").addEventListener( "click", async () => {
	dlgPresets(); 
	const pressetConfig = list_MD.value;
	const colorHex =  pressetConfig.split("] ✅ ")[0].split("[")[1];
	document.querySelector('#btnColor').style.background = `#${ colorHex }`
	document.querySelector("#et_new_preset").value= pressetConfig.split("✅ ")[1];
	// /// CORVETER HEX PARA RGB
	// const aRgbHex = colorHex.match(/.{1,2}/g);
	// const aRgb = [ parseInt(aRgbHex[0], 16),  parseInt(aRgbHex[1], 16),  parseInt(aRgbHex[2], 16) ];
	// const color = aRgb;
	// color && (document.querySelector('#btnColor').style.backgroundColor = `rgb(${aRgb[0]} ${aRgb[1]} ${aRgb[2]})`);
	  verResult_list();
});

function dlgPresets(){
	document.querySelector("#dlgPresets").show({title: "Pressets", resize: "both",size: {  width: 270, height: 60}})
	setTimeout(() => document.querySelector("#et_new_preset").focus(), 16);
	document.querySelector('#btnColor').style.background = '#686868'
}

document.querySelector("#btnOK").addEventListener( "click", async () => {
  if(document.querySelector('#btnColor').style.background == "#686868"){
	 app.showAlert("Selecione a cor"); return;
 	 }
	document.querySelector('#dlgPresets').close('OK');
	savePresets(); verResult_list();

});

document.querySelector("#btnClose").addEventListener( "click", async () => {
	document.querySelector('#dlgPresets').close('OK');
});

document.getElementById('btnColor').addEventListener('click', async () => {
    await core.executeAsModal( async() => {       
		const result = await app.batchPlay([{ _obj: "showColorPicker", _target: [{ _ref: "application" }], color: {_obj: 'RGBColor', red: 0, green: 0, blue: 0,}}],{ });
		const color = result[0].RGBFloatColor ?? null
		color && (document.querySelector('#btnColor').style.backgroundColor = `rgb(${color.red} ${color.grain} ${color.blue})`)
		//RGB to HEX conversion
		const rgbToHex = (r, g, b) =>  [r, g, b].map(x => {const hex = x.toString(16)
		return hex.length === 1 ? '0' + hex : hex	}).join('');
		newcolorhex = rgbToHex(parseInt(color.red), parseInt(color.grain), parseInt(color.blue));
		}
	)
})

function verResult_list(){
	var e = list_MD;
	document.getElementById("resultlist").innerHTML = "Result: " + e.value;
}



var conteudo_Obj = [
	{Legenda: 'Vermelha', CodigoCor: "#ff3300"},
	{Legenda: 'Amarela', CodigoCor: "#ffcc00"},
	{Legenda: 'Laranja', CodigoCor: "#ffccff"},
	{Legenda: 'Verde', CodigoCor: "#dddccc"}
];

var conteudo = conteudo_Obj.map(function(itemList){ return itemList.Legenda});

for(var i = 0; i < conteudo.length;i++){	
	list_MD.insertAdjacentHTML("beforeend", `<option>${conteudo[i]}</option>`);
}

document.querySelector("#list_MD").addEventListener("change", evt => {	
	const sel = list_MD.selectedIndex;
	const legenda = conteudo_Obj.map(function(itemList){ return itemList.Legenda;})[sel];
	const refColor = conteudo_Obj.map(function(itemList){ return itemList.CodigoCor;})[sel];
	alert(refColor);
})
  
