import { creatureCatalog } from "./db/pokemones.js";

let requestedName = prompt("Buscar Pokémon por nombre: ");
for (let position = 0; position < creatureCatalog.length; position++) {
  if (creatureCatalog[position].nombre === requestedName) {
    console.log("¡Encontré a Pikachu!");
    console.log("Esta en la posicion: " + position);
  }
}
