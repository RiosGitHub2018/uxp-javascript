document.querySelector("#ms_func2").addEventListener("click", () => {
    dialogCropTools();
});

//////////////// ATALHOS CONFIGS  XXXXXXXXXXXXX
document.addEventListener('keydown', pluginsAtalhos);
async function pluginsAtalhos(event) {
if (event.keyCode == 115) {dialogCropTools();}
}

//////////CAIXA DE DIÁLOGO CONFIGS////////////XXXXXXXXXXX


async function dialogCropTools(){
D12CropToolEventos=true;
dlgD12 = document.querySelector("#dlgCropTool");
const response = dlgD12.show({ title: `PS-fxrios: CropTools`, resize: "both", size: { width: 180, height:200}})
dlgD12.innerHTML =`
<style>
    #dlgCropTool{
        display: flex;
        align-items: center;
    }
    .D12Container{
        width: 100%;
        height: 100%; 
        display: flex;
        flex-direction: column;
        align-items: center; 
        border:  1px solid rgb(65, 65, 65); 
        border-radius: 0 0 10px 10px;
        background-color: #5c5b5b;
    }
    .lista{
        width: 100%;
        display:none;
        flex-direction: column;
        margin: auto;
        align-items: center;
    }
    .lista_btns{
        width: 100%;
        flex-direction: column;
        margin: auto;
        align-items: center;
        border:  1px solid rgb(58, 58, 58); 
        border-radius: 0px; 
        padding: 2px; 
        background-color: #444343; 
        overflow-y: scroll; height: 125px;
        }
    .botoes{
        width: 100%;
        height: 25px;
        justify-content: center;
        font-family: Arial, Helvetica, sans-serif;
        color: rgb(212, 212, 212);
        font-size: 10px; 
        align-items: center; 
    }
    .btns{
        width: 200px;
        height: 15px; 
        color: rgb(224, 220, 220);
        text-align: left;
        font-size: 11px;
        padding-left: 5px ;
        display: flex;
    }
    .nomeDiv-btn{  width:75px; padding-left: 5px; margin-left: -3px;}
    .nomeDiv-btn:hover{	
         background-color: #313131;
         width: 100%; 
        border-left: 2px solid rgb(72, 104, 207); 
        transform: translateX(-2px);
    }

    .gerenciar-btn{
        cursor: pointer;
        padding: 2px; 
        border-radius: 1px;
        margin-left: 1px;
        background-color: #5c5b5b;
        width:18px;
        display:none;
        justify-content: center;
        font-family: UXPSfxIcon;
        color: rgb(212, 212, 212);
        font-size: 12px; 
        align-items: center; 
        border:  1px solid rgb(58, 58, 58); 
    }

    .gerenciar-btn:hover{ border:  1px solid rgb(155, 185, 151); }

     .btnAbaD12Sel{
        background: rgba(48,47,47,1); background: -moz-linear-gradient(left, rgba(48,47,47,1) 0%, rgb(165, 163, 163) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); background: -webkit-gradient(left top, right top, color-stop(0%, rgba(48,47,47,1)), color-stop(0%, rgba(117,117,117,1)), color-stop(0%, rgba(92,91,91,1)), color-stop(92%, rgba(92,91,91,1)), color-stop(97%, rgba(112,112,112,1)), color-stop(100%, rgba(48,47,47,1))); background: -webkit-linear-gradient(left, rgba(48,47,47,1) 0%, rgba(117,117,117,1) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); background: -o-linear-gradient(left, rgba(48,47,47,1) 0%, rgba(117,117,117,1) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); background: -ms-linear-gradient(left, rgba(48,47,47,1) 0%, rgba(117,117,117,1) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); background: linear-gradient(to right, rgba(48,47,47,1) 0%, rgba(117,117,117,1) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#302f2f', endColorstr='#302f2f', GradientType=1 );
        color: #cac8c8;
        border: 1px;
        height: 22px;
        line-height:22px; /*Alina o texto verticalmente*/
    }
    .btnAbaD12{
        outline: none;
        color: #d5d2d2;  
        text-align: center;
        font-family: Arial, sans-serif;
        font-size: 11px;
    }
    .btnAbaD12:hover{	
        color: #ffffff;  
    }
    .radiobtn_d12{
        margin: -5px;
    }
    .txtLabel{
        color: #f0efef;
        font-size: 11px;
        font-family: Arial, sans-serif;
        margin: 2px;
    }

    .D12elDesabilitado { 
        pointer-events: none; 
        color: #7c7c7c;
    }

    .impar { background-color: rgb(65, 63, 63); }
    .imparEdit{ 
        background-color: rgb(80, 104, 84);
     }

    .btnIconsB12 { 
        width:25px; 
        height:22px;
        color:#d5d2d2;
        font-family: UXPSfxIcon;
        font-size: 18px;
        text-align:center; /*Alina o texto horizontalmente*/
        line-height: 27px; /*Alina o texto verticalmente*/
        background-color: rgb(65, 63, 63); 
    }	

    .bgItemSel{ 
        background-color: #313131;
        width: 100%; 
        border-left: 2px solid rgb(72, 104, 207); 
        transform: translateX(-2px);
    }       

</style>

    <div  class="D12Container">
    <sp-checkbox  id="areaFocus" size="s" style="position: absolute; top: -50px;" ></sp-checkbox >
    <!-- ///////CONTEUDO DA ABA PRESETS -->
    <div style="width: 100%;display: flex;  display: flex; justify-content: left;  z-index: 100; background-color: #424242; align-items: center;">
        <div class="btnAbaD12 btnAbaD12Sel" style="width: 40%;">Presets</div>
        <div style="width: 1px; background-color: #1b1b1b;">.</div>
        <div class="btnAbaD12"  style="width: 40%; ">Gerenciar</div>
        <div style="width: 1px; background-color: #1b1b1b;">. </div>
    </div>
    <div class="contAbaD12"  style="width: 100%;  height: 202px; display: flex; flex-direction: column; padding: 10px;">
        
        <div style="height: 24px; display: flex;justify-content: center;">
            <input  type="text"  id="D12Busca" style="width:85%; height: 24px; padding: 4px; margin: -2px 0 4px 0;">
            <div id="btnGerir"  class="btnIconsB12"><</div>
        </div>
        <div  style="display: flex;"> <div class="lista_btns "class="botoes  largura"  id="container"> </div> </div>
        <div class="btnMedio" id="btnClose" style="width: 100%; margin-top: 10px;">Fechar janela</div>
    </div>
    <!-- ///////CONTEUDO DA ABA ADICIONAR -->
    <div class="contAbaD12"  style="width: 100%; height: 202px; display: flex; flex-direction: column;  display: none; padding: 10px; ">
        <div style="width: 100%; height: 100%; height: 149px; background-color: #525050; display: flex;  flex-direction: column; align-items: center; border:  1px solid rgb(58, 58, 58); ">
            <div style="width: 100%; display: flex; align-items: center; justify-content: center; transform: translateY(5px);">
                <label class="txtLabel"  style="font-size: 11px; margin-top: 5px;">Size</label>
                <select id="listSizeCrop" style="width:73%;  height: 25px; margin: 4px 0 0 0;">
                    <option selected>Inserir </option>
                    <option>Tela de Pintura</option>
                    <option>Seleção</option>
                </select>
             </div>

            <div style="width: 100%; height: 1px; background-color: #3d3c3c; transform: translateY(10px);">.</div>
            <div style="display: flex; flex-direction: column; padding: 5px; transform: translateY(10px);">
                <div style="width: 100%;display: flex; justify-content: flex-end ; align-items: center; margin: 1px;">
                    <label class="txtLabel" >Nome:</label>
                    <input  type="text"  id="D12et0" style="width:70px; height: 22px; padding: 4px; margin: 0 0 0 0;">
                    </div>
                <div style="width: 75%; height: 1px; background-color: #3d3c3c; margin: 5px; position: absolute;  left: 18px; top: 113px;">.</div>
                <div style="width: 100%;display: flex; justify-content: flex-end ; align-items: center; margin: 1px; transform: translateY(9px);">
                <label class="txtLabel" >largura:</label> 
                <input  type="text"  id="D12et1" style="width:70px; height: 22px; padding: 4px; margin: 0 0 0 0; ">
                </div>
                <div style="width: 100%;display: flex; justify-content: flex-end; align-items: center; margin: 1px; transform: translateY(9px);">
                <label class="txtLabel" >Altura:</label>
                <input  type="text"  id="D12et2" style="width:70px; height: 22px; padding: 4px; margin: 0 0 0 0;">
                </div>
            </div>
        </div>
        <div class="btnMedio" id="btnCortADD" style="width: 100%;  margin-top: 10px; justify-content: center;">Adicionar Preset</div>
        <div class="btnMedio" id="btnCortEDC" style="width: 100%;  margin-top: 10px; display: none;justify-content: center;">Salvar Valores</div>
       </div>
    </div>
    `;



    //////// NAVEGAÇÃO ABAS
    abasD12 = document.querySelectorAll('.contAbaD12');
    btnsD12 = document.querySelectorAll('.btnAbaD12');
    btnsD12.forEach((elementox, index) =>{
        elementox.addEventListener('click', function() {
            btnsD12.forEach((e) =>{ e.classList.remove('btnAbaD12Sel'); })
                this.classList.add('btnAbaD12Sel');
                focarInput("#D12Busca");
                abasD12.forEach((conteudo) =>{ conteudo.style.display = 'none';})
                abasD12[index].style.display = 'flex';
                if(index==1){presetsADDedit=true}
                else{presetsADDedit=false}
                btnEditarSalvarExibir(0)
                StatusUIInputs(0); 
                ferramentaTarget("moveTool");
                focarJanela();
              
            })
        })
        ///////////::::::::::::::::::::::::::::::::::::
        /////////CONFIGS RADIOS METODO
        D12_rds = document.querySelectorAll('.radiobtn_d12');
        D12_rds.forEach((radio, index )=> {     
            radio.addEventListener('click', function() {StatusUIInputs(index);})
        });

        D12et0 = document.querySelector('#D12et0');
        D12et1 = document.querySelector('#D12et1');
        D12et2 = document.querySelector('#D12et2');
        D12btn2 = document.querySelector('#btnCortADD');
        D12btn3 = document.querySelector('#btnCortEDC');
        D12btn4= document.querySelector('#btnGerir');
        D12btn5= document.querySelector('#btnClose');
        D12bList =document.querySelector('#listSizeCrop');
        
                   
        presetsConfig();
        obterDimensoesDoc();
        D12bList.addEventListener("change", ()=> {
            StatusUIInputs(D12bList.selectedIndex)
        });

        D12btn5.addEventListener('click',  () => {
           document.querySelector('#dlgCropTool').close(D12CropToolEventos=false);
        });

        focarInput();
        function focarInput(element) { document.querySelector("#D12Busca").focus(), 16 }
        setTimeout(focarInput, 100);
     };//////FECHAMENTO DA FUNÇÃO PRINPAL
     //////////////////////////////////////////////////

     
   ////////////FUNÇÕES JS AQUI!!!!!!!!!!!!!!!!!!!!!!!!!!
   async function presetsConfig() {
    try {
        const response = await fetch('suport/json/presetsCrop.json');
        const data = await response.json();

        const container = document.getElementById('container');
        const inputBusca = document.getElementById('D12Busca');
        let toggleSelItensListaDocs = false;

        ////// Função para criar botões e ordenar
        function criarBotoes(dados) {
            container.innerHTML = '';

            dados.presetCorte.sort((a, b) => {
                const [larguraA, alturaA] = a.nome.split(' x ').map(Number);
                const [larguraB, alturaB] = b.nome.split(' x ').map(Number);
                if (larguraA === larguraB) {  return alturaA - alturaB; }
                return larguraA - larguraB;
            });

            dados.presetCorte.forEach((item, index) => {
               botao = document.createElement('div');
                botao.classList.add("btns");
               if (index % 2 !== 0) { botao.classList.add('impar'); }
                const nomeDiv = document.createElement('div');
                nomeDiv.textContent = item.nome;
                nomeDiv.classList.add('nomeDiv-btn');
                botao.appendChild(nomeDiv);

                ////// METODO PARA EDITAR O ITEM SELECIONADO
                const editarDiv = document.createElement('div');
                editarDiv.textContent = ':';
                editarDiv.classList.add('gerenciar-btn');
                editarDiv.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    await editarItens(item);
                });
                botao.appendChild(editarDiv);

                function editarItens(item) {
                    try {
                        addItemStatus=false;
                        navegarAbas(1);
                        D12et0.value = item.nome.replace(/\s/g, "");
                        D12et1.value = item.largura;
                        D12et2.value = item.altura;
                        btnEditarSalvarExibir(1);
                      
                       D12btn3.addEventListener('click', async () => {
                            try {
                                 editarItemConfigs(); 
                            } catch (error) { alert(error); }
                        });

                     async function editarItemConfigs(){
                            validarEdicaoItem(data);
                            const indexOriginal = data.presetCorte.findIndex(preset => preset.nome === item.nome);
                             ///////SUBSTITUIR OS DADOS
                             toggleSelItensListaDocs = false
                             dados.presetCorte[indexOriginal] = { nome: `${D12et1.value} x ${D12et2.value}`,  largura: D12et1.value, altura: D12et2.value}; 
                             await atualizarDadosJson(dados.presetCorte);
                             criarBotoes(data);
                             btnEditarSalvarExibir(0);
                        };

                        focarInput("#D12et0");
                    } catch (error) {alert(error); }
                };



                ////////////////////////////////////////////////////////////////
                ////// METODO PARA REMOVER O ITEM SELECIONADO
                const deletarDiv = document.createElement('div');
                deletarDiv.textContent = 'M';
                deletarDiv.classList.add('gerenciar-btn');
                deletarDiv.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    // Remover item do array original e atualizar JSON
                    const indexOriginal = data.presetCorte.findIndex(preset => preset.nome === item.nome);
                    if (indexOriginal !== -1) {
                        toggleSelItensListaDocs = false
                        data.presetCorte.splice(indexOriginal, 1);
                        await atualizarDadosJson(data.presetCorte);
                        criarBotoes(data);
                    }
                });
                botao.appendChild(deletarDiv);

                ////// METODO PARA INSERIR OS VALORES PARA A FERRAMENTA DE CORTE
                botao.addEventListener('click', async () => {
                    document.querySelector('#dlgCropTool').close('OK');
                    await optionCropWH(parseFloat(item.largura), parseFloat(item.altura));
                });
                container.appendChild(botao);
            });

            //////// Adicionar event listener ao botão de mostrar/ocultar
            const btnGerenciar = document.querySelectorAll('.gerenciar-btn');
            if (toggleSelItensListaDocs) { btnGerenciar.forEach(elemento => { elemento.style.display = 'flex'; });  } 
            else { btnGerenciar.forEach(elemento => { elemento.style.display = 'none'; }); }


            configsAtalhoD12(dados.presetCorte)

        }

        inputBusca.addEventListener('input', () => {
            const textoBusca = inputBusca.value;
            const dadosFiltrados = { presetCorte: data.presetCorte.filter(item => item.nome.startsWith(textoBusca)) };
            criarBotoes(dadosFiltrados);
            ///////SELECIONAR O PRIMEIRO ITEM
            document.querySelectorAll(".nomeDiv-btn")[0].classList.add("bgItemSel");
       });

        salvarDadosJson(data.presetCorte); //////ATUALIZA DADOS JSON
        criarBotoes(data);

        /////////MOSTRAR OPÇÕES: EDITAR E REMOVER
        D12btn4.addEventListener('click', () => {
             toggleSelItensListaDocs = !toggleSelItensListaDocs;
            const  btnsx = document.querySelectorAll('.btns');
            const elementos = document.querySelectorAll('.gerenciar-btn');
            if (toggleSelItensListaDocs) { 
                elementos.forEach(elemento => {
                     elemento.style.display = 'flex'; 
                     document.querySelectorAll(".nomeDiv-btn")[0].classList.remove("bgItemSel");
                    }); 
                btnsx.forEach( (elemento2, index)=> { if (index % 2 !== 0) { 
                    elemento2.classList.add('imparEdit');
                 }}); 
                D12btn4.style.color="#b4e4a7";
            } 
            else {
                 elementos.forEach(elemento => { 
                    elemento.style.display = 'none'; 
                    document.querySelectorAll(".nomeDiv-btn")[0].classList.add("bgItemSel");
                 }); 
                 btnsx.forEach( (elemento2, index)=> { if (index % 2 !== 0) { 
                    elemento2.classList.remove('imparEdit');
                 }}); 
                 D12btn4.style.color="#d5d2d2";
                }
            focarInput("#D12Busca");
          
        });

        focarInput("#D12Busca");
        focarJanela();
        presetsADDedit=false;
         
        ///////SELECIONAR O PRIMEIRO ITEM
        document.querySelectorAll(".nomeDiv-btn")[0].classList.add("bgItemSel");
 
        /////////:::::::::::::::::::
       } catch (error) {}
    }

  

    function btnEditarSalvarExibir(m){
        if(m==1){ D12btn2.style.display = 'none'; D12btn3.style.display = 'flex';}
        else{D12btn2.style.display = 'flex'; D12btn3.style.display = 'none';}
     };
    
    ///////////// METHODO PARA TRASNFERIR OS VLORE PARA A BARRA DE FERRAMENTA
    const batchPlay = require("photoshop").action.batchPlay;
    // GET TOOL OPTIONS
    async function getCurrentToolOptions () {
        const result=await batchPlay([{"_obj":"get","_target":[{"_property":"currentToolOptions"},{"_ref":"application","_enum":"ordinal","_value":"targetEnum"}],"_options":{"dialogOptions":"dontDisplay"}}],{"synchronousExecution":false});
        return result[0].currentToolOptions;
    };
    
    // SET TOOL OPTIONS
    async function setCurrentToolOptions(currenttooloptions) {
        const result = await batchPlay( [{"_obj":"set","_target":[{"_ref":"cropTool"}],"to":currenttooloptions}],{"synchronousExecution":false});
    };


    //////////VALIDADÇÃO DO INPUTS HTML
    function validarEdicaoItem(dados){
        try {
            parteA=  D12et0.value.split('x')[0];
            parteB=  D12et0.value.split('x')[1];
            nome = `${parteA} x ${parteB}`;
            largura = `${D12et1.value}`;
            altura = `${D12et2.value}`;
            /////// INSERIR NOVOS DADOS AO ARRAY
           const presetsExistents = dados.presetCorte.map(itemList => itemList.nome)
            if (presetsExistents.includes(nome)) {
                alertar("Esse preset já consta na lista, adicione outro nome!"); 
                return focarInput("#D12et1"); // Focar na caixa de texto
            }
            if (nome ===  "" || largura === "" || altura === "") {
                alertar("Adicione todos valores!");
                return focarInput("#D12et0"); // Focar na caixa de texto
            }
            navegarAbas(0);
        } catch (error) {alert(error)}
    }

    //////// ATULIZAR O ARQUIVO JSON
    async function atualizarDadosJson(presetCorte){
        try {
            const jsonData = JSON.stringify(presetCorte, null, 4); // Adiciona indentação de 4 espaços
            const tempFolder = await fs.getEntryWithUrl(`${dirPlugin}/suport/json`);
            const fileBat = await tempFolder.createFile("presetsCrop.json", { overwrite: true });
            await fileBat.write(`{\n    "presetCorte": ${jsonData}\n}`);
            await presetsConfig(); // Atualiza a interface após salvar
            D12btn4.style.color="#d5d2d2";
        } catch (error) { alert(error); }
    };


    /////////////////////////////////////////////////////////////
    //////////////// ATALHOS CONFIGS  XXXXXXXXXXXXX
    function configsAtalhoD12(presetCorte) {
        atLargura = presetCorte[0].largura
        ataltura= presetCorte[0].altura

        dlgD12.addEventListener("close", () => {
            document.removeEventListener('keydown', atalhoSelItens);
        });
    
        document.addEventListener('keydown', atalhoSelItens);
        let currentIndex = 0;
    
        function atalhoSelItens(event) {
            if (event.keyCode === 40) { selPresetItensAth(1, presetCorte);} 
            else if (event.keyCode === 38) {selPresetItensAth(-1, presetCorte);}
        };
    
       async  function selPresetItensAth(ms, presetCorte) {
        try {
            var elements = document.querySelectorAll(".nomeDiv-btn");
            elements.forEach((element) => { element.classList.remove("bgItemSel"); });
            currentIndex += ms;// Atualiza o índice
            if (currentIndex < 0) {
                if (currentIndex > 0) {currentIndex = elements.length - 1;} else{currentIndex=0}
            } 
            else if (currentIndex >= elements.length) {currentIndex = 0;}
            elements[currentIndex].classList.add("bgItemSel");
            
            atLargura = presetCorte[currentIndex].largura
            ataltura= presetCorte[currentIndex].altura
            // await optionCropWH(parseFloat(atLargura), parseFloat(ataltura));
            } catch (error) {}
        };

        /////////REMOVER SELEÇÃO DO ITEM DA LISTA AO PASSAR O MOUSE
        document.getElementById('container').addEventListener('mouseover', () => {
        document.querySelectorAll(".nomeDiv-btn").forEach((btnItem, index) => {
             btnItem.classList.remove('bgItemSel'); 
            });
        });
        //////////////////XXXXXXXXXXXXXXXXXXXX
    };


    //////// SALVAR O ARQUIVO JSON
    addItemStatus=true
    async function salvarDadosJson(presetCorte){
        try {
            /////////// INSERIR ITEM POR ATALHO
            document.addEventListener("keydown", tecladoEvD12);
            async function tecladoEvD12(event) {
                if( D12CropToolEventos===false){return}
                if (event.keyCode === 13) {
                     try {
                        document.removeEventListener("keydown", tecladoEvD12); // Remove o event listener após o evento ter sido acionado
                        if(presetsADDedit !=true){
                            document.querySelector('#dlgCropTool').close('OK');
                            await optionCropWH(parseFloat(atLargura), parseFloat(ataltura));
                        }
                        else{addNovoItemNaLista()}
                     } catch (error) {alert(error)}
                };
            };
            ///////////:::::::::::

            /////////// INSERIR ITEM PELO BOTÃO 
            D12btn2.addEventListener('click', async () => {addNovoItemNaLista()  });
               async function addNovoItemNaLista(){
                    parteA=    D12et0.value.split('x')[0];
                    parteB=    D12et0.value.split('x')[1];
                    nome = `${parteA} x ${parteB}`;
                    largura = `${D12et1.value}`;
                    altura = `${D12et2.value}`;
                    /////// INSERIR NOVOS DADOS AO ARRAY
                    const presetsExistents = presetCorte.map(itemList => itemList.nome);
                    if (presetsExistents.includes(nome)) {
                        alertar("Esse preset já consta na lista, adicione outro nome!"); 
                        return focarInput("#D12et1"); // Focar na caixa de texto
                    }
                    if (nome ===  "" || largura === "" || altura === "") {
                        alertar("Adicione todos valores!");
                        return focarInput("#D12et0"); // Focar na caixa de texto
                    }
        
                    presetCorte.push({ nome, largura, altura });
                    navegarAbas(0);
                    const jsonData = JSON.stringify(presetCorte, null, 4); // Adiciona indentação de 4 espaços
                    const tempFolder = await fs.getEntryWithUrl(`${dirPlugin}/suport/json`);
                    const fileBat = await tempFolder.createFile("presetsCrop.json", { overwrite: true });
                    await fileBat.write(`{\n    "presetCorte": ${jsonData}\n}`);
                    await presetsConfig();
                    //////RETORNAR PARA A ABA PRESETS
                    navegarAbas(0);
                };
        } catch (error) {alert(error);}
    }

    ////////NAVEGAÇÃO DE ABAS
    function navegarAbas(a){
        abasD12.forEach((conteudo) => { conteudo.style.display = 'none'; });
        abasD12[a].style.display = 'flex';
        btnsD12.forEach((e) => { e.classList.remove('btnAbaD12Sel'); });
        btnsD12[a].classList.add('btnAbaD12Sel');
    }

    //////////OBTER AS DIMENÕES DO DOCUMENTO ATIVO
    async function obterDimensoesDoc(){
        resolucao= app.activeDocument.resolution;
        let Dw = Number(app.activeDocument.width*2.54/resolucao).toFixed(1);
        let Dh = Number(app.activeDocument.height*2.54/resolucao).toFixed(1);

        let hContentPontoZero= Dh.includes('.0');
        let wContentPontoZero= Dw.includes('.0');
        if(hContentPontoZero){ hsDoc = Dh.replace(/\.0/g, '') } else{ hsDoc = Dh }
        if(wContentPontoZero){ wsDoc = Dw.replace(/\.0/g, '') } else{ wsDoc = Dw }

        if(wsDoc > hsDoc){ tamanho=`${hsDoc}x${wsDoc}`}
        else{ tamanho=`${wsDoc}x${hsDoc}`}
    }

    ////////OBTER LARGURA/ALTURA DA ÁREA SELECIONADA
    async function obterSelecaoDoc(){
        await core.executeAsModal( async() => {
           if(app.activeDocument.selection.bounds===null){alertar("Você não criou a Seleção!");return}
            const result = await app.batchPlay( [ {_obj: 'get', _target: [{ _property: 'selection' }, { _ref: "document", _enum: "ordinal", _value: "targetEnum" } ] }], { synchronousExecution: false, });
            const left  = result[0].selection.left._value; 
            const right = result[0].selection.right._value;
            const botn = result[0].selection.bottom._value;
            const top   = result[0].selection.top._value; 
            const wsDocSel = parseFloat(right-left)*2.54/resolucao;
            const hsDocSel = parseFloat(botn-top)*2.54/resolucao
            const wsDocS = wsDocSel.toFixed(1);
            const hsDocS = hsDocSel.toFixed(1);
            inputsConfig(false, wsDocS, hsDocS, `${wsDocS}x${hsDocS}`)
         });
    };

     //////// MÉTODO PARA INSERIR VLORES AOS INPUTS
     async function StatusUIInputs(method){
        switch (method) {
        case 0: 
            inputsConfig(false, "","", "");  focarInput("#D12et0");
            document.querySelector('#btnCortADD').classList.remove("D12elDesabilitado");
            break;
        case 1: 
            if(app.documents.length===0){
                    inputsConfig(true, null, null);
                    document.querySelector('#btnCortADD').classList.add("D12elDesabilitado");
                }
            else{ inputsConfig(false, wsDoc, hsDoc, `${wsDoc}x${hsDoc}`) };    
            break;
            case 2:  obterSelecaoDoc(); break;
        };
   };

   function inputsConfig(pr, w, h,n){
        document.querySelector('#D12et0').value=n;
        document.querySelector('#D12et1').value=w;
        document.querySelector('#D12et2').value=h;
        document.querySelector('#D12et0').disabled = pr
        document.querySelector('#D12et1').disabled = pr
        document.querySelector('#D12et2').disabled = pr
    };

     //////// FOCA NA CAIXA DE TEXTO E HABILITA ATALHOS DO TECLADO
    function focarInput(element) { document.querySelector(element).focus(), 16 }
    setTimeout(focarInput, 100);


    async function optionCropWH(largura, altura) {
        try {
            await core.executeAsModal( async() => {
                 await app.batchPlay( [{"_obj":"select","_target":[{"_ref":"moveTool"}]}], { synchronousExecution: false, });
                await app.batchPlay( [{"_obj":"select","_target":[{"_name":"10 x 15","_ref":"toolPreset"}]}]);
                  let inputs = await getCurrentToolOptions();
                inputs.$CrpO.$CrWV = largura;
                inputs.$CrpO.$CrHV= altura;
                await setCurrentToolOptions(inputs);  
                await app.batchPlay( [{"_obj":"select","_target":[{"_ref":"cropTool"}]}], { synchronousExecution: false, });
            });
        } catch (error) {alert(error); console.log(error)}
    };
    //////////:::::::::::::::::::::::::::
    ///////////////////////////////////











    
// document.querySelector("#ms_func2").addEventListener("click", () => {
//         dialogCropTools();
//     });

// //////////////// ATALHOS CONFIGS  XXXXXXXXXXXXX
// document.addEventListener('keydown', pluginsAtalhos);
// async function pluginsAtalhos(event) {
//     if (event.keyCode == 115) {dialogCropTools();}
// }
  
//  //////////CAIXA DE DIÁLOGO CONFIGS////////////XXXXXXXXXXX

  

  
//  async function dialogCropTools(){
//     D12CropToolEventos=true;
//     dlgD12 = document.querySelector("#dlgCropTool");
//     const response = dlgD12.show({ title: `PS-fxrios: CropTools`, resize: "both", size: { width: 220, height:400}})
//     dlgD12.innerHTML =`
//     <style>
//         #dlgCropTool{
//             display: flex;
//             align-items: center;
//         }
//         .D12Container{
//             width: 100%;
//             height: 100%; 
//             display: flex;
//             flex-direction: column;
//             align-items: center; 
//             border:  1px solid rgb(65, 65, 65); 
//             border-radius: 0 0 10px 10px;
//             background-color: #5c5b5b;
//         }
//         .lista{
//             width: 100%;
//             display:none;
//             flex-direction: column;
//             margin: auto;
//             align-items: center;
//         }
//         .lista_btns{
//             width: 100%;
//             flex-direction: column;
//             margin: auto;
//             align-items: center;
//             border:  1px solid rgb(58, 58, 58); 
//             border-radius: 0px; 
//             padding: 2px; 
//             background-color: #444343; 
//             overflow-y: scroll; height: 125px;
//             }
//         .botoes{
//             width: 100%;
//             height: 25px;
//             justify-content: center;
//             font-family: Arial, Helvetica, sans-serif;
//             color: rgb(212, 212, 212);
//             font-size: 10px; 
//             align-items: center; 
//         }
//         .btns{
//             width: 200px;
//             height: 20px; 
//             color: rgb(224, 220, 220);
//             text-align: left;
//             font-size: 12px;
//             padding-left: 5px ;
//             display: flex;
//             line-height: 20px;
//         }
//         .nomeDiv-btn{  width:75px; padding-left: 5px; margin-left: -3px;}
//         .nomeDiv-btn:hover{	
//              background-color: #313131;
//              width: 100%; 
//             border-left: 2px solid rgb(72, 104, 207); 
//             transform: translateX(-2px);
//         }

//         .gerenciar-btn{
//             cursor: pointer;
//             padding: 2px; 
//             border-radius: 1px;
//             margin-left: 1px;
//             background-color: #5c5b5b;
//             width:18px;
//             display:none;
//             justify-content: center;
//             font-family: UXPSfxIcon;
//             color: rgb(212, 212, 212);
//             font-size: 15px; 
//             align-items: center; 
//             border:  1px solid rgb(58, 58, 58); 
//         }

//         .gerenciar-btn:hover{ border:  1px solid rgb(155, 185, 151); }

//          .btnAbaD12Sel{
//             background: rgba(48,47,47,1); background: -moz-linear-gradient(left, rgba(48,47,47,1) 0%, rgb(165, 163, 163) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); background: -webkit-gradient(left top, right top, color-stop(0%, rgba(48,47,47,1)), color-stop(0%, rgba(117,117,117,1)), color-stop(0%, rgba(92,91,91,1)), color-stop(92%, rgba(92,91,91,1)), color-stop(97%, rgba(112,112,112,1)), color-stop(100%, rgba(48,47,47,1))); background: -webkit-linear-gradient(left, rgba(48,47,47,1) 0%, rgba(117,117,117,1) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); background: -o-linear-gradient(left, rgba(48,47,47,1) 0%, rgba(117,117,117,1) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); background: -ms-linear-gradient(left, rgba(48,47,47,1) 0%, rgba(117,117,117,1) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); background: linear-gradient(to right, rgba(48,47,47,1) 0%, rgba(117,117,117,1) 0%, rgba(92,91,91,1) 0%, rgba(92,91,91,1) 92%, rgba(112,112,112,1) 97%, rgba(48,47,47,1) 100%); filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#302f2f', endColorstr='#302f2f', GradientType=1 );
//             color: #cac8c8;
//             border: 1px;
//             height: 22px;
//             line-height:22px; /*Alina o texto verticalmente*/
//         }
//         .btnAbaD12{
//             outline: none;
//             color: #d5d2d2;  
//             text-align: center;
//             font-family: Arial, sans-serif;
//             font-size: 11px;
//         }
//         .btnAbaD12:hover{	
//             color: #ffffff;  
//         }
//         .radiobtn_d12{
//             margin: -5px;
//         }
//         .txtLabel{
//             color: #f0efef;
//             font-size: 11px;
//             font-family: Arial, sans-serif;
//             margin: 2px;
//         }

//         .D12elDesabilitado { 
//             pointer-events: none; 
//             color: #7c7c7c;
//         }

//         .impar { background-color: rgb(65, 63, 63); }
//         .imparEdit{ 
//             background-color: rgb(80, 104, 84);
//          }

//         .btnIconsB12 { 
//             width:25px; 
//             height:22px;
//             color:#d5d2d2;
//             font-family: UXPSfxIcon;
//             font-size: 18px;
//             text-align:center; /*Alina o texto horizontalmente*/
//             line-height: 27px; /*Alina o texto verticalmente*/
//             background-color: rgb(65, 63, 63); 
//         }	

//         .bgItemSel{ 
//             background-color: #313131;
//             width: 100%; 
//             border-left: 2px solid rgb(72, 104, 207); 
//             transform: translateX(-2px);
//         }       

//     </style>

//         <div id="pn1"></div>
//         <div id="teste" style="width: 100%; display: flex; flex-direction: row; justify-content: center;">
//                  <div id="et1"></div>
//                  <h1 for="" id="texto" style="color: #ffffff;">0</h1>
//         </div>
//         <div id="pn2" style="transform: translateY(20px);"></div>
//         <div id="test2">
//             <div class="btnMedio" id="btn" style="width:90px; height: 19px; ">Alterar</div>
//             <div class= 'btnMedio' id='mye' style='width:90px; height: 19px;'>botão</div>
//         </div>

//         <div id="pn3" style="transform: translateY(40px);"></div>

//         <div id="contp3">
//         <div id="list1"></div>
//         <label id="texto2" style="color: #ffffff;"></label>
        
//         <!-- <input type="checkbox" id="c1" style="width: 2; height: 12px;">
//         <label for="c1"> I have a bike</label><br> -->



//         <label > <input type="radio" >Radio</label>
//         <!-- <label ><input type="checkbox">Checkbox</label> -->
//         <label for="check1">  <input type="checkbox" id="check1" >Box </label>

        

//         </div>

//         <div id="pn4" style="transform: translateY(40px);"></div>
//         <img src="../icons/trash-sharp.svg" style="width: 15%; height: auto; fill: red;" id="svg">


//     `;
       
//         // Instanciar o componente numberField
//         et1 = new e.numberField('#et1', {
//             width: '50px', height: '25px', value: 0,disabled: false,txtLabel: "Largura"
//         });

//         // Atualizar o valor no elemento texto ao mudar o input
//         es1.on('#et1 input[type="number"]', 'input', () => {
//             s1("#texto").textContent = et1.getValue(); // Obtenção via método do componente
//         });

//         // Instanciar o componente fieldsetfx e mover o conteúdo para dentro dele
//         pn1 = new e.fieldsetfx('#pn1', {
//             width: '190px',  // Largura
//             height: '50px',  // Altura
//             disabled: false,  // Se o fieldset está desabilitado
//             legend: "Legenda Painel ",  // Legenda do fieldset
//             conteudo: "teste", // ID do conteúdo a ser movido para o fieldset
//             bcground:""
//         });

//         // Instanciar o componente fieldsetfx e mover o conteúdo para dentro dele
//         pn2 = new e.fieldsetfx('#pn2', {
//             width: '190px',  // Largura
//             height: '70px',  // Altura
//             disabled: false,  // Se o fieldset está desabilitado
//             legend: "Legenda Painel 02",  // Legenda do fieldset
//             conteudo: "test2", // ID do conteúdo a ser movido para o fieldset
//             bcground:"#5a5959"
//         });


//         es1.on('#btn', 'click', () =>{et1.setValue(25)});

//         ///////// DROPDOWLIST

//         pn3 = new e.fieldsetfx('#pn3', {
//             width: '190px',  // Largura
//             height: '100px',  // Altura
//             disabled: true,  // Se o fieldset está desabilitado
//             legend: "DopdowList",  // Legenda do fieldset
//             conteudo: "contp3", // ID do conteúdo a ser movido para o fieldset
//             bcground:""
//         });

//         pn4 = new e.fieldsetfx('#pn4', {
//             width: '190px',  // Largura
//             height: '100px',  // Altura
//             disabled: true,  // Se o fieldset está desabilitado
//             legend: "Painel svg",  // Legenda do fieldset
//             conteudo: "svg", // ID do conteúdo a ser movido para o fieldset
//             bcground:""
//         });

//         // Criar os itens da lista
//         let itens_array = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

//         // Instanciar o componente dropdownList
//         let list1 = new e.dropdownList('#list1', {
//             width: '110px', 
//             height: '25px',  
//             legend: "Listax",  
//             itens: itens_array, 
//             indexSel: 1, //Item selecionado por padrão
//             onChange: function(selectedValue) {
//                 //alert(selectedValue); // Exibe o valor selecionado em um alert
//                 s1("#texto2").textContent = `Sel: ${selectedValue},  Index: ${list1.getSelectedIndex()}`; // Obtenção via método do componente
             
//             }
//         });

//         // Exemplo: Selecionar o terceiro item programaticamente
//         list1.setValue(3);
//         //alert(list1.getSelectedIndex()) // Exibe o index di item seleciondo
      
//         e.disabled('#pn1', false);
//         e.disabled('#pn2', false);
//         e.disabled('#pn4', true);
    
//     };//////FECHAMENTO DA FUNÇÃO PRINPAL
//          //////////////////////////////////////////////////


   
   