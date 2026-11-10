import { pokemones } from "./db/pokemones.js";
import { usuarios } from "./db/usuarios.js";


// ==========================================
// ELEMENTO PRINCIPAL DE LA APLICACIÓN
// ==========================================

const app = document.querySelector("#app");

// ==========================================
// 1. LANDING
// ==========================================

// Estructura básica de la pantalla
const landing = `
  <section class="landing">
    <h1>Bienvenido a PokeApp</h1>
    <p>Explorá el mundo Pokémon.</p>
    <p>Elegí una opción del menú para comenzar.</p>
  </section>
`;

// Función para cargar los elementos dinámicos
function cargarLanding() {
  console.log("Landing cargado");
}

// Evento del logo
const logo = document.querySelector(".header-logo img");

logo.addEventListener("click", function () {
  app.innerHTML = landing;

  cargarLanding();
});

// ==========================================
// 2. POKÉDEX
// ==========================================

// Estructura básica de la pantalla
const pokedex = `
  <section class="pokedex-section">
    <h1>Pokédex</h1>

    <div id="pokedex-gallery" class="pokedex-gallery"></div>
  </section>
`;

// Función para cargar los elementos dinámicos
function cargarPokedex() {
  const pokedexGallery = document.querySelector("#pokedex-gallery");

  for (let pokemon of pokemones) {
    pokedexGallery.innerHTML += `
      <article class="pokemon-card">

        <div class="pokemon-image">
          <img 
            src="${pokemon.imagen}" 
            alt="${pokemon.nombre}"
          />
        </div>

        <div class="pokemon-info">

          <span class="pokemon-id">
            N.º ${pokemon.id}
          </span>

          <h2>${pokemon.nombre}</h2>

          <div class="pokemon-types">
            <span class="type type-${pokemon.tipo[0].toLowerCase()}">
              ${pokemon.tipo[0]}
            </span>
          </div>

          <p class="pokemon-rareza">
            ${pokemon.rareza}
          </p>

          <button class="btn-detalle" data-id="${pokemon.id}">
            Ver detalles
          </button>

        </div>

      </article>
    `;
  }
}

// Evento del botón Pokédex
const botonPokedex = document.querySelector("#link-pokedex");

botonPokedex.addEventListener("click", function (event) {
  event.preventDefault();

  app.innerHTML = pokedex;

  cargarPokedex();
});

// ==========================================
// 3. INICIAR SESIÓN
// ==========================================

// Estructura básica de la pantalla
const login = `
  <section class="login-section">

    <h1>Iniciar sesión</h1>

    <form id="form-login">

      <label for="username">
        Usuario
      </label>

      <input 
        type="text" 
        id="username"
      />

      <label for="password">
        Contraseña
      </label>

      <input 
        type="password" 
        id="password"
      />

      <button type="submit">
        Ingresar
      </button>

    </form>

  </section>
`;

// Función para cargar los elementos dinámicos
function cargarLogin() {
  console.log("Formulario de inicio de sesión cargado");
}

// Evento del botón Iniciar sesión
const botonLogin = document.querySelector("#link-login");

botonLogin.addEventListener("click", function (event) {
  event.preventDefault();

  app.innerHTML = login;

  cargarLogin();

  const formularioLogin = document.querySelector("#form-login");

formularioLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
let encontrado = false;
  for (const usuario of usuarios) {
    if (usuario.username === username && usuario.password === password) {
     alert(`Bienvenido, ${usuario.nombre}!`);
     encontrado = true;
     break;
    } else {
     encontrado = false;
    }
  }
  if (!encontrado) {
    alert("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
  }
});
});

// ==========================================
// 4. REGISTRO
// ==========================================

// Estructura básica de la pantalla
const registro = `
  <section class="registro-section">

    <h1>Registrarse</h1>

    <form id="form-registro">

      <label for="nombre">
        Nombre
      </label>

      <input 
        type="text" 
        id="nombre"
      />

      <label for="email">
        Email
      </label>

      <input 
        type="email" 
        id="email"
      />

      <label for="nuevo-username">
        Usuario
      </label>

      <input 
        type="text" 
        id="nuevo-username"
      />

      <label for="nueva-password">
        Contraseña
      </label>

      <input 
        type="password" 
        id="nueva-password"
      />

      <button type="submit">
        Registrarse
      </button>

    </form>

  </section>
`;

// Función para cargar los elementos dinámicos
function cargarRegistro() {
  console.log("Formulario de registro cargado");
}

// Evento del botón Registrarse
const botonRegistro = document.querySelector("#link-registro");

botonRegistro.addEventListener("click", function (event) {
  event.preventDefault();

  app.innerHTML = registro;

  cargarRegistro();
});

// ==========================================
// 5. BATALLA
// ==========================================

// Estructura básica de la pantalla
const batalla = `
  <section class="batalla-section">

    <h1>Batalla Pokémon</h1>

    <p>
      Elegí tu Pokémon para comenzar.
    </p>

    <button id="btn-comenzar-batalla">
      Comenzar batalla
    </button>

  </section>
`;

// Función para cargar los elementos dinámicos
function cargarBatalla() {
  console.log("Pantalla de batalla cargada");
}

// Evento del botón Batalla
const botonBatalla = document.querySelector("#link-juego");

botonBatalla.addEventListener("click", function (event) {
  event.preventDefault();

  app.innerHTML = batalla;

  cargarBatalla();
});

// ==========================================
// 6. LANDING INICIAL
// ==========================================

app.innerHTML = landing;

cargarLanding();
