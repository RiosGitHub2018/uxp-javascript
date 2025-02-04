let ultimoValor =  document.querySelector("#D11BdSize").value

function testando() {
    document.addEventListener('keydown', saveDocsKey);
       async function saveDocsKey(event) {
        if (event.keyCode === 39) {
            // Seleciona o elemento BordaSizec dentro da função de evento
            let BordaSizec = document.querySelector("#D11BdSize");
            // Define o valor inicial como o último valor aplicado
            BordaSizec.value = ultimoValor;
            // Incrementa o valor convertido para número
            BordaSizec.value = Number(BordaSizec.value) +1;
            // Atualiza o último valor
            ultimoValor = BordaSizec.value;
        }
    }
}

// Chama a função para iniciar o listener de eventos
testando();