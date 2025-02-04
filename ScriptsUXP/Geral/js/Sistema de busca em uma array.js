var fruits = ["Apple", "Banana", "Orange"];
var filteredFruits = fruits.filter(function(fruit) {
  return fruit.charAt(0) === "A";
});

console.log(filteredFruits);