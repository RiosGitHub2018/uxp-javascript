document.querySelector("#btnDoc-func1").addEventListener("click", () => {
    core.executeAsModal(async () => {docFunctions(1)});
 });
 document.querySelector("#btnDoc-func2").addEventListener("click", () => {
    core.executeAsModal(async () => {docFunctions(2)});
 });
 document.querySelector("#btnDoc-func3").addEventListener("click", () => {
    core.executeAsModal(async () => {docFunctions(3)});
 });
 document.querySelector("#btnDoc-func4").addEventListener("click", () => {
    core.executeAsModal(async () => {docFunctions(4)});
 });
 document.querySelector("#btnDoc-func5").addEventListener("click", () => {
    core.executeAsModal(async () => {addGuidSelect()});
 });
 document.querySelector("#btnDoc-func6").addEventListener("click", () => {
    core.executeAsModal(async () => {docFunctions(5)});
 });
 document.querySelector("#btnDoc-func7").addEventListener("click", () => {
    core.executeAsModal(async () => {docFunctions(6)});
 });
 document.querySelector("#btnDoc-func8").addEventListener("click", () => {
    core.executeAsModal(async () => {removeAllGuids()});
 });
 document.querySelector("#btnDoc-func9").addEventListener("click", () => {
    core.executeAsModal(async () => {funcsAllDocs(7)});
 });
 document.querySelector("#btnDoc-func10").addEventListener("click", () => {
    core.executeAsModal(async () => {/*abrirRecente()*/dlgRecentes()});
 });

///////FUNÕES AQUI! XXXXXXXXXXXXXX
function docFunctions(m){
    try {
        core.executeAsModal(async () => {
            if(m== 1){ command = [{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"toggleGrid"}]}];}
            if(m== 2){ command = [{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"toggleSmartGuides"}]}];}
            if(m== 3){ command = [{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"trim"}]}];}
            if(m== 4){ command = [{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"newGuide"}]}];}
            if(m== 5){ command = [{"_obj":"select","_target":[{"_enum":"menuItemType","_ref":"menuItemClass","_value":"newGuideLayout"}]}];}
            if(m== 6){ command = [{"_obj":"clearAllGuides"}]}
            if(m== 7){ command = [{"_obj":"close","forceNotify":true,"saving":{"_enum":"yesNo","_value":"no"}}];}
            app.batchPlay(command, {});
      });
    } catch (err) {alert(err)}
 }

 function funcsAllDocs(m){
    ImgConteudo = app.documents;
    for(i=0;i <ImgConteudo.length;i++){
        var doc = app.documents[i];   
        app.activeDocument = doc;  
        docFunctions(m)
    }
}

function removeAllGuids(){
    ImgConteudo = app.documents;
    for(i=0;i <ImgConteudo.length;i++){
        var doc = app.documents[i];   
        app.activeDocument = doc;  
        app.activeDocument.guides.removeAll();
    }
}

function addGuidSelect() {
    core.executeAsModal( async() => {
        const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'selection' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
        const left   = result[0].selection.left._value; 
        const right = result[0].selection.right._value;
        const botn = result[0].selection.bottom._value;
        const top   = result[0].selection.top._value; 
        app.activeDocument.guides.add(Constants.Direction.HORIZONTAL, botn);
        app.activeDocument.guides.add(Constants.Direction.HORIZONTAL, top);
        app.activeDocument.guides.add(Constants.Direction.VERTICAL, left);
        app.activeDocument.guides.add(Constants.Direction.VERTICAL, right);
    })
}


function ouvitesEventsFucs(){
      //// PROCESSAR MARCADOS
      document.querySelector("#Obter_valores").addEventListener("click", async evt => {
         await core.executeAsModal( async() => {	docsAcesso()})
      })


      var marcaTodos = document.querySelector("#checkAll");
      marcaTodos.addEventListener( 'change', function() {
         ckeckbox = document.querySelectorAll(".checkDocs")
         for (var i=0;i<ckeckbox.length ;i++){
            if(this.checked) {ckeckbox[i].checked=true;}else {ckeckbox[i].checked=false}
         }
      });

}////////ouvitesEventsFucs


 ////// CARREGAR JALELA PRINCIPAL
 async function dlgRecentes() {
   fetch('html/DLGrecentes.html').then(response => response.text()).then(data => {
   dlg = document.querySelector("#dlgImprimir");
   dlg.show({ title: `PS-fxrios: Open Recentes`, resize: "both", size: { width: 310, height:255}})
   dlg.innerHTML = data;
        abrirRecente()
       ////// TODOS OS addEventListener AQUI!
         ouvitesEventsFucs();
       ////===
   });
}


function abrirRecente(){
   docs = document.getElementById("layers");
   core.executeAsModal( async() => {
      const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'recentFileEntries' }, { _ref: "application", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
      recentes = result[0].recentFileEntries;
      if(recentes == undefined){
         docs.insertAdjacentHTML('beforeend', `<h2 style="color: #d5d2d2"> • Sem arquivos!</h2>`); 
         document.getElementById("checkAll").disabled = true;
      }
      else{
            for(i=0;i <recentes.length;i++){ 
               path = result[0].recentFileEntries[i].path
               const ultimaBarra = path.lastIndexOf("\\"); // Encontra a posição da última barra invertida
               const imagens = path.substring(ultimaBarra + 1);  // Usa a função substring para extrair o nome do arquivo com extensão
               docs.insertAdjacentHTML('beforeend', `<sp-checkbox size="s" size=s class = "checkDocs" id = ${encodeURI(path)}><label style="transform: translateX(-5px); font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #c2c2c2;">${imagens}</label></sp-checkbox >`); //  
               };
            }
      });
};

//// OBTER CHECKS MARCADOS
async function docsAcesso(){
      ckeckbox = document.getElementsByClassName("checkDocs");
      diretorios ="";
      for (var i=0;i<ckeckbox.length;i++){
            if(ckeckbox[i].checked ==true) {
               const diretorios  =ckeckbox[i].id;
               await core.executeAsModal( async() => {
               let Entrada =  await fs.getEntryWithUrl(diretorios);   
               let token = fs.createSessionToken(Entrada);
               await  app.batchPlay([{"_obj":"open","documentID":314,"dontRecord":false,"forceNotify":true,"null":{"_kind":"local","_path": token},"template":false}], {});
               });
            };
      };
};





