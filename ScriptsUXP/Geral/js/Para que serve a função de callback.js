// Para sincronizar a execução das funções functionA e functionB, você pode usar o conceito de callbacks. Em vez de chamar diretamente a função functionB após a chamada da função functionA, você pode passar a função functionB como um callback para a função functionA, e a função functionA chamará o callback após concluir sua execução. Veja como ficaria o código modificado:

// scss
// Copy code
function functionA(callback) {
  function temp() {
    alert("Essa é a função A")
    callback();
  }
  setTimeout(temp, 1000);
}

function functionB() {
  alert("Essa é a função B")
}

functionA(functionB);
// Nesse código, a função functionA recebe um parâmetro callback, que deve ser uma função. A função temp é a função que será chamada após o timeout de 1000ms, e ela chama o callback passado como parâmetro. A função functionB é passada como callback para a função functionA, e ela será executada após a conclusão da função functionA.


