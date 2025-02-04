    ////////// OBTEM LISTA DE CONJUTOS E AÇÕES
    async function carregarActiosLists(){
        getActionSet2 = require('photoshop').app.actionTree;
        ActionSet = document.getElementById("list_AS2");
        ActionList = document.getElementById("list_AC2");  
        // Preencher o seletor de ações
        for (let i = 0; i < getActionSet2.length; i++) {
            ActionSet.insertAdjacentHTML("beforeend", `<option>${getActionSet2[i].name}</option>`);
        }
        // Função para carregar os itens da ação
        function loadActionItems(selectedIndex) {
            ActionList.innerHTML = "";
            const selectedAction = getActionSet2[selectedIndex];
            for (let i = 0; i < selectedAction.actions.length; i++) {
            ActionList.insertAdjacentHTML("beforeend", `<option>${selectedAction.actions[i].name}</option>`);
             }
        };
         // Event listener para detectar mudanças na seleção de ações
        ActionSet.addEventListener("change", evt => {
            const selectedIndex = evt.target.selectedIndex; loadActionItems(selectedIndex);
        });
        // Carregar itens da primeira ação por padrão
        loadActionItems(0);  
        ActionSet.selectedIndex = 0;
        ActionList.selectedIndex = 51;
    };