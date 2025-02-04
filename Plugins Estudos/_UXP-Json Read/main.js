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



////////// CARREGAR ARQUIVOS DA DA RAIZ DO PLUGIN)
async function pathPlugin() {
  const fs = require('uxp').storage.localFileSystem;  
  const folder = await fs.getPluginFolder(); 
  dirPlugin = folder.nativePath.replace(/\\/g, '/');
};





try {
   importar()
  async function importar(){
          await pathPlugin(); 
          const file =  await fs.getEntryWithUrl(`${dirPlugin}/json/presetsCrop.json`);
          const jsonString = await file.read();
          // Converter a string para um objeto JSON
          var objetoJSON = JSON.parse(jsonString);
        
          // Agora você pode acessar a propriedade "presetCorte"
          var conteudoOBJ = objetoJSON.presetCorte;
          // Exemplo de acesso aos dados
          // alert(conteudoOBJ[0].nome);    // Saída: "2 x 2"
          // alert(conteudoOBJ[1].largura); // Saída: "3"
          // alert(conteudoOBJ[2].altura);  // Saída: "7"

          const container = document.getElementById('container');
          const inputBusca = document.getElementById('inputBusca');


          // Função para criar botões
          criarBotoes(conteudoOBJ)
          function criarBotoes(itens){
              container.innerHTML = '';
              // Criar botões com base nos dados
              itens.sort((a, b) => {
                  const [larguraA, alturaA] = a.nome.split(' x ').map(Number);
                  const [larguraB, alturaB] = b.nome.split(' x ').map(Number);
                  if (larguraA === larguraB) {  return alturaA - alturaB; }
                  return larguraA - larguraB;
               });

              itens.forEach(item => {
                  const botao = document.createElement('div');
                  botao.textContent = item.nome;
                  botao.classList.add("btns")
                  botao.addEventListener('click', () => {
                  alert(`Nome: ${item.nome}\rlargura: ${item.largura}\rAltura: ${item.altura}`);
                  });
                  container.appendChild(botao);
              });
          };

        // Adicionar listener para input de busca
        inputBusca.addEventListener('input', () => {
          const textoBusca = inputBusca.value.toLowerCase();
          const resultadosFiltrados = conteudoOBJ.filter(item => item.nome.startsWith(textoBusca));
          criarBotoes(resultadosFiltrados);
        });

  
    };
} catch (error) {alert(error)}





// try {
//          fetch('dados.json')
//             .then(response => response.json())
//             .then((data) => {
//             const container = document.getElementById('container');
//             const inputBusca = document.getElementById('inputBusca');

//             // Função para criar botões
//             function criarBotoes(dados){
//                 // Limpar container
//                container.innerHTML = '';

//                 // Criar botões com base nos dados
//                 dados.presetCorte.forEach(item => {
//                     const botao = document.createElement('div');
//                     botao.textContent = item.nome;
//                     botao.classList.add("btns")
//                     botao.addEventListener('click', () => {
//                         alert(`Nome: ${item.nome}, largura: ${item.largura}, Altura: ${item.altura}`);
//                     });
//                     container.appendChild(botao);
//                 });
//             };

//             // Adicionar listener para input de busca
//             inputBusca.addEventListener('input', () => {
//                 const textoBusca = inputBusca.value.toLowerCase();
//                 const dadosFiltrados = {
//                     presetCorte: data.presetCorte.filter(item => item.nome.toLowerCase().includes(textoBusca))
//                 };
//                 criarBotoes(dadosFiltrados);
//             });

//             // Carregar botões inicialmente
//             criarBotoes(data);
//             })
  
// } catch (error) {alert(error) }



// fetch('dados.json')
//     .then(response => response.json())
//     .then((data) => {
//         const selectBotoes = document.getElementById('selectBotoes');
//         const inputBusca = document.getElementById('inputBusca');

//         // Função para criar as opções no select
//         function criarOpcoes(dados) {
//             // Limpar select
//             selectBotoes.innerHTML = '';

//             // Criar opções com base nos dados
//             dados.presetCorte.forEach(item => {
//                 const option = document.createElement('option');
//                 option.textContent = item.nome;
//                 option.value = JSON.stringify(item); // Armazenar objeto completo como valor
//                 selectBotoes.appendChild(option);
//             });
//         }

//         // Adicionar listener para input de busca
//         inputBusca.addEventListener('input', () => {
//             const textoBusca = inputBusca.value.toLowerCase();
//             const dadosFiltrados = {
//                 presetCorte: data.presetCorte.filter(item => item.nome.toLowerCase().includes(textoBusca))
//             };
//             criarOpcoes(dadosFiltrados);
//         });

//         // Adicionar listener para selecionar uma opção
//         selectBotoes.addEventListener('change', () => {
//             const selectedItem = JSON.parse(selectBotoes.value); // Converter JSON de volta para objeto
//             alert(`Nome: ${selectedItem.nome}, largura: ${selectedItem.largura}, Altura: ${selectedItem.altura}`);
//         });

//         // Carregar opções inicialmente
//         criarOpcoes(data);
//     })
//     .catch(error => console.error('Erro ao carregar dados:', error));