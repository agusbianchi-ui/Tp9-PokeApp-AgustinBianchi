import { pokemones } from "./db/pokemones.js";
import { trainerAccounts } from "./db/usuarios.js";

const viewRoot = document.querySelector("#view-root");

const welcomeView = `
  <section class="welcome-view">
    <div class="welcome-copy">
      <p class="eyebrow">EL MUNDO POKÉMON, MÁS CERCA</p>
      <h1>La próxima<br>aventura<br><em>empieza acá.</em></h1>
      <p class="intro">Explorá el mundo Pokémon. Conocé a los habitantes de Kanto y encontrá tu próximo compañero de viaje.</p>
      <p class="welcome-hint">Elegí una opción del menú para comenzar. <span aria-hidden="true">↗</span></p>
    </div>
    <div class="specimen">
      <span class="specimen-label">ESPÉCIMEN DESTACADO</span>
      <div class="specimen-orbit"><img src="./assets/img/pikachu.png" alt="Pikachu" /></div>
      <div class="specimen-caption"><span><small>N.º 025 · KANTO</small><strong>Pikachu</strong></span><span class="type-tag type-eléctrico">Eléctrico</span></div>
    </div>
    <div class="field-summary"><div><strong>${pokemones.length}</strong><span>Pokémon para descubrir</span></div><div><strong>01</strong><span>Región por explorar</span></div><p>Un pequeño atlas.<br>Un universo de posibilidades.</p></div>
  </section>
`;

function initializeWelcome() {
  console.log("Inicio disponible");
}

const homeTrigger = document.querySelector("#home-trigger");
homeTrigger.addEventListener("click", function () {
  viewRoot.innerHTML = welcomeView;
  initializeWelcome();
});

const catalogView = `
  <section class="catalog-view">
    <div class="section-heading"><div><p class="eyebrow">EXPLORÁ LA REGIÓN</p><h1>Pokédex<span>.</span></h1></div><p>${pokemones.length} especies<br><span>Archivo de Kanto</span></p></div>
    <div id="creature-grid" class="creature-grid"></div>
  </section>
`;

function populateCatalog() {
  const creatureGrid = document.querySelector("#creature-grid");
  for (let creature of pokemones) {
    creatureGrid.innerHTML += `
      <article class="creature-card">
        <div class="creature-art"><span class="catalog-number">N.º ${creature.id}</span><img src="${creature.imagen}" alt="${creature.nombre}" /></div>
        <div class="creature-description">
          <p class="rarity-label">${creature.rareza}</p>
          <h2>${creature.nombre}</h2>
          <div class="type-list"><span class="type-tag type-${creature.tipo[0].toLowerCase()}">${creature.tipo[0]}</span></div>
          <button class="detail-trigger" data-id="${creature.id}">Ver detalles <span aria-hidden="true">↗</span></button>
        </div>
      </article>
    `;
  }
}

const catalogTrigger = document.querySelector("#catalog-trigger");
catalogTrigger.addEventListener("click", function (interaction) {
  interaction.preventDefault();
  viewRoot.innerHTML = catalogView;
  populateCatalog();
});

const signinView = `
  <section class="account-view">
    <div class="account-story"><p class="eyebrow">TU PRÓXIMA EXPEDICIÓN</p><h1>Qué bueno<br>verte de<br><em>nuevo.</em></h1><p>Volvé a explorar el mundo Pokémon.</p><span class="story-mark" aria-hidden="true">◎</span></div>
    <div class="form-panel"><p class="eyebrow">ACCESO DE ENTRENADORES</p><h2>Iniciar sesión</h2>
      <form id="signin-form">
        <label for="account-handle">Usuario</label><input type="text" id="account-handle" autocomplete="username" placeholder="Tu usuario" />
        <label for="account-secret">Contraseña</label><input type="password" id="account-secret" autocomplete="current-password" placeholder="Tu contraseña" />
        <button type="submit">Ingresar <span aria-hidden="true">→</span></button>
      </form>
    </div>
  </section>
`;

function initializeSignin() {
  console.log("Vista de acceso disponible");
}

const signinTrigger = document.querySelector("#signin-trigger");
signinTrigger.addEventListener("click", function (interaction) {
  interaction.preventDefault();
  viewRoot.innerHTML = signinView;
  initializeSignin();
  const signinForm = document.querySelector("#signin-form");
  signinForm.addEventListener("submit", (submission) => {
    submission.preventDefault();
    const enteredHandle = document.querySelector("#account-handle").value;
    const enteredSecret = document.querySelector("#account-secret").value;
    let credentialsMatch = false;
    for (const account of trainerAccounts) {
      if (account.username === enteredHandle && account.password === enteredSecret) {
        alert(`Bienvenido, ${account.nombre}!`);
        credentialsMatch = true;
        break;
      } else {
        credentialsMatch = false;
      }
    }
    if (!credentialsMatch) {
      alert("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
    }
  });
});

const signupView = `
  <section class="account-view">
    <div class="account-story"><p class="eyebrow">UN NUEVO COMIENZO</p><h1>Tu historia<br>merece una<br><em>aventura.</em></h1><p>El mundo de Kanto te espera.</p><span class="story-mark" aria-hidden="true">◎</span></div>
    <div class="form-panel"><p class="eyebrow">PERFIL DE ENTRENADOR</p><h2>Registrarse</h2>
      <form id="signup-form">
        <label for="profile-name">Nombre</label><input type="text" id="profile-name" autocomplete="name" placeholder="Tu nombre" />
        <label for="profile-email">Email</label><input type="email" id="profile-email" autocomplete="email" placeholder="nombre@ejemplo.com" />
        <label for="profile-handle">Usuario</label><input type="text" id="profile-handle" autocomplete="username" placeholder="Elegí un usuario" />
        <label for="profile-secret">Contraseña</label><input type="password" id="profile-secret" autocomplete="new-password" placeholder="Elegí una contraseña" />
        <button type="submit">Registrarse <span aria-hidden="true">→</span></button>
      </form>
    </div>
  </section>
`;

function initializeSignup() {
  console.log("Vista de registro disponible");
}

const signupTrigger = document.querySelector("#signup-trigger");
signupTrigger.addEventListener("click", function (interaction) {
  interaction.preventDefault();
  viewRoot.innerHTML = signupView;
  initializeSignup();
});

const arenaView = `
  <section class="arena-view">
    <p class="eyebrow">ARENA DE ENTRENADORES</p><h1>Batalla Pokémon<span>.</span></h1>
    <p>Elegí tu Pokémon para comenzar.</p>
    <div class="arena-art" aria-hidden="true"><img src="./assets/img/Charizard.png" alt="" /><span>VS</span><img src="./assets/img/Blastoise.png" alt="" /></div>
    <button id="arena-start">Comenzar batalla <span aria-hidden="true">→</span></button>
  </section>
`;

function initializeArena() {
  console.log("Vista de batalla disponible");
}

const arenaTrigger = document.querySelector("#arena-trigger");
arenaTrigger.addEventListener("click", function (interaction) {
  interaction.preventDefault();
  viewRoot.innerHTML = arenaView;
  initializeArena();
});

viewRoot.innerHTML = welcomeView;
initializeWelcome();
