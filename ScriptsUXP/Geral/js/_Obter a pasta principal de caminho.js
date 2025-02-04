function diretorioPrincipal(caminhoCompleto) {
    // Utiliza uma expressão regular para encontrar o último diretório no caminho
    const match = caminhoCompleto.match(/\/([^\/]+)\/[^\/]+$/);
    // Se houver correspondência, remove o último diretório
    if (match) {
        caminhoCompleto = caminhoCompleto.replace(match[0], '');
    }
    return caminhoCompleto;
}

const caminhoCompleto = "C:/Users/Pichau/arquivo.txt";
const caminhoEncurtado = diretorioPrincipal(caminhoCompleto);
console.log(caminhoEncurtado); // Saída: C:/Users