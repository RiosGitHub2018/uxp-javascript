const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

const pessoas = [
  { nome: 'João', idade: 25, profissao: 'Engenheiro' },
  { nome: 'Maria', idade: 30, profissao: 'Médica' },
  { nome: 'Pedro', idade: 35, profissao: 'Professor' },
  { nome: 'Mauricio', idade: 45, profissao: 'Laboratorista' },
  { nome: 'Mauro', idade: 46, profissao: 'Vendedor' },
  { nome: 'Miguelzim', idade: 43, profissao: 'Vigilante' },
  { nome: 'Shulipa', idade: 16, profissao: 'Estudante' },
  { nome: 'Deusa', idade: 68, profissao: 'Aposentada' },
];

console.log(pessoas);
preencherTabela();

///// FUNÇÃO PARA PREENCHER A TABELA COM ESSES DADOS
function preencherTabela() {
    try {
      const tabela = document.querySelector('#tabela tbody');

      pessoas.forEach( (pessoa, indice) => {
          const linha = document.createElement('tr');
          const colunaNome = document.createElement('td');
          const colunaIdade = document.createElement('td');
          const colunaProfissao = document.createElement('td');

          colunaNome.textContent = pessoa.nome;
          colunaIdade.textContent = pessoa.idade;
          colunaProfissao.textContent = pessoa.profissao;

          linha.appendChild(colunaNome);
          linha.appendChild(colunaIdade);
          linha.appendChild(colunaProfissao);

          tabela.appendChild(linha);
      });
    } catch (err) {console.log(err) }
}

///// SELELECIONA A LINHA CLICADA
var table = document.getElementById("tabela");
var tblinhas = table.getElementsByTagName("tr");

for (var i = 0; i < tblinhas.length; i++) {
    var row = tblinhas[i];
    row.addEventListener("click", function(){
          var current = document.getElementsByClassName("selected");
          if (current.length > 0) { 
            current[0].className = current[0].className.replace(" selected", "");
          }
          this.className += " selected";

          indexLinha = Array.prototype.indexOf.call(tblinhas, this)-1;
          mostrarDados(indexLinha);
    });
}
  
///// EXIBE O CONTEUDO DA LINHA CLICADA
function mostrarDados(idx){
      try {
        coluna1 = pessoas.map(function (itemList) { return itemList.nome; })[idx];
        coluna2 = pessoas.map(function (itemList) { return itemList.idade; })[idx];
        coluna3 = pessoas.map(function (itemList) { return itemList.profissao; })[idx];
        alert( `Nome: ${coluna1}\nIdade: ${coluna2}\nProfissão: ${coluna3}` )
      } catch (err) { alert(err)}
}