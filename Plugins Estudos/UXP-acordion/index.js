const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;

//// BOTÕES ACORDION AQUI
document.querySelector("#btn1").addEventListener("click", evt => {
	abrirAbordion('#btn1','#cont_A', 0);
})

document.querySelector("#btn2").addEventListener("click", evt => {
	abrirAbordion('#btn2','#cont_B', 1);
})

document.querySelector("#btn3").addEventListener("click", evt => {
	abrirAbordion('#btn3','#cont_C', 2);
})

document.querySelector("#btn4").addEventListener("click", evt => {
	abrirAbordion('#btn4','#cont_D', 3);
})
//////===

function fecharAcordion(){
	var i, conteudo, botoes, icon;
	conteudo = document.getElementsByClassName("conteudo");
	for (i = 0; i < conteudo.length; i++) {	conteudo[i].style.display = "none";}
	botoes = document.getElementsByClassName("botoes");
	for (i = 0; i < botoes.length; i++) {botoes[i].style.background = " linear-gradient(to bottom,  #919191 1%, #919191 5%, #6f6f6f 5%,#676767 44%, #5d5d5d 100%)"}
	 icon =  document.getElementsByClassName("icon");
	 for (i = 0; i < icon.length; i++) {icon[i].innerHTML ="&#43;"}
}

abrirAbordion('#btn2','#cont_B', 1);
function abrirAbordion(botao, conteudo, index){ 
	fecharAcordion();
	document.querySelector(botao).style.background = "rgb(58, 96, 139); "
	document.querySelector(conteudo).style.display = "block";
	icon =  document.getElementsByClassName("icon");
	for (i = 0; i < icon.length; i++) {icon[index].innerHTML ="&#8722"}
}

////////// FUNÇÃO MÉTODO PELO VALOR DO ID DO BOTÃO: NESSE EXEMPLO: (btnAbrir) 
document.getElementById('btnAbrir').addEventListener('click', async () => {
	await core.executeAsModal(async () => {
		await app.batchPlay([{"_obj":"open", "_options": { "dialogOptions": "display" }}], {});
	})
});
