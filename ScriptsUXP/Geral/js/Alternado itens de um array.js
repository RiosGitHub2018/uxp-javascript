let testex = 0;
itens = [15,20,25,30];

alternarItens(testex, itens)


function alternarItens(element, atualIndice, itens){
    alert(atualIndice)
     var listaItens = itens
     var atualItem = listaItens[atualIndice];
    if (atualItem) {
      s1(element).value= listaItens[atualIndice]
        atualIndice = (atualIndice + 1) % listaItens.length;
    };
};
