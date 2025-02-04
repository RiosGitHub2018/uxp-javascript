let currentIndex = 0; // Variável para armazenar o índice atual

// Adiciona um ouvinte de evento para capturar pressionamentos de tecla no documento
document.addEventListener('keydown', function(event) {
    // Verifica se a tecla pressionada é a tecla F4 (keyCode 115 ou key "F4")
    if (event.keyCode === 115 || event.key === "F4") {
        // Seleciona todos os elementos com a classe .edittxt
        var elements = document.querySelectorAll(".edittxt");

        // Obtém o elemento atual com base no índice atual
        var currentElement = elements[currentIndex];

        // Verifica se há um elemento atual selecionado
        if (currentElement) {
            // Exibe um alerta com o índice do elemento atual
            alert("Índice do elemento .edittxt: " + currentIndex);

            // Incrementa o índice para o próximo elemento na próxima vez que a tecla F4 for pressionada
            currentIndex = (currentIndex + 1) % elements.length;
        }
    }
});