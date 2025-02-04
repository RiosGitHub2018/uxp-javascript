try{
		
const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;

alert("")
	
var nomes = [];
        var contadorID = 0;

        // Verifica se existem itens salvos no LocalStorage
        if (localStorage.getItem("nomes")) {
        // Se existirem, recupera os itens e atualiza a lista
        nomes = JSON.parse(localStorage.getItem("nomes"));
        atualizarListaNomes();
        }

        function adicionarNome() {
        var nomeInput = document.getElementById("nomeInput");
        var nome = nomeInput.value;

        if (nome !== "") {
            nomes.push({id: contadorID, nome: nome});
            contadorID++;
            nomeInput.value = "";
            atualizarListaNomes();
            salvarNoLocalStorage();
        }
        }

        function removerNome(index) {
        nomes.splice(index, 1);
        atualizarListaNomes();
        salvarNoLocalStorage();
        }

        function atualizarListaNomes() {
        var listaNomes = document.getElementById("listaNomes");
        listaNomes.innerHTML = "";

        for (var i = 0; i < nomes.length; i++) {
            var nome = nomes[i].nome;
            var id = nomes[i].id;

            var itemLista = document.createElement("li");
            itemLista.innerHTML = ` <label id="nome-${id}">${nome}</label> <button onclick="removerNome(${i})">Remover</button>
            `;

            listaNomes.appendChild(itemLista);
        }
        }
		
		
		document.getElementById("adicionar").addEventListener("click", function(){
			alert("Ola")
		}
		

        function salvarNoLocalStorage() {
        localStorage.setItem("nomes", JSON.stringify(nomes));
        }

        function exibirIDs() {
        for (var i = 0; i < nomes.length; i++) {
            var id = nomes[i].id;
            var label = document.getElementById(`nome-${id}`);
            alert(`ID do item "${label.innerText}": ${id}`);
        }
        }
	
	
	
	
	
}

catch(e){alert(e}