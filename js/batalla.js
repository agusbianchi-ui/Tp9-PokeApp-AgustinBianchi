// Las imágenes representan las acciones. La batalla no calcula daño ni estadísticas.
export function presentarArena(zonaArena) {
  const posturasCompanero = {
    normal: "./recursos/imagenes/blastoise-normal.png",
    ataque: "./recursos/imagenes/blastoise-ataque.webp",
    defensa: "./recursos/imagenes/Blastoise.png"
  };

  const posturasRival = {
    normal: "./recursos/imagenes/Charizard.png",
    ataque: "./recursos/imagenes/charizard-ataque.webp",
    defensa: "./recursos/imagenes/charizard-defensa.png"
  };

  zonaArena.innerHTML = `
    <section class="vista-arena">
      <p class="antetitulo">ARENA DE ENTRENADORES</p>
      <h1>Batalla Pokémon<span>.</span>
      </h1>
      <p>Vos y Blastoise frente a Charizard. Elegí el momento de actuar.</p>
      <div id="campo-duelo" class="campo-batalla">
        <figure class="combatiente">
          <img id="imagen-companero" src="${posturasCompanero.normal}"
            alt="Blastoise en su postura normal" />
          <figcaption>Tu compañero: <strong>Blastoise</strong></figcaption>
        </figure>
        <span class="versus-campo" aria-hidden="true">VS</span>
        <figure class="combatiente">
          <img id="imagen-rival" src="${posturasRival.normal}" alt="Charizard en su postura normal" />
          <figcaption>Tu rival: <strong>Charizard</strong></figcaption>
        </figure>
      </div>
      <div id="situacion-arena" class="situacion-arena" aria-live="polite">
        <h2>Una decisión puede cambiarlo todo.</h2>
        <p>Cuando estés listo, entrá al campo de batalla con Blastoise.</p>
        <button class="boton-principal" id="empezar-duelo">Comenzar batalla</button>
      </div>
    </section>
  `;

  const campoEnfrentamiento = document.querySelector("#campo-duelo");
  const zonaSituacion = document.querySelector("#situacion-arena");
  const imagenCompanera = document.querySelector("#imagen-companero");
  const imagenContrincante = document.querySelector("#imagen-rival");

  document.querySelector("#empezar-duelo").addEventListener("click", function () {
    campoEnfrentamiento.classList.add("en-batalla");
    presentarPrimeraDecision();
  });

  // Solo cambio el archivo de imagen.
  function mostrarPosturas(accionCompanero, accionRival) {
    imagenCompanera.src = posturasCompanero[accionCompanero];
    imagenCompanera.alt = "Blastoise: " + accionCompanero;
    imagenContrincante.src = posturasRival[accionRival];
    imagenContrincante.alt = "Charizard: " + accionRival;
  }

  function presentarPrimeraDecision() {
    zonaSituacion.innerHTML = `
      <p class="antetitulo">DECISIÓN 1 DE 2</p>
      <h2>Charizard prepara una llamarada.</h2>
      <p>¿Qué querés hacer?</p>
      <div class="acciones">
        <button class="boton-principal" id="atacar-ahora">Atacar ahora</button>
        <button class="boton-secundario" id="protegerse">Protegerse con el caparazón</button>
      </div>
    `;

    document.querySelector("#atacar-ahora").addEventListener("click", function () {
      mostrarPosturas("ataque", "defensa");
      presentarRivalProtegido();
    });

    document.querySelector("#protegerse").addEventListener("click", function () {
      mostrarPosturas("defensa", "ataque");
      presentarRivalCansado();
    });
  }

  function presentarRivalProtegido() {
    zonaSituacion.innerHTML = `
      <p class="antetitulo">DECISIÓN 2 DE 2</p>
      <h2>Charizard se pone en guardia.</h2>
      <p>El primer ataque no lo alcanza. ¿Esperás una abertura o disparás otra vez?</p>
      <div class="acciones">
        <button class="boton-principal" id="esperar-guardia">Esperar a que baje la guardia</button>
        <button class="boton-secundario" id="disparar-alto">Disparar sin esperar</button>
      </div>
    `;

    document.querySelector("#esperar-guardia").addEventListener("click", function () {
      terminarDuelo(
        true,
        "Esperaste el momento justo. Cuando Charizard baja la guardia, Blastoise lo alcanza con un chorro de agua y el rival se retira."
      );
    });

    document.querySelector("#disparar-alto").addEventListener("click", function () {
      terminarDuelo(
        false,
        "Charizard resiste el segundo ataque y responde con una llamarada. Blastoise debe retirarse."
      );
    });
  }

  function presentarRivalCansado() {
    zonaSituacion.innerHTML = `
      <p class="antetitulo">DECISIÓN 2 DE 2</p>
      <h2>El caparazón resiste la llamarada.</h2>
      <p>Charizard queda cansado. Es una buena oportunidad para actuar. ¿Qué elegís?</p>
      <div class="acciones">
        <button class="boton-principal" id="usar-agua">Usar Pistola Agua</button>
        <button class="boton-secundario" id="acercarse-rival">Acercarse para empujar</button>
      </div>
    `;

    document.querySelector("#usar-agua").addEventListener("click", function () {
      terminarDuelo(
        true,
        "Blastoise aprovecha la distancia y usa Pistola Agua. Charizard se retira: tu elección fue la indicada."
      );
    });

    document.querySelector("#acercarse-rival").addEventListener("click", function () {
      terminarDuelo(
        false,
        "Al acercarse, Blastoise le da tiempo al rival para recuperarse. Charizard responde y tu compañero debe retirarse."
      );
    });
  }

  function terminarDuelo(hayVictoria, relatoFinal) {
    let tituloResultado = "Esta vez ganó Charizard.";

    if (hayVictoria) {
      mostrarPosturas("ataque", "defensa");
      tituloResultado = "¡Ganaste con Blastoise!";
    } else {
      mostrarPosturas("defensa", "ataque");
    }

    zonaSituacion.innerHTML = `
      <p class="antetitulo">FIN DE LA BATALLA</p>
      <h2>${tituloResultado}</h2>
      <p>${relatoFinal}</p>
      <div class="acciones">
        <button class="boton-principal" id="repetir-duelo">Volver a jugar</button>
        <button class="boton-secundario" id="salir-duelo">Volver al inicio</button>
      </div>
    `;

    document.querySelector("#repetir-duelo").addEventListener("click", function () {
      presentarArena(zonaArena);
    });

    document.querySelector("#salir-duelo").addEventListener("click", function () {
      document.querySelector("#volver-portada").click();
    });
  }
}
