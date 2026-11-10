import { pokemones } from "./db/pokemones.js";

console.log(pokemones);

let bdPokemonesExistente = localStorage.getItem("pokemones");


if (bdPokemonesExistente === null) {
  let pokemonesJSON = JSON.stringify(pokemones);
  localStorage.setItem("pokemones", pokemonesJSON);
  console.log("Se ha creado la base de datos de pokemones en el localStorage");
} else {
  let PokemonesBD = localStorage.getItem("pokemones");
  console.log("BD de pokemones existente en el localStorage:");
}   

function leerPokemones() {
  let pokemonesJSON = localStorage.getItem("pokemones");
  const pokemones = JSON.parse(pokemonesJSON);
  return pokemones;
}











// const colegio1 = {
//     colegio: "Colegio Del Carmen",
//     curso: "FSD"
    
// }

// const colegio2 = {
//     colegio: "Colegio Webon",
//     curso: "FSDdwdef"
    
// }
// JSON.stringify(colegio1);

// localStorage.setItem("colegio-1", colegio1json);
// localStorage.setItem("colegio-2", colegio2);

// let colegio1Guardado = localStorage.getItem("colegio1");
// let colegio2Guardado = localStorage.getItem("colegio2");

// let colegio1Parseado = JSON.parse(colegio1Guardado);
// let colegio2Parseado = JSON.parse(colegio2Guardado);



// console.log(colegio1Parseado);
// console.log(colegio2Parseado);