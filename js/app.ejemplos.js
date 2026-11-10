import { pokemones } from "./db/pokemones.js";

// console.log(pokemones);
// console.log(pokemones[0]);
// console.log(pokemones[0].nombre);

// console.log(pokemones);
// console.log(pokemones[3]);
// console.log(pokemones[3].nombre);
let nombrePokemon = prompt("Buscar Pokémon por nombre: ");

for (let i = 0; i < pokemones.length; i++) {
  //   console.log(pokemones[i].nombre);

  if (pokemones[i].nombre === nombrePokemon) {
    console.log("¡Encontré a Pikachu!");
    console.log("Esta en la posicion: " + i);
  }
}
