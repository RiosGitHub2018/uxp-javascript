const action = require("photoshop").action;
const core = require("photoshop").core;
const app = window.require("photoshop").app;
const fs = require('uxp').storage.localFileSystem;
const shell=require("uxp").shell;
const Constants = require('photoshop').constants;
const alert = app.showAlert;
const os = require('os') ;
const Usuario = os.homedir().replace(/\\/g, '/');



	try {
				// Array de itens inicial
				const arrayItens = [
					{ legenda: "Legenda 1", color: "red" },
					{ legenda: "Legenda 2", color: "green" },
					{ legenda: "Legenda 3", color: "blue" },
				];
	
				// Elementos do DOM
				const select = document.getElementById('dynamicSelect'); // Seleciona a lista (select) do HTML
				const legendaInput = document.getElementById('legendaInput'); // Entrada de texto para legenda
				const colorInput = document.getElementById('colorInput'); // Entrada de texto para cor
				const separador = '-'; // Separador utilizado
	
				// Função para preencher a lista select com os itens do array
				function carregarLista() {
						select.innerHTML = ''; // Limpa o conteúdo atual da lista
						for (const item of arrayItens) {
							const option = document.createElement('option');
							option.textContent = item.legenda;
	  				    	select.appendChild(option);
						}
				}
	
				// Função para adicionar um novo item ao array
				function adicionarItem() {
				// Obtém valores da entrada de legenda e cor
				const legenda = document.getElementById('legendaInput').value;
				const color = document.getElementById('colorInput').value;
	
				// Verifica se a legenda já existe na lista
				const legendaExiste = arrayItens.some(item => item.legenda === legenda);
	
				// Se a legenda não existir, não for vazia e a cor não for vazia
				if (!legendaExiste && legenda && color) {
						if (arrayItens.length === 3) { // Se o tamanho do array for 3
							arrayItens.push({ legenda: separador, color: separador }); // Adiciona separador
						}
						arrayItens.push({ legenda, color }); // Adiciona o novo item
						carregarLista(); // Atualiza a lista
						select.selectedIndex = arrayItens.length - 1; // Seleciona o novo item na lista
						atualizarInputs(); // Atualiza as entradas de legenda e cor
						salvarLocalStorage(); // Salva no localStorage
					} 
					else {
						alert('Esse item já existe na lista ou os campos estão vazios!'); // Exibe alerta se a legenda já existe ou os campos estão vazios
					}
				}
	
				// Função para remover o item selecionado na lista
				function removerItem() {
						const selectedIndex = select.selectedIndex; // Obtém o índice do item selecionado
						if (document.getElementById('dynamicSelect').selectedIndex < 4) {
							alert("Esse item não pode ser removido!"); // Alerta se o item não puder ser removido
							return;
						}
						if (selectedIndex >= 0 && selectedIndex < arrayItens.length) {
						const removedItem = arrayItens.splice(selectedIndex, 1)[0]; // Remove o item do array

						// Verifica se a lista tem 5 itens e remove o separador, se necessário
						if (arrayItens.length === 4 && arrayItens[3].legenda === separador) {
								arrayItens.splice(3, 1); /// remove 1 elemento (o elemento na posição 3) do array arrayItens
						}

						carregarLista(); // Atualiza a lista
						if (arrayItens.length > 0) {
							select.selectedIndex = arrayItens.length-1; // Seleciona o último item na lista
							atualizarInputs(); // Atualiza as entradas de legenda e cor
						} else {
							legendaInput.value = ''; // Limpa a entrada de legenda
							colorInput.value = ''; // Limpa a entrada de cor
						}
						salvarLocalStorage(); // Salva no localStorage
						}
				}
	
				// Função para editar o item selecionado na lista
				function editarItem() {
					const selectedIndex = select.selectedIndex; // Obtém o índice do item selecionado
					const legenda = legendaInput.value; // Obtém a nova legenda
					const color = colorInput.value; // Obtém a nova cor
					if (legenda && color) { // Se a legenda e a cor não estiverem vazias
							arrayItens[selectedIndex] = { legenda, color }; // Atualiza o item selecionado no array
							carregarLista(); // Atualiza a lista
							select.selectedIndex = selectedIndex; // Mantém o item selecionado
							salvarLocalStorage(); // Salva no localStorage
						}
				}
	
				// Array com os valores iniciais
				const valoresIniciais = [
						{ legenda: "Legenda 1", color: "red" },
						{ legenda: "Legenda 2", color: "green" },
						{ legenda: "Legenda 3", color: "blue" },
				];
	
				// Função para resetar a lista para os valores iniciais
				function resetarLista() {
						arrayItens.length = 0; // Limpa o array atual
						valoresIniciais.forEach(item => arrayItens.push(item)); // Adiciona os valores iniciais de volta ao array
						carregarLista(); // Atualiza a lista
						select.selectedIndex = arrayItens.length-1 // Seleciona o último item na lista
						atualizarInputs(); // Atualiza as entradas de legenda e cor
						salvarLocalStorage(); // Salva no localStorage
				}
	
				// Função para atualizar as entradas de legenda e cor com base no item selecionado
				function atualizarInputs() {
					const selectedIndex = select.selectedIndex; // Obtém o índice do item selecionado
					if (selectedIndex >= 0 && selectedIndex < arrayItens.length) {
						const selectedItem = arrayItens[selectedIndex]; // Obtém o item selecionado
						legendaInput.value = selectedItem.legenda; // Atualiza a entrada de legenda
						colorInput.value = selectedItem.color; // Atualiza a entrada de cor
					}
					mostrarValoresSelecionados();
				}
	
				// Adiciona evento para atualizar as entradas quando um item é alterado na lista
				select.addEventListener('change', atualizarInputs);
	
				// Função para salvar arrayItens no localStorage
				function salvarLocalStorage() {
				localStorage.setItem('arrayItens', JSON.stringify(arrayItens)); // Salva o array no localStorage como string JSON
				}
	
				// Função para carregar dados do localStorage, se existirem
				function carregarLocalStorage() {
					try {
						const savedItems = localStorage.getItem('arrayItens'); // Obtém os itens salvos do localStorage
						if (savedItems) {
							const parsedItems = JSON.parse(savedItems); // Converte os itens de volta para o formato de array
							arrayItens.length = 0; // Limpa o array original
							//parsedItems.forEach(item => arrayItens.push(item)); // Adiciona os itens do localStorage de volta ao array
							//for (const item of parsedItems) {arrayItens.push(item)}
							// Usando for:
							for (let i = 0; i < parsedItems.length; i++) {arrayItens.push(parsedItems[i]);} // Adiciona os itens do localStorage de volta ao array (loop for)
						} 
						else {
							arrayItens.length = 0; // Limpa o array atual
							// Se não houver itens no localStorage, carrega os valores iniciais
							valoresIniciais.forEach(item => arrayItens.push(item));
							salvarLocalStorage(); // Salva os valores iniciais no localStorage
						}
						carregarLista(); // Atualiza a lista
						select.selectedIndex = (arrayItens.length - 1).toString(); // Seleciona o último item na lista
						atualizarInputs(); // Atualiza as entradas de legenda e cor
					} catch (err) {alert(err) }
				}
	
				// Função para exibir valores das chaves ao selecionar um item na lista
				function mostrarValoresSelecionados() {
					const selectedIndex = select.selectedIndex; // Obtém o índice do item selecionado
					const selectedItem = arrayItens[selectedIndex]; // Obtém o item selecionado
					if (selectedItem) {
						//alert(`Legenda: ${selectedItem.legenda}, Color: ${selectedItem.color}`); // Exibe alerta com os valores da legenda e cor
					}
				}
		
				// Carrega dados do localStorage quando a página é carregada
				carregarLocalStorage();
		
				document.querySelector("#adicionarItem").addEventListener('click', adicionarItem)
				document.querySelector("#removerItem").addEventListener('click', removerItem)
				document.querySelector("#editarItem").addEventListener('click', editarItem)
				document.querySelector("#resetarLista").addEventListener('click', resetarLista)
		
}
catch (err) {alert(err)}

