const action = require("photoshop").action;
const core = require("photoshop").core;
 const app = require("photoshop").app;
const alert = app.showAlert;

//////CONFIGS ABA MENU AJUSTE
list_MD = document.getElementById("list_MD");
document.querySelector("#aj1").classList.add('ajustON');
const iconsBtn = document.getElementsByClassName("ajustIcon");
const tBtn = Array.from(iconsBtn);
for(let i = 0; i < tBtn.length; i++){ 
	tBtn[i].addEventListener('click', (event) => {
		for(let i = 0; i < tBtn.length; i++){
			index = tBtn.indexOf(event.currentTarget);
			tBtn[i].classList.remove('selecionado');
		}
		event.currentTarget.classList.add('selecionado');
		document.querySelector("#aj1").classList.remove('ajustON');
		document.querySelector("#aj2").classList.remove('ajustON');
		document.querySelector("#aj3").classList.remove('ajustON');
		if(index===0){ 
			document.querySelector("#aj1").classList.add('ajustON');
			document.querySelector("#tituloAba").textContent= "BALANÇO DE CORES";
		}
		if(index===1){ 
			document.querySelector("#aj2").classList.add('ajustON');
			document.querySelector("#tituloAba").textContent= "MATIZ E SATURAÇÃO";
		}
		if(index===2){ 
			document.querySelector("#aj3").classList.add('ajustON');
			document.querySelector("#tituloAba").textContent= "LUMINOSIDADE";
		}
	});
}
/////////:::::::::::::::::::::::::::::
const sld1 = document.querySelector("#sld1");
const sld2 = document.querySelector("#sld2");
const sld3 = document.querySelector("#sld3");
const sld4 = document.querySelector("#sld4");
const sld5 = document.querySelector("#sld5");
const sld6 = document.querySelector("#sld6");
const sld7 = document.querySelector("#sld7");
const sld8 = document.querySelector("#sld8");
const sld9 = document.querySelector("#sld9");
const sld10 = document.querySelector("#sld10");
const sld11 = document.querySelector("#sld11");

sld1.addEventListener("change", async (func) => {
	document.querySelector("#vsld1").innerHTML = `${func.target.value}%`
	await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
	}) 
sld2.addEventListener("change", async (func) => {
	document.querySelector("#vsld2").innerHTML = `${func.target.value}%`
	await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
	}) 
sld3.addEventListener("change", async (func) => {
	document.querySelector("#vsld3").innerHTML = `${func.target.value}%`
	await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
	}) 
sld4.addEventListener("change", async (func) => {
	document.querySelector("#vsld4").innerHTML = `${func.target.value}%`
	await ajusteColor(2,"Hue/Saturar",sld4.value, sld5.value, sld6.value);
	}) 
sld5.addEventListener("change", async (func) => {
	document.querySelector("#vsld5").innerHTML = `${func.target.value}%`
	await ajusteColor(2,"Hue/Saturar",sld4.value, sld5.value, sld6.value);
	}) 
sld6.addEventListener("change", async (func) => {
	document.querySelector("#vsld6").innerHTML = `${func.target.value}%`
	await ajusteColor(2,"Hue/Saturar",sld4.value, sld5.value, sld6.value);
	}) 
sld7.addEventListener("change", async (func) => {
	document.querySelector("#vsld7").innerHTML = `${func.target.value}%`
	await ajusteColor(3,"Brigh/Contra",sld7.value, sld8.value, null);
	}) 
sld8.addEventListener("change", async (func) => {
	document.querySelector("#vsld8").innerHTML = `${func.target.value}%`
	await ajusteColor(3,"Brigh/Contra",sld7.value, sld8.value, null);
	}) 
sld9.addEventListener("change", async (func) => {
	document.querySelector("#vsld9").innerHTML = `${func.target.value}%`
	await ajusteColor(4,"Niveis+",sld9.value, null, null);
	}) 
sld10.addEventListener("change", async (func) => {
	document.querySelector("#vsld10").innerHTML = `${func.target.value}%`
	await ajusteColor(4,"Niveis-",sld10.value, null, null);
	}) 

sld11.addEventListener("change", async (func) => {
	document.querySelector("#vsld11").innerHTML = `${func.target.value}%`
	await ajusteColor(5,"Conteudo",sld11.value, null, null);
	}) 


async function ajusteColor(ajuste, name, v1, v2, v3){
	const {executeAsModal} = require("photoshop").core;
	const {batchPlay} = require("photoshop").action;
	async function colorBalance() {
		if(ajuste === 1){
			await batchPlay( [ { _obj: "set", _target: [ { _ref: "adjustmentLayer", _name: name, _value: "targetEnum" } ], to: { _obj: "colorBalance", midtoneLevels: [ v1, v2, v3 ] }, _options: { dialogOptions: "dontDisplay" } } ], { modalBehavior: "wait" } );
			}
		if(ajuste === 2){
			await batchPlay( [{_obj:"set",_target:[{_ref:"adjustmentLayer", _name: name, _value:"targetEnum"}],to:{_obj:"hueSaturation",presetKind:{_enum:"presetKindType",_value:"presetKindCustom"},adjustment:[{_obj:"hueSatAdjustmentV2",hue: v1,saturation: v2, lightness: v3}]},_options:{dialogOptions:"dontDisplay"}}], { modalBehavior: "wait" } );
			}
		if(ajuste === 3){
			await batchPlay( [{_obj:"set",_target:[{_ref:"adjustmentLayer", _name: name, _value:"targetEnum"}],to:{_obj:"brightnessEvent",brightness: v1,center: v2,useLegacy:false},_options:{dialogOptions:"dontDisplay"}}], { modalBehavior: "wait" } );
			}
		if(ajuste === 4){
			await batchPlay( [{ _obj: "set", _target: [ { _ref: "layer", _name: name,  _value: "targetEnum" } ], to: { _obj: "layer", opacity: { _unit: "percentUnit", _value: v1 } }, _options: { dialogOptions: "dontDisplay" } }],{synchronousExecution:false,modalBehavior:"wait"} );
			}
		if(ajuste === 5){
				await batchPlay( [{ _obj: "set", _target: [ { _ref: "filterFX", _index: 1 }, { _ref: "layer", _name: name,  _value: "targetEnum" } ], filterFX: { _obj: "filterFX", filter: { _obj: "adaptCorrect", shadowMode: { _obj: "adaptCorrectTones", amount: { _unit: "percentUnit", _value: v1 }, width: { _unit: "percentUnit", _value: 50 }, radius: 30 }, highlightMode: { _obj: "adaptCorrectTones", amount: { _unit: "percentUnit", _value: 24 }, width: { _unit: "percentUnit", _value: 50 }, radius: 30 }, blackClip: 0.01, whiteClip: 0.01, center: 0, colorCorrection: 20 } }, _options: { dialogOptions: "dontDisplay" } }],{synchronousExecution:false,modalBehavior:"wait"} );  
			};
			await app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}]);
	};
	async function runModalFunction() {await executeAsModal(colorBalance);}
	await runModalFunction();
};

 ////// CARREGAR JALNELA RENOMEAR CAMADA
 async function dlgADDpresAjuste() {
    try {
        dlg = document.querySelector("#dlgAjuste");
        dlg.show({ title: `Adionar Presets`, resize: "both", size: { width:270, height:80}})
        dlg.innerHTML = ` <style> .ap_Container { width: 100%; display: flex; flex-direction: column; flex-wrap: wrap; align-items: center; border: 1px solid rgb(65, 65, 65); padding: 5px; background: linear-gradient(to bottom,  #919191 1%, #919191 5%, #6f6f6f 5%,#676767 44%, #5d5d5d 100%); border-radius: 5px; } </style> <!-- //////// DIALOGO LAYOUT -->  <div class="ap_Container"> <div style="width: 100%; display: flex; align-items: center;  padding: 10px;"> <input type="text"  id="et_new_preset" value="Novo Preset"  style="width: 120px; height: 23px; padding: 2px; margin: 0px; "> <div class="btnMedio" id="ap_btn1" style="width: 50px; margin: 1px;">Fechar</div> <div class="btnMedio" id="ap_btn2" style="width: 50px; margin: 1px;">OK</div>  </div>`;
        /////////:::::::::::::::::
		setTimeout(() => document.querySelector("#et_new_preset").focus(), 16);
        ///////// OUVINTES DE EVENTOS AQUI!
		document.querySelector("#ap_btn1").addEventListener("click", async () => {
			document.querySelector('#dlgAjuste').close('OK');
			});
		document.querySelector("#ap_btn2").addEventListener("click", async () => {
				novoItemADD();
				setTimeout(() => document.querySelector("#et_new_preset").focus(), 16);
			});
    } catch (err) {};
};////////////:::::::::::::

////// PEDEFINISSÕES CONFIG
try {
	/////// CARREGA DINAMICAMENTE A LISTA
	list_MD = document.getElementById("list_MD");
	conteudo_Obj = new Array();
	//// RESGATA DO LOCALSTORAG SE NAO EXISTIR ADICIONA OS ITENS PADROES:
	conteudo_Obj = JSON.parse(localStorage.getItem("ajustSave")) || [
		{nome: 'Default',	sld01: 0, sld02: 0, sld03: 0, sld04: 0, sld05: 0, sld06: 0, sld07: 0, sld08: 0, sld09: 0, sld10: 0, sld11: 0}, 
	];	
	ajustSave = conteudo_Obj.map(function (itemList) { return itemList.nome });
	////////// FUNC ADD OS ITENS DO ARRAY NA LISTA
	//for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${ajustSave[i]}</option>`);}
	for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<sp-menu-item><label class="sp-dropDowC">${ajustSave[i]}</label></sp-menu-item>`); } //// Adiciona os itens atualizados;
	console.log(conteudo_Obj);
}
catch (e) {}
///////////::::::::::::::::::::

///// CRIAÇÃO DE PRESSETES
function novoItemADD(){
	const list_MD = document.getElementById("list_MD");
	try {
		nomePreset = "" + document.getElementById("et_new_preset").value;
		var presetsExistents = conteudo_Obj.map(function (itemList) {return itemList.nome});
		if(nomePreset == "" || nomePreset == "Novo Preset") {alert("Adicione nome do preset!"); return;}
		else if(presetsExistents.includes(nomePreset) == true) {alert("Esse preset já consta na lista, adicione outro nome!"); return;}
		else{
	    	conteudo_Obj.push({
					nome: nomePreset,	
					sld01: document.querySelector("#sld1").value, 
					sld02: document.querySelector("#sld2").value, 
					sld03: document.querySelector("#sld3").value, 
					sld04: document.querySelector("#sld4").value, 
					sld05: document.querySelector("#sld5").value, 
					sld06: document.querySelector("#sld6").value, 
					sld07: document.querySelector("#sld7").value, 
					sld08: document.querySelector("#sld8").value, 
					sld09: document.querySelector("#sld9").value, 
					sld10: document.querySelector("#sld10").value, 
					sld11: document.querySelector("#sld11").value, 
			}); 
			var ajustSave = conteudo_Obj.map(function (itemList) { return itemList.nome });
			localStorage.setItem("ajustSave", JSON.stringify(conteudo_Obj));
			list_MD.innerHTML = "";
			//for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${ajustSave[i]}</option>`); }
			for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<sp-menu-item><label class="sp-dropDowC">${ajustSave[i]}</label></sp-menu-item>`); } //// Adiciona os itens atualizados;
			//document.querySelectorAll('#list_MD option:last-child').item(0).selected = true;
			list_MD.selectedIndex=ajustSave.length-1;
			document.querySelector('#dlgAjuste').close('OK');
		}
	}
	catch (err) {alert(err)};
};

 ////// RESETA TDS VALORES
 async function resetar(){
	sliders = document.getElementsByClassName("slider");
	valors = document.getElementsByClassName("valoes"); 
	for (var i=0;i<sliders.length;i++){	document.getElementById(sliders[i].id).value=0;}
	for (var i=0;i<sliders.length;i++){	document.getElementById(valors[i].id).innerHTML ="0%"};
	list_MD.selectedIndex=0;
	await updatColorAjuste();
}

//////////ABRI DIALOGO ADD PRESETS
document.querySelector("#btnAddPresset").addEventListener("click", async (func) => {dlgADDpresAjuste();}) ;
////////// RESETAR CONFIGURAÇÕES
//document.querySelector("#resetar").addEventListener("click", async (func) => {resetar()}) ;
////////// REMOVE ITEM SELECIONADDO
document.querySelector("#btnRemover").addEventListener("click", async evt => {
	try {
		const list_MD = document.getElementById("list_MD");
		const item = Number(list_MD.selectedIndex);
		if (item ==0) { app.showAlert("Esse ítem não pode ser deletado!") }
		else { conteudo_Obj.splice(item, 1); atualizaLista();}
		//document.querySelectorAll('#list_MD option:last-child').item(0).selected = true;
		list_MD.selectedIndex=item-1;
		carregarValores();
	} catch (err) {list_MD.selectedIndex=0}
});
///////////////////////
function atualizaLista() {
	try {
		const list_MD = document.getElementById("list_MD");
		var ajustSave = conteudo_Obj.map(function (itemList) { return itemList.nome });
		localStorage.setItem("ajustSave", JSON.stringify(conteudo_Obj)); //// Salva no localStorage
		conteudo_Obj = JSON.parse(localStorage.getItem("ajustSave"));  //// Resgata do localStorage
		list_MD.innerHTML = "";  //// Esvazia a lista;
	//	for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<option>${ajustSave[i]}</option>`); } //// Adiciona os itens atualizados;
		for (var i = 0; i < ajustSave.length; i++) { list_MD.insertAdjacentHTML("beforeend", `<sp-menu-item ><label class="sp-dropDowC">${ajustSave[i]}</label></sp-menu-item>`); } //// Adiciona os itens atualizados;
	} catch (err) {}
}
  //////////////////////

///////// JS PREDEFINIÇÕES
list_MD.addEventListener("change", evt => {	carregarValores();})

async function carregarValores(){
	try {
		conteudoOBJ=[];
		sliders = document.getElementsByClassName("slider");
		valors = document.getElementsByClassName("valoes"); 
		sel = list_MD.selectedIndex;
		conteudoOBJ.push(conteudo_Obj[sel].sld01);
		conteudoOBJ.push(conteudo_Obj[sel].sld02);
		conteudoOBJ.push(conteudo_Obj[sel].sld03);
		conteudoOBJ.push(conteudo_Obj[sel].sld04);
		conteudoOBJ.push(conteudo_Obj[sel].sld05);
		conteudoOBJ.push(conteudo_Obj[sel].sld06);
		conteudoOBJ.push(conteudo_Obj[sel].sld07);
		conteudoOBJ.push(conteudo_Obj[sel].sld08);
		conteudoOBJ.push(conteudo_Obj[sel].sld09);
		conteudoOBJ.push(conteudo_Obj[sel].sld10);
		conteudoOBJ.push(conteudo_Obj[sel].sld11);
		for (var i=0;i<sliders.length;i++){	document.getElementById(sliders[i].id).value=conteudoOBJ[i];}
		for (var i=0;i<sliders.length;i++){	document.getElementById(valors[i].id).innerHTML = `${conteudoOBJ[i]}%`};
		await updatColorAjuste();
	} catch (err) {list_MD.selectedIndex=0}
}

async function updatColorAjuste(){
	await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
	await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
	await ajusteColor(1, "ColorBalance", sld1.value, sld2.value, sld3.value);
	await ajusteColor(2, "Hue/Saturar",sld4.value, sld5.value, sld6.value);
	await ajusteColor(2, "Hue/Saturar",sld4.value, sld5.value, sld6.value);
	await ajusteColor(2, "Hue/Saturar",sld4.value, sld5.value, sld6.value);
	await ajusteColor(3, "Brigh/Contra",sld7.value, sld8.value, null);
	await ajusteColor(3, "Brigh/Contra",sld7.value, sld8.value, null);
	await ajusteColor(4, "Niveis+",sld9.value, null, null);
	await ajusteColor(4, "Niveis-",sld10.value, null, null);
	await ajusteColor(5,"Conteudo",sld11.value, null, null);
}

list_MD.selectedIndex=0;
