document.querySelector("#btnSMT-func1").addEventListener("click", () => {
    convertSmartOBJ(1);
 });

 document.querySelector("#btnSMT-func2").addEventListener("click", () => {
    convertSmartOBJ(2);
 });

 document.querySelector("#btnSMT-func3").addEventListener("click", () => {
    convertSmartOBJ(3);
 });

 document.querySelector("#btnSMT-func6").addEventListener("click", () => {
    dlgRemaneCam();
 });


 ////// CONVERTER CAMDAS
function convertSmartOBJ(obj) {
    try {
        core.executeAsModal(async (executionContext) => {
                let hostControl = executionContext.hostControl; documentID = app.activeDocument.id; 
                suspensionID = await hostControl.suspendHistory({ "documentID": documentID,"name": "SmatOBJ" });
                //////:::::::::::::::::::
                activeLayersSel=[];
                convertSmatOBJ = app.activeDocument.activeLayers; 
                ////////// LOOP COM FOREACH:::::::::::::::::
                if(obj == 1){ comand= [{"_obj":"newPlacedLayer"}] }
                if(obj == 2){ comand= [{"_obj":"placedLayerConvertToLayers"}] }
                if(obj == 3){ comand= [{"_obj":"rasterizeLayer","_target":[{"_enum":"ordinal","_ref":"layer","_value":"targetEnum"}]}] }
                
                convertSmatOBJ.forEach(sLayers  => { 
                    activeLayersSel.push(sLayers.name);
                    app.batchPlay([{"_obj":"select","_target":[{"_name":sLayers.name,"_ref":"layer"}]}] );
                    app.batchPlay(comand);
                }) ;
    
                activeLayersSel.forEach(asLayer  => { 
                    app.batchPlay( [{"_obj":"select","_target":[{"_name":asLayer,"_ref":"layer"}], "selectionModifier":{"_enum":"selectionModifierType","_value":"addToSelection"}}]);
                }) ;
                app.batchPlay([{"_obj":"clearEvent","_target":[{"_property":"historyStates","_ref":"property"},{"_enum":"ordinal","_ref":"document","_value":"targetEnum"}]}]);
           });
    } catch (err) {alert(err) }
};


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
    document.querySelector("#Drname_btn2").addEventListener("click", () => {dlg.close('OK'); renomeiaCamadas();});
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
