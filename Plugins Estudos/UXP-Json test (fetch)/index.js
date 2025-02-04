const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;



try {

         fetch('dados.json')
            .then(response => response.json())
            .then((data) => {
            const container = document.getElementById('container');
            const inputBusca = document.getElementById('inputBusca');

            // Função para criar botões
            function criarBotoes(dados){
                // Limpar container
               container.innerHTML = '';

                // Criar botões com base nos dados
                dados.presetCorte.forEach(item => {
                    const botao = document.createElement('div');
                    botao.textContent = item.nome;
                    botao.classList.add("btns")
                    botao.addEventListener('click', () => {
                        alert(`Nome: ${item.nome}, Idade: ${item.Idade}, Altura: ${item.altura}`);
                    });
                    container.appendChild(botao);
                });
            };

            // Adicionar listener para input de busca
            inputBusca.addEventListener('input', () => {
                const textoBusca = inputBusca.value.toLowerCase();
                const dadosFiltrados = {
                    presetCorte: data.presetCorte.filter(item => item.nome.toLowerCase().includes(textoBusca))
                };
                criarBotoes(dadosFiltrados);
            });

            // Carregar botões inicialmente
            criarBotoes(data);
            })
  
} catch (error) {console.log(error) }



fetch('dados.json')
    .then(response => response.json())
    .then((data) => {
        const selectBotoes = document.getElementById('selectBotoes');
        const inputBusca = document.getElementById('inputBusca');

        // Função para criar as opções no select
        function criarOpcoes(dados) {
            // Limpar select
            selectBotoes.innerHTML = '';

            // Criar opções com base nos dados
            dados.presetCorte.forEach(item => {
                const option = document.createElement('option');
                option.textContent = item.nome;
                option.value = JSON.stringify(item); // Armazenar objeto completo como valor
                selectBotoes.appendChild(option);
            });
        }

        // Adicionar listener para input de busca
        inputBusca.addEventListener('input', () => {
            const textoBusca = inputBusca.value.toLowerCase();
            const dadosFiltrados = {
                presetCorte: data.presetCorte.filter(item => item.nome.toLowerCase().includes(textoBusca))
            };
            criarOpcoes(dadosFiltrados);
        });

        // Adicionar listener para selecionar uma opção
        selectBotoes.addEventListener('change', () => {
            const selectedItem = JSON.parse(selectBotoes.value); // Converter JSON de volta para objeto
            alert(`Nome: ${selectedItem.nome}, Idade: ${selectedItem.Idade}, Altura: ${selectedItem.altura}`);
        });

        // Carregar opções inicialmente
        criarOpcoes(data);
    })
    .catch(error => console.error('Erro ao carregar dados:', error));