/////////////// BOTÕES COM ICONES
document.querySelector("#AMI-btn3").addEventListener("click", () => {
    core.executeAsModal(async () => { rotacionarDOC(-90)});
 });
 document.querySelector("#AMI-btn4").addEventListener("click", () => {
    core.executeAsModal(async () => { rotacionarDOC(90)});
 });

/////////////// OUVINTES EVENTOS ABA IMAGEM
document.querySelector("#btnImg-func1").addEventListener("click", () => {
    core.executeAsModal(async () => { imgFunctions(1) });
 });
 document.querySelector("#btnImg-func2").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(2)});
 });
 document.querySelector("#btnImg-func3").addEventListener("click", () => {
    core.executeAsModal(async () => { });
 });
 document.querySelector("#btnImg-func4").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(3)});
 });
 document.querySelector("#btnImg-func5").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(4)});
 });
 document.querySelector("#btnImg-func6").addEventListener("click", () => {
    core.executeAsModal(async () => {dlgDuplicarDoc()});
 });
 document.querySelector("#btnImg-func7").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(5)});
 });
 document.querySelector("#btnImg-func8").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(6)});
 });

 document.querySelector("#btnImg-func9").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(7)});
 });

 document.querySelector("#btnImg-func10").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(8)});
 });
 document.querySelector("#btnImg-func11").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(9)});
 });
 document.querySelector("#btnImg-func12").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(10)});
 });
 document.querySelector("#btnImg-func13").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(11)});
 });
 document.querySelector("#btnImg-func14").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(12)});
 });
 document.querySelector("#btnImg-func15").addEventListener("click", () => {
    core.executeAsModal(async () => {imgFunctions(13)});
 });
 document.querySelector("#btnImg-func17").addEventListener("click", () => {
   core.executeAsModal(async () => {imgFunctions(14)});
});
document.querySelector("#btnImg-func18").addEventListener("click", () => {
   core.executeAsModal(async () => {imgFunctions(15)});
});
document.querySelector("#btnImg-func19").addEventListener("click", () => {
   core.executeAsModal(async () => {imgFunctions(16)});
});
document.querySelector("#btnImg-func20").addEventListener("click", () => {
   core.executeAsModal(async () => {dlgRemaneCam()});
});
document.querySelector("#btnImg-func21").addEventListener("click", () => {
   core.executeAsModal(async () => {imgFunctions(18)});
});

/////////////// OUVINTES EVENTOS ABA FILTROS
document.querySelector("#btnFilter-func1").addEventListener("click", () => {
   core.executeAsModal(async () => {filterFunctions(1)});
});
document.querySelector("#btnFilter-func2").addEventListener("click", () => {
   core.executeAsModal(async () => {filterFunctions(2)});
});
document.querySelector("#btnFilter-func3").addEventListener("click", () => {
   core.executeAsModal(async () => {filterFunctions(3)});
});
document.querySelector("#btnFilter-func4").addEventListener("click", () => {
   core.executeAsModal(async () => {filterFunctions(4)});
});
document.querySelector("#btnFilter-func5").addEventListener("click", () => {
   core.executeAsModal(async () => {filterFunctions(5)});
});
document.querySelector("#btnFilter-func6").addEventListener("click", () => {
   core.executeAsModal(async () => {filterFunctions(6)});
});
document.querySelector("#btnFilter-func7").addEventListener("click", () => {
   core.executeAsModal(async () => {filterFunctions(7)});
});
document.querySelector("#btnFilter-func8").addEventListener("click", () => {
   core.executeAsModal(async () => {filterFunctions(8)});
});
document.querySelector("#btnFilter-func9").addEventListener("click", () => {
   core.executeAsModal(async () => {filterFunctions(9)});
});

 ////// FUNÇÕS AQUI
  function filterFunctions(m){
   try {       
       if(m== 1){ command = [{"descriptor": {"$FlRs":938322,"_obj":"addNoise","distort":{"_enum":"distort","_value":"uniformDistribution"},"monochromatic":false,"noise":{"_unit":"percentUnit","_value":12.5}}, "options": {"dialogOptions": "display"}}];}
       if(m== 2){ command = [{"descriptor": {"_obj":"dustAndScratches","radius":0,"threshold":0}, "options": {"dialogOptions": "display"}}];}
       if(m== 3){ command = [{"_obj":"play","_target":[{"_name":"ProfundBlur","_ref":"action"},{"_name":"Ps-fx Service","_ref":"actionSet"}]}];}
       if(m== 4){ command = [{"descriptor":{"_obj":"$LqFy"}, "options": {"dialogOptions": "display"}}];}
       if(m== 5){ command =  [{"descriptor":{"_obj":"$LqFy"}, "options": {"dialogOptions": "display"}}];}
       if(m== 6){ command = [{"descriptor": {"$GEfk":{"_enum":"$GEft","_value":"craquelure"},"_obj":"$GEfc"}, "options": {"dialogOptions": "display"}}];}
       if(m== 7){ command = [{"descriptor": {"_obj":"surfaceBlur","radius":{"_unit":"pixelsUnit","_value":5.0},"threshold":15}, "options": {"dialogOptions": "display"}}];}
       if(m== 8){ command = [{"descriptor": {"_obj":"gaussianBlur","radius":{"_unit":"pixelsUnit","_value":0}}, "options": {"dialogOptions": "display"}}];}
       if(m== 9){ command = [{"descriptor": {"_obj":"motionBlur","angle":0,"distance":{"_unit":"pixelsUnit","_value":10.0}}, "options": {"dialogOptions": "display"}}];}
       app.batchPlay(command, {});

   } catch (err) {alert(err)}
}

function imgFunctions(m){
   try {
      document.querySelector("#mn-Ajuste").style.display = "none";
      document.querySelector("#mn-AJCamadas").style.display = "none";
       if(m== 1){ command = [{"descriptor": {"_obj":"imageSize","constrainProportions":true,"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"scaleStyles":true,}, "options": {"dialogOptions": "display"}}];}
       if(m== 2){ command = [{"descriptor": {"_obj":"canvasSize"}, "options": {"dialogOptions": "display"}}];}
       if(m== 3){ command = [{"descriptor": {"_obj":"colorRange"}, "options": {"dialogOptions": "display"}}];}
       if(m== 4){ command = [{"_obj":"flattenImage"}];}
       if(m== 5){ command = [{"_obj":"flip","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"axis":{"_enum":"orientation","_value":"horizontal"}}];}
       if(m== 6){ command = [{"_obj":"flip","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"axis":{"_enum":"orientation","_value":"vertical"}}];}
       if(m== 7){ command = [{"descriptor": {"_obj":"adaptCorrect"}, "options": {"dialogOptions": "display"}}];}
       if(m== 8){ command = [{"descriptor": {"_obj": "gradientMapEvent"},"options": {"dialogOptions": "display" }}];}
       if(m== 9){ command = [{"descriptor": {"_obj":"levels"}, "options": {"dialogOptions": "display"}}];}
       if(m==10){command = [{"descriptor": {"_obj":"colorBalance"}, "options": {"dialogOptions": "display"}}];}
       if(m==11){command = [{"descriptor": {"_obj":"brightnessEvent"}, "options": {"dialogOptions": "display"}}];}
       if(m==12){command = [{"descriptor": {"_obj":"hueSaturation"}, "options": {"dialogOptions": "display"}}];}
       if(m==13){command = [{"descriptor": {"_obj":"curves"}, "options": {"dialogOptions": "display"}}];}
       if(m==14){command = [{"descriptor": {"_obj":"expand"}, "options": {"dialogOptions": "display"}}];}
       if(m==15){command = [{"descriptor": {"_obj":"feather"}, "options": {"dialogOptions": "display"}}];}
       if(m==16){command = [{"descriptor": {"_obj":"contract"}, "options": {"dialogOptions": "display"}}];}
       if(m==17){command = [];}
       if(m==18){command = [{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}];}
       app.batchPlay(command, {});
   } catch (err) {alert(err)}
}

//  function templat(){ const command = [ comandos aqui]; app.batchPlay(command, {});}

 ////// CARREGAR JALELA RENOMEAR CAMDA
 async function dlgRemaneCam() {
      dlg = document.querySelector("#dlgRnameLayer");
      dlg.show({ title: `PS-fxrios: Renomear Camadas`, resize: "both", size: { width: 280, height:100}})
      dlg.innerHTML = `<style>.Drname_main{ width:100%; height: 100%; display: flex; flex-direction: column; align-items: center; margin: auto; padding: 10px; border: 1px solid rgb(65, 65, 65); border-radius:10px; background-color: #615f5f; } .Drname_Container{ width: 100%; display: flex; 	flex-direction: column; flex-wrap: wrap; align-items: center; border: 1px solid rgb(65, 65, 65); padding: 10px;} </style> <!-- //////// DIALOGO LAYOUT --> <div class="Drname_main"> <div class="Drname_Container" > <h1 style="color: #a19f9f;">Renomear Camadas</h1> <sp-divider></sp-divider><div style="display: flex; padding: 0 0 0 5px"> <label style="color: #dddddd; font-size: 12px; margin: 0px;">Nome:</label> <input  type="text" id="textNome" value=""  style="width: 90px; height: 21px; padding: 2px;"> <label style="color: #dddddd; font-size: 12px; margin: 1px;">Seq:</label> <select id="sequencia"><option>1</option><option>2</option><option>3</option><option>4</option></select> </div> </div> <div style="width: 100%; display: flex; align-items: center; margin-top: 5px; border: 1px solid #474747; padding: 10px; justify-content: center; border-radius: 0 0 7px 7px; background-color: #4e4d4d;"> <div class="btnMedio" id="Drname_btn1" style="width: 100px; margin: 5px;">Fechar</div> <div class="btnMedio" id="Drname_btn2" style="width: 100px; margin: 5px;">Renomear</div></div></div>`
      /////////:::::::::::::::::
      sequencia = document.querySelector("#sequencia");
      textNome =  document.querySelector("#textNome");
      sequencia.selectedIndex=1;
      function temporizador() { document.querySelector("#textNome").focus(), 16 }
      setTimeout(temporizador, 100);
      ///////// OUVINTES DE EVENTOS AQUI!
      document.querySelector("#Drname_btn1").addEventListener("click", () => {dlg.close('OK'); });
      document.querySelector("#Drname_btn2").addEventListener("click", () => {renomeiaCamadas();});
}

function renomeiaCamadas(){
	try {
      const newName = textNome.value; 
      const digitos= sequencia.selectedIndex+1;
      if(textNome.value==""){alert("Adicione o nome!"); return};

      core.executeAsModal(async () => {
            const camadasSel = app.activeDocument.activeLayers;
           // for (const camada of camadasSel) {camada.selected = true;}////SELECIONA TODAS AS CAMADAS ESCOLHIDAS NOVAMENTE
            for ( i = 0; i < camadasSel.length; i++) { 
               contage = `${ i+1}`; contage = contage.padStart(digitos,"0");
               camadasSel[i].name= `${newName} ${contage}`; 
            };
       });
	} catch (e) {alert(e)};
   function temporizador() { document.querySelector("#textNome").focus(), 16 }
   setTimeout(temporizador, 100);
}////// CARREGAR JALELA RENOMEAR CAMDA:::::::::::::::::::


 ////// CARREGAR JALELA DUPLICAR DOCUMENTO
async function dlgDuplicarDoc(){
      if(app.documents.length ===0){alert("Não ha documento na área de trabalho!");return};
      dlg = document.querySelector("#dlgDuplicarDoc");
      dlg.show({ title: `PS-fxrios: Duplicar Imagem`, resize: "both", size: { width: 350, height:100}})
      dlg.innerHTML =`<style> .dupDoc_main { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; margin: auto; padding: 10px; border: 1px solid rgb(65, 65, 65); border-radius: 10px; background-color: #615f5f; }.dupDoc_Container { width: 100%; display: flex; flex-direction: column; flex-wrap: wrap; align-items: left; border: 1px solid rgb(65, 65, 65); padding: 10px; } </style> <!-- //////// DIALOGO LAYOUT --> <div class="dupDoc_main"> <div class="dupDoc_Container"> <h1 style="color: #a19f9f;">Dupicar Imagem</h1> <sp-divider style="margin: 0 0 10px 0"></sp-divider> <label id="docAtual" style="color: #dddddd; font-size: 12px; margin-left: 7px;">Nome:</label> <div style="display: flex; padding: 0 0 0 0px"><label style="color: #dddddd; font-size: 12px; margin-left: 7px;">Como:</label> <input type="text" id="textNomeDoc" value="" style="width: 252px; height: 21px; padding: 2px;"> </div> <div style="display: flex; align-items: center; transform: translateX(50px);"> <label style="color: #dddddd; font-size: 12px; margin: 0px;">Cópias:</label> <select id="listCopias" style="width: 50px;"> </select> <div class="cb-default cb-checado" id="ckDPDoc"><span class="cb-text" style="width: 90px;">Achatar Imagem</span></div> </div> </div> <div style="width: 100%; display: flex; align-items: center; margin-top: 5px; border: 1px solid #474747; padding: 10px; justify-content: center; border-radius: 0 0 7px 7px; background-color: #4e4d4d;"> <div class="btnMedio" id="dupDoc_btn1" style="width: 100px; margin: 5px;">Fechar</div> <div class="btnMedio" id="dupDoc_btn2" style="width: 100px; margin: 5px;">Duplicar</div> </div> </div>`;
            
      docAtual = document.querySelector("#docAtual");
      textNomeDoc = document.querySelector("#textNomeDoc");
      docAtual.innerHTML =`Duplicar:   ${app.activeDocument.name}`;
      try { textNomeDoc.value = `${app.activeDocument.name.match(/(.*)\.[^\.]+$/)[1]}` } 
      catch (error) {textNomeDoc.value = `${app.activeDocument.name}` }
      
      function temporizador() { document.querySelector("#textNomeDoc").focus(), 16 }
      setTimeout(temporizador, 100);

      const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      listCopias = document.querySelector('#listCopias');
      for (let i = 0; i < options.length; i++) { listCopias.innerHTML += `<option value="${options[i]}">${options[i]}</option>`;}
      
      checadoCK2 = true;
      ck2 = document.getElementById("ckDPDoc");
      validaCkDPDoc();
      ck2.addEventListener("click", function() { validaCkDPDoc() });
      
      function validaCkDPDoc() {
         if (checadoCK2 != true) { ck2.classList.add('cb-checado'); checadoCK2 =true;} 
         else { ck2.classList.remove('cb-checado'); checadoCK2 = false; };
      }

      function duplicaImagem(){
      core.executeAsModal( async() => {
            dlg.close('OK');
            copias = listCopias.selectedIndex+1;
            if(copias===0) copias=1;
            for (let i = 0; i < copias ; i++) { 
               contage = `${ i +1}`; contage = contage.padStart(2,"0");
               await app.batchPlay( [{"_obj":"duplicate","_target":[{"_enum":"ordinal","_ref":"document","_value":"first"}],"documentID":172,"name": `${textNomeDoc.value}#${contage}` }]);
               if(checadoCK2 == true){await app.batchPlay( [{"_obj":"flattenImage"}]);}
            };
         });
      };

      document.querySelector("#dupDoc_btn1").addEventListener("click", () => {dlg.close('OK'); });
      document.querySelector("#dupDoc_btn2").addEventListener("click", () => {duplicaImagem()});
}////// CARREGAR JALELA RENOMEAR CAMDA::::::::::::::::
////////////////////////////////////////////////////////////////////






