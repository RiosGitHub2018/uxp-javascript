const array = [
  {nome:"Maria", idade:"20 anos"},
  {nome:"Jonas", idade:"10 anos"},
  {nome:"Pedro", idade:"70 anos"},
  {nome:"João",  idade:"18 anos"},
];

///PERCORRE TODOS O ITENS DO ARRAY
 array.forEach((element, index) => {
    console.log(element);
}); 

///ACESSANDO APENA PROPRIEDADES ESPECÍFICAS
 array.forEach((element, index) => {
  if(index === 1) {
    console.log(element.nome ,element.idade);
  }
}); 

////LISTA TODAS O NOMES DE UMA PROPRIEDADE ESPECÍFICA  DE UM ITEM NO ARRAY DE OBJ
conteudo = array.map(function(itemList){return itemList.nome}); 
console.log(conteudo)
console.log(conteudo[0])