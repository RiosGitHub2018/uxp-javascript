const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;
const Constants = require('photoshop').constants;
const alert = app.showAlert;
const os = require('os') ;
const Usuario = os.homedir().replace(/\\/g, '/'); 
const photoshop = require("photoshop");
const imaging = photoshop.imaging;
const kSRGBProfile = "sRGB IEC61966-2.1";
anchorPos = require('photoshop').constants.AnchorPosition
const cpu = os.cpus()
const memoria = os.totalmem()


es1.on('#bt01', 'click', abrirModal)
function abrirModal() {
    try {
        // Verifica se o modal já existe no DOM e remove se necessário
        let existingDialog = document.getElementById("dialogo");
        if (existingDialog) {
            existingDialog.remove();
        }

        // Criar o diálogo
        let dialog = document.createElement("dialog");
        dialog.id = "dialogo";
        document.body.appendChild(dialog);

        // Adicione um ouvinte para o evento "close"
        dialog.addEventListener("close", () => {
            alert("A janela modal foi fechada!");
        });


        dialog.show({ title: `Meu Modal`, resize: "both", size: {width: 300, height: 200},})

        // Conteúdo do modal
        const conteudoModal = document.createElement("div");
        dialog.appendChild(conteudoModal);

        conteudoModal.innerHTML = `
            <div style="height: 100%; padding: 5px; display: flex; align-items: flex-start; margin: -30px; transform: translateY(-25px);">
                <div id="elem6" style="width: 70%; display: flex; flex-direction: column; align-items: end; border: var(--cor-borda-setas); padding: 10px; margin: 5px;">
				    <div id="elem6textTexto1"></div>
					<div id="elem6textTexto2"></div>
                    <div id="elem6Lista01"></div>
					<div id="elem6textNumebe1"></div>
					<div id="grupoPainel1"></div>
                </div>
                <div style="width: 30%; display: flex; flex-direction: column; align-items: flex-start; margin: 5px;">
                    <div class="btnMedio" id="btnSMT-func2">Botão A</div>
                    <div class="btnMedio" id="btnSMT-func3">Botão B</div>
                </div>
                   <div id="grupotextNumebe2" style="width: 100%; display: flex; align-items: center">
                     <div id="elem6textNumebe2"></div>
                   <label  id="label" style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: var(--font-principal-cor);">Teste</label>
                </div>

                <div id="checkbox01"></div>
            </div>
        `;
		s1("#elem6").classList.add('painelBGescuro');

		inputTextoMD("#elem6textTexto1", "Nome", "flex", "", 100);
		inputTextoMD("#elem6textTexto2", "Sufixo", "flex", "", 100);

        // Adicionar a lista de itens no elemento com id elem6Lista01
        const list1itens = ["Item 01", "-", "Item 02", "Item 03", "Item 04", "Item 05"];
        dropdowListMD("#elem6Lista01", "Lista", "flex", "#List01", list1itens, 100);
		es1.css("#elem6Lista01", { transform:" translateX(4px)"});

		//// DIV PAI NO HTML / TEXTO REF / LARGURA / ID INPUT / TAMNHO W / ID-SETA+ / ID-SETA-
		inputNumberMD("#elem6textNumebe1", "Valor: cm", "flex", "30", "Teste2", "setP2", "setN2");
		s1("#Teste2").value=30;


        inputNumberMD("#elem6textNumebe2", "Valor: cm", "flex", "30", "Teste3", "setP3", "setN3");
		s1("#Teste3").value=30;

		
		//////// OUVITE DE EVENTOS COM METODO IMPORTADO DA BIBLIOTECA
		es1.on('#setP2', 'click',  function() { cont = 1; s1("#Teste2").value= parseFloat(s1("#Teste2").value ) + cont });
		es1.on('#setN2', 'click', function() { cont = -1; s1("#Teste2").value=parseFloat(s1("#Teste2").value ) + cont });

        /////////////////// PAINEL CONFIG
        P01=[
            "#grupoPainel1", /////// ID DA ÁREA DO PAINEL
            "100%", ///// LARGURA DO PAINEL
            "80px", ///// ALTURA DO PAINEL
            "#Painel01",  //// ID DO CONTEUDO DO PAINEL
            "var(--cor-bordaClara)", ///// COR DA BORDA DO PAINEL
            "2px",  //// BORDER RADIOS DO PAINEL
            "Título",  //// TITULO DO PAINEL
            "#conteudoPainel1" /// CONTEÚDO DO PAINEL
        ];
		painelMD(P01[0], P01[1], P01[2], P01[3], P01[4], P01[5], P01[6], P01[7])//////PAINEL 1
        ////////////:::::::::::::::::::::
        s1("#conteudoPainel1").appendChild(s1("#grupotextNumebe2"));
        
        /////////////////// CHECKBOX  CONFIG
        checkboxMD("#checkbox01", "#ckB01", "Meu Checkbox")
        s1("#conteudoPainel1").appendChild(s1("#checkbox01"));
    	es1.on('#ckB01', 'click', function() { alert( s1('#ckB01').checked)});



        es1.cssAll('.btnMedio', { height: '25px',  lineHeight: "20px"});
        // Adicionar evento de fechamento ao clicar fora do modal
        dialog.addEventListener('click', function (event) {
            if (event.target === dialog) { dialog.close(); dialog.remove(); }
        });

        // Opcional: Adicionar eventos nos botões para fechar o modal
        document.getElementById('btnSMT-func2').addEventListener('click', function () {
            dialog.close(); dialog.remove();
        });

        document.getElementById('btnSMT-func3').addEventListener('click', function () {
            dialog.close(); dialog.remove();
        });

    } catch (error) {alert(error);}
}













// try {
// 	es1.on('#elem', 'click', function() {
// 		alert('Elemento clicado!');
// 	});
	
// 	es1.onAll('.elems', 'click', function() {
// 		this.style.color = 'red';
// 	});
	
// 	es1.css('#elem', { color: '#ffffff', fontSize: '20px', backgroundColor: "red"});
// 	es1.cssAll('.elems', { color: '#ffffff', fontSize: '12px'});




// 	///////////////////////////////////////////////////////////////
//     ///////// CARREGAR CAIXA DE TEXTO COM SETINHAS

//     //// DIV PAI NO HTML / TEXTO REF / LARGURA / ID INPUT / TAMNHO W / ID-SETA+ / ID-SETA-
//     inputNumberMD("#elemento1", "", "none", "65", "Teste", "setP1", "setN1"); 
//     s1("#Teste").value=25;
// 	//////// OUVITE DE EVENTOS COM METODO IMPORTADO DA BIBLIOTECA
// 	es1.on('#setP1', 'click',  function() { cont = 1; s1("#Teste").value= s1("#Teste").value + cont });
// 	es1.on('#setN1', 'click', function() { cont = -1; s1("#Teste").value= s1("#Teste").value + cont });
     

// 	/////////ADCIONAR ITENS A UM PAINEL
// 	// var itensPainel=[ s1("#elemento3"),  s1("#elemento4"),  s1("#elemento5")]
//    	// itensPainel.forEach(function(itens) {s1("#painel").appendChild(itens); });
      

// 	 function criarJanModal(){
// 		   try {
// 				//////// CHECKBOX METHOD
// 				es1.on('#ckb1', 'click', function() {alert( s1('#ckb1').checked)});

// 				///////// CRIAÇÃO DE PAINEIS
// 				Painel = document.createElement("div");
// 				document.appendChild(Painel);  Painel.id="Painel01";
// 				s1('#Painel01').classList.add('painelBGescuro');

// 				var itensPainel=[ 
// 					s1("#elemento3"),  //// CAIXA DE TEXTO "NOME"
// 					s1("#elemento4"),   //// CAIXA DE TEXTO "SUFIXO"
// 					s1("#elemento5"),  //// DROPDOWLIST "LISTA"
// 					s1("#elemento2"),  //// CAIXA  NUMBER "VALOR"
// 				]
// 				itensPainel.forEach(function(itens) {s1("#Painel01").appendChild(itens); });
		
// 				Painel2 = document.createElement("div");
// 				document.appendChild(Painel2);  Painel2.id="Painel02";

// 				Painel3= document.createElement("div");
// 				document.appendChild(Painel3);  Painel3.id="Painel03";

// 				Painel3.innerHTML = `
// 					<div style="height: 100%; padding: 5px; display: flex; align-items: flex-start; margin: -30px; transform: translateY(-25px);">
// 						<div  id="elemento6" style="width: 70%; display: flex; flex-direction: column; align-items: end; border: var(--cor-borda-setas); padding: 10px; margin: 5px; "></div>
// 						<div  style="width: 30%; display: flex; flex-direction: column; align-items: flex-start; margin: 5px;">
// 						<div class="btnMedio" id="btnSMT-func2">Botão A</div>
// 						<div class="btnMedio" id="btnSMT-func3">Botão B</div>
// 						</div>
// 					</div>
// 				`
//   			//    es1.css("#elemento3", {marginTop: "-15 px"}); 

// 				itensPainel.forEach(function(itens) {s1("#elemento6").appendChild(itens); });

// 				//s1('#Painel02').classList.add('painelBGescuro');

// 			   //////// CRIAR DIALOGO
// 			   dialog = document.createElement("dialog");
// 			   document.appendChild(dialog);  dialog.id= "dialogo";
// 			   dialog.show({ title: `Meu Modal`, resize: "both", size: {width: 300, height: 200},})
// 			//    dialog.appendChild( s1("#Painel01"));  
// 			//    dialog.appendChild( s1("#Painel02"));   
// 			    dialog.appendChild( s1("#Painel03"));  
			   
// 			   inputTexto("#elemento3", "Nome", "flex", "", 100);
// 			   inputTexto("#elemento4", "Sufixo", "flex", "", 100);

// 			   ////////DROPDOWLIST( ID-DIV HTML, TEXTO LISTA,  ID-LISTA, ARRAY-ITENS, LARGURA-LISTA)
// 			   const list1itens = ["Item 01", "-",  "Item 02", "Item 03"];
// 			   listDropdow("#elemento5", "Lista", "flex", "#List01", list1itens, 100);	
// 			   es1.css("#elemento5", { transform:" translateX(4px)"});
// 			   ///////EVENTOS
// 			   es1.on('#List01"', 'change', function() { alert( s1('#List01').value)  });

// 				//// DIV PAI NO HTML / TEXTO REF / LARGURA / ID INPUT / TAMNHO W / ID-SETA+ / ID-SETA-
// 				inputNumberMD("#elemento2", "Valor", "flex", "30", "Teste2", "setP2", "setN2");
// 				s1("#Teste2").value=30;
// 				//////// OUVITE DE EVENTOS COM METODO IMPORTADO DA BIBLIOTECA
// 				es1.on('#setP2', 'click',  function() { cont = 1; s1("#Teste2").value= s1("#Teste2").value + cont });
// 				es1.on('#setN2', 'click', function() { cont = -1; s1("#Teste2").value= s1("#Teste2").value + cont });
	  

	   
// 		   } catch (error) {alert(error)}
// 	   }
// 	   //////// OUVITE DE EVENTOS COM METODO IMPORTADO DA BIBLIOTECA
// 	   es1.on('#bt01', 'click', criarJanModal );

    
// } catch (error) {alert(error)}

