///////// CONFIG ABAS "DIAGRAM+/SERVIÇOS"
const Tab1=document.querySelector("#btn-Tab1");
const Tab2=document.querySelector("#btn-Tab2");
const Tab3=document.querySelector("#btn-Tab3");
const Tab4=document.querySelector("#btn-Tab4");
Tab1.addEventListener("click", () => { abasDgm_Serv("flex", "none");}); 
Tab2.addEventListener("click", () => { abasDgm_Serv("none", "flex"); }); 

function abasDgm_Serv(m1, m2){
    document.querySelector("#Tab1").style.display = m1;
    document.querySelector("#Tab2").style.display = m2;  
}
///////// CONFIG ABAS "IMAGEM/FILTROS"
Tab3.addEventListener("click", () => { abasImg_Filter("flex", "none");}); 
Tab4.addEventListener("click", () => { abasImg_Filter("none", "flex"); });

function abasImg_Filter(m1, m2){
    document.querySelector("#Tab3").style.display = m1;
    document.querySelector("#Tab4").style.display = m2;  
}
///////:::::::::::::::::::::::::::::::

///////// CONFIG ACORDION MENUS"
function acordion_Check(m1, m2, m3){
    document.querySelector("#Acd-M1").style.display = m1;
    document.querySelector("#Acd-M2").style.display = m2;  
    document.querySelector("#Acd-M3").style.display = m3;  
}

const elementos = document.getElementsByClassName("btnAcordion");
const radioBtn = Array.from(elementos);
for(let i = 0; i < radioBtn.length; i++){ 
    radioBtn[i].addEventListener('click', (event) => {
    for(let i = 0; i < radioBtn.length; i++){  
        index = radioBtn.indexOf(event.currentTarget);
        radioBtn[i].classList.remove('selecionado');  
    }
    event.currentTarget.classList.add('selecionado');
    document.querySelector("#icon-acd1").classList.remove('selecionado');  
    document.querySelector("#icon-acd2").classList.remove('selecionado');  
    document.querySelector("#icon-acd3").classList.remove('selecionado');  

    if(index==0){ 
            acordion_Check("flex", "none", "none"); document.querySelector("#icon-acd1").classList.add('selecionado');
            icon_Check("#icon-acd1", "v");  icon_Check("#icon-acd2", "u"); icon_Check("#icon-acd3", "u");
    }
    if(index==1){
            acordion_Check("none", "flex", "none"); document.querySelector("#icon-acd2").classList.add('selecionado');
            icon_Check("#icon-acd2", "v");  icon_Check("#icon-acd1", "u"); icon_Check("#icon-acd0", "u");
            }
    if(index==2){ 
            acordion_Check("none", "none", "flex"); document.querySelector("#icon-acd3").classList.add('selecionado'); 
            icon_Check("#icon-acd3", "v");  icon_Check("#icon-acd2", "u"); icon_Check("#icon-acd1", "u");
            }
    })
}

function icon_Check(m1,m2){ document.querySelector(m1).textContent =m2;}
document.querySelector("#acord-OK").classList.add('selecionado'); 
document.querySelector("#icon-acd1").classList.add('selecionado');
icon_Check("#icon-acd1", "v");  icon_Check("#icon-acd2", "u"); icon_Check("#icon-acd3", "u");
///////:::::::::::::::::::::::::::::::

///////// CONFIG MENU AJUSTE DE IMAGEM
document.querySelector("#AMI-btn1").addEventListener("click", () => {
    document.querySelector("#mn-Ajuste").style.display = "flex";
}); 
document.querySelector("#AMI-btn2").addEventListener("click", () => {
    document.querySelector("#mn-AJCamadas").style.display = "flex";
}); 

document.querySelector("#btnImg-func16").addEventListener("click", () => {
    document.querySelector("#mn-Ajuste").style.display = "none";
}); 
document.querySelector("#btnImg-func22").addEventListener("click", () => {
    document.querySelector("#mn-AJCamadas").style.display = "none";
}); 
///////:::::::::::::::::::::::::::::::

//////////// DEPENDENCIAS PAINEL********************
try {
    destinoFont = "C:/Windows/Fonts"; ///`${Usuario}/AppData/Roaming/Adobe/Fonts`;
    fonteExistente() ////// VERIFICA SE AS DEPENDENCIAS JA ESTMA INSTALDAS
    /////////////:::::::::::::::::::::::::
    async function fonteExistente(){
            const folder = await fs.getEntryWithUrl(destinoFont);
            const files = await folder.getEntries();
            let fileExists = false;
            for (const file of files) {if (file.name === "UXPSfxIcon.ttf") { fileExists = true;  break; }}
        
            if (fileExists) {
                   ///// NÃO MOSTRAR O PAINEL DEMPENDENCIAS
                   document.querySelector(".container-Instal").style.display = "none"
            } else {
                   document.querySelector("#btn-Install").addEventListener("click", async () => {
                   document.getElementById("txtInstall").style.display = "flex"
                    await installFonteRegistro();
                  }); 
            }
    }
    
    async function installFonteRegistro(){
        await importDependences();
        const pluginFolder = await fs.getPluginFolder();  
        const fontInstal  = await pluginFolder.getEntry("suport/IconsSetup/IconsSetup.exe");
        //const fontInstal  = await pluginFolder.getEntry("suport/IconsSetup/IconsSetup.bat");
        await shell.openPath(fontInstal.nativePath);
        progressBarStart()
        setTimeout( async() => {
           document.querySelector(".container-Instal").style.display = "none"
           document.querySelector("#btn-Install").innerHTML="Refresh"
            await window.location.reload();
          }, 11000);
    };

     importDependences()
     ////////INSTALAR: SHAPES/PATHERN/BRUSHS/STYLLES
    async function importDependences() {
        const dependencias = [
            { nome: "Ps-fx Service", formato: "atn", referent: "actionSet" },
            { nome: "xmbcrios03",   formato: "csh", referent: "customShape"},
            { nome: "xmbcrios03",   formato: "asl", referent: "style" },
            { nome: "xmbcrios03",   formato: "abr", referent: "brush" },
            { nome: "xmbcrios03",   formato: "pat", referent: "pattern" }
        ];
        
        dependencias.forEach(async (arquivo ) => {
              try {
                    await core.executeAsModal(async () => {
                        const nome = arquivo.nome;
                        const formato = arquivo.formato;
                        const referent = arquivo.referent;
                        const pluginFolder = await fs.getPluginFolder();
                        const fileCarregar  = await pluginFolder.getEntry(`suport/${nome}.${formato}`);
                        const presetCrops = await pluginFolder.getEntry("suport/xmbcrios03.tpl");
                        const token = await fs.createSessionToken(presetCrops)
                        const ActionSetName = action.validateReference({_ref: referent, _name: fileCarregar.name.match(/(.*)\.[^\.]+$/)[1]})
                        if(ActionSetName == true){}
                        else{
                          app.open(fileCarregar);
                          await app.batchPlay( [{"_obj":"set","_target":[{"_property":"toolPreset","_ref":"property"},{"_enum":"ordinal","_ref":"application","_value":"targetEnum"}],"to":{"_kind":"local","_path":token}}]);
                     }
                  },{"interactive": true});
            } catch (err) {alert(err)}
            /////// CARREGAR PRESETS DE CORTE 'CROP'
            
        });
    };

function progressBarStart(){
    setTimeout(async () => {
        const progressBar = document.getElementById("progressBar");
        let width = 0;
        const intervalTime = 120; // Tempo de intervalo em milissegundos
        const totalTime = 12000;  // Tempo total da animação em milissegundos
        const increment = 1;     // Incremento percentual por intervalo
        // Configuração inicial
        progressBar.style.width = "0%";
        // Intervalo para aumentar a largura da barra de progresso
        const interval = setInterval(() => {
          width += increment;
          progressBar.style.width = `${width}%`;
          // Verifica se atingiu 100%
          if (width >= 70) {
            clearInterval(interval);
           // Por exemplo, você pode ocultar a div container-Instal após a conclusão
            setTimeout( async () => {}, 700); 
          }
        }, intervalTime);
      }, 0);
}



    //////// DETECTA EVENTOS DO PHTOSHOP
    // const eventos = ["move", "select", "open", "close", "delete", "show", "set"];
    // action.addNotificationListener(eventos, eventHandler);
    // function  eventHandler(){
    //        function focar() { document.querySelector("#pluginFocus").focus(), 16 }
    //        setTimeout(focar, 150);
    // }

} catch (err) {alert(err)}

