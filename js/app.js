import {
  prepararAlmacenamiento,
  recuperarCatalogo,
  recuperarCuentas,
  incorporarCuenta,
  recordarAcceso,
  consultarAcceso,
  olvidarAcceso
} from "./almacenamiento.js";
import { textoSeguro, prepararImagenes, informar, comprobarCampos, explicarFallo } from "./utilidades.js";
import { presentarCarga } from "./carga.js";
import { presentarArena } from "./batalla.js";

// Obtiene las zonas principales de la página.
const zonaPrincipal = document.querySelector("#contenido-principal");
const anuncioPrincipal = document.querySelector("#aviso-general");

// Navegación y sesión

// Activa la navegación de los enlaces de una vista.
function activarEnlaces(raizVista) {
  for (const enlaceSeccion of raizVista.querySelectorAll("[data-vista]")) {
    enlaceSeccion.addEventListener("click", function (suceso) {
      suceso.preventDefault();
      cambiarPantalla(enlaceSeccion.dataset.vista);
    });
  }
}

// Actualiza los enlaces y los datos de la cuenta activa.
function actualizarIdentidad() {
  const cuentaActiva = consultarAcceso();
  document.querySelector("#enlace-acceso").hidden = cuentaActiva !== null;
  document.querySelector("#enlace-inscripcion").hidden = cuentaActiva !== null;
  document.querySelector("#enlace-carga").hidden = !cuentaActiva || cuentaActiva.admin !== true;
  const zonaIdentidad = document.querySelector("#identidad-activa");
  // Muestra la vista de visitante si no hay una sesión iniciada.
  if (!cuentaActiva) {
    // Muestra los datos y la opción de cerrar sesión.
    zonaIdentidad.innerHTML = `
      <span class="texto-tenue">Explorando como visitante</span>
    `;
    return;
  }
  zonaIdentidad.innerHTML = `
    <img src="${textoSeguro(cuentaActiva.avatar)}" alt="Avatar de ${textoSeguro(cuentaActiva.nombre)}" />
    <span><strong>${textoSeguro(cuentaActiva.nombre)}</strong>
      <small>@${textoSeguro(cuentaActiva.username)} · ${cuentaActiva.admin ? "Administrador/a" : "Entrenador/a"}</small>
    </span>
    <button id="salir-cuenta" class="boton-discreto" type="button">Cerrar sesión</button>
  `;
  prepararImagenes(zonaIdentidad);
  // Cierra la sesión y vuelve al inicio.
  document.querySelector("#salir-cuenta").addEventListener("click", function () {
    try {
      olvidarAcceso();
      cambiarPantalla("inicio");
      informar(anuncioPrincipal, "Cerraste la sesión.");
    } catch (falloSalida) {
      informar(anuncioPrincipal, explicarFallo(falloSalida), true);
    }
  });
}

// Cambia el contenido visible y prepara sus eventos.
function cambiarPantalla(destinoVista, identificadorFicha) {
  try {
    // Detiene cualquier sonido de la vista anterior.
    const sonidoAnterior = zonaPrincipal.querySelector("audio");
    if (sonidoAnterior) {
      sonidoAnterior.pause();
    }
    anuncioPrincipal.hidden = true;
    actualizarIdentidad();
    // Selecciona la función que construye la vista solicitada.
    if (destinoVista === "especies") {
      presentarCatalogo();
    } else if (destinoVista === "detalle") {
      presentarDetalle(identificadorFicha);
    } else if (destinoVista === "acceso") {
      presentarAcceso();
    } else if (destinoVista === "inscripcion") {
      presentarInscripcion();
    } else if (destinoVista === "carga") {
      presentarCarga(zonaPrincipal, function (fichaIncorporada) {
        cambiarPantalla("detalle", fichaIncorporada.id);
        informar(
          anuncioPrincipal,
          fichaIncorporada.nombre + " se guardó correctamente y ya está disponible en la Pokédex."
        );
      });
    } else if (destinoVista === "arena") {
      presentarArena(zonaPrincipal);
    } else {
      presentarInicio();
    }
    // Activa los enlaces y protege las imágenes de la nueva vista.
    activarEnlaces(zonaPrincipal);
    prepararImagenes(zonaPrincipal);
    // Marca en el menú la sección actualmente visible.
    for (const enlaceMenu of document.querySelectorAll(".navegacion a")) {
      enlaceMenu.removeAttribute("aria-current");
      if (
        enlaceMenu.dataset.vista === destinoVista ||
        (destinoVista === "detalle" && enlaceMenu.dataset.vista === "especies")
      ) {
        enlaceMenu.setAttribute("aria-current", "page");
      }
    }
    // Enfoca el título y actualiza el título de la pestaña.
    const tituloVisible = zonaPrincipal.querySelector("h1");
    if (tituloVisible) {
      tituloVisible.tabIndex = -1;
      tituloVisible.focus({ preventScroll: true });
      document.title = tituloVisible.textContent + " · PokeApp";
    }
    window.scrollTo(0, 0);
  } catch (falloVista) {
    informar(anuncioPrincipal, explicarFallo(falloVista), true);
  }
}

// Inicio

// Construye la pantalla principal de la aplicación.
function presentarInicio() {
  // Obtiene la cantidad actual de especies registradas.
  const cantidadEspecies = recuperarCatalogo().length;
  zonaPrincipal.innerHTML = `
    <section class="vista-inicio">
      <div class="texto-inicio">
        <p class="antetitulo">UN ATLAS PARA MENTES CURIOSAS</p>
        <h1>Un mundo<br>por <em>descubrir.</em></h1>
        <p class="introduccion">Cada Pokémon tiene una historia. Explorá sus características y poné
          a prueba tus decisiones en una pequeña aventura.</p>
        <div class="acciones">
          <button class="boton-principal" data-vista="especies">Explorar Pokédex <span
              aria-hidden="true">↗</span>
          </button>
          <button class="boton-secundario" data-vista="arena">Ir a la batalla</button>
        </div>
        <p class="pista-inicio">Tu próxima expedición empieza acá.</p>
      </div>
      <div class="destacado">
        <span class="rotulo-destacado">ESPÉCIMEN DESTACADO</span>
        <div class="orbita-destacado">
          <img src="./recursos/imagenes/pikachu.png" alt="Pikachu" />
        </div>
        <div class="pie-destacado">
          <span>
            <small>N.º 025 · KANTO</small><strong>Pikachu</strong>
          </span>
          <span class="etiqueta-tipo tipo-eléctrico">Eléctrico</span>
        </div>
      </div>
      <div class="resumen-inicio">
        <div><strong>${cantidadEspecies}</strong>
          <span>Pokémon para descubrir</span>
        </div>
        <div><strong>02</strong>
          <span>Pokémon en la batalla</span>
        </div>
        <p>Un pequeño atlas.<br>Un universo de posibilidades.</p>
      </div>
    </section>
  `;
}

// Pokédex

// Genera las etiquetas visuales de los tipos.
function etiquetasTipos(tiposFicha) {
  let etiquetasCreadas = "";
  for (const elementoTipo of tiposFicha) {
    etiquetasCreadas += `
      <span class="etiqueta-tipo tipo-${textoSeguro(elementoTipo.toLowerCase())}">${textoSeguro(elementoTipo)}</span>
    `;
  }
  return etiquetasCreadas;
}

// Construye la lista de tarjetas de la Pokédex.
function presentarCatalogo() {
  const fichasDisponibles = recuperarCatalogo();
  zonaPrincipal.innerHTML = `
    <section>
      <div class="encabezado-seccion">
        <div>
          <p class="antetitulo">EXPLORÁ EL ARCHIVO</p>
          <h1>Pokédex<span>.</span></h1>
        </div>
        <p>${fichasDisponibles.length} especies<br>
          <span>Tu atlas Pokémon</span>
        </p>
      </div>
      <div id="listado-especies" class="rejilla-especies"></div>
    </section>
  `;
  const zonaTarjetas = document.querySelector("#listado-especies");
  let tarjetasCreadas = "";
  // Crea una tarjeta por cada especie disponible.
  for (const fichaDisponible of fichasDisponibles) {
    tarjetasCreadas += `
      <article class="tarjeta-especie">
        <div class="ilustracion-especie">
          <span class="numero-ficha">N.º ${fichaDisponible.id}</span>
          <img src="${textoSeguro(fichaDisponible.imagen)}" alt="${textoSeguro(fichaDisponible.nombre)}" loading="lazy" />
        </div>
        <div class="resumen-especie">
          <p class="rotulo-rareza">${textoSeguro(fichaDisponible.rareza)}</p>
          <h2>${textoSeguro(fichaDisponible.nombre)}</h2>
          <div class="lista-tipos">${etiquetasTipos(fichaDisponible.tipo)}</div>
          <button class="abrir-ficha" data-numero="${fichaDisponible.id}"
            aria-label="Ver detalles de ${textoSeguro(fichaDisponible.nombre)}">Ver detalles <span aria-hidden="true">↗
            </span>
          </button>
        </div>
      </article>
    `;
  }
  zonaTarjetas.innerHTML =
    tarjetasCreadas ||
    `
      <p class="mensaje">Todavía no hay Pokémon registrados.</p>
    `;
  // Conecta cada botón con la vista de detalle correspondiente.
  for (const accionDetalle of zonaTarjetas.querySelectorAll(".abrir-ficha")) {
    accionDetalle.addEventListener("click", function () {
      cambiarPantalla("detalle", Number(accionDetalle.dataset.numero));
    });
  }
}

// Detalle de un Pokémon

// Crea una fila con el nombre y valor de un dato.
function datoDetalle(etiquetaDato, valorDato) {
  return `
    <div>
      <dt>${etiquetaDato}</dt>
      <dd>${textoSeguro(valorDato)}</dd>
    </div>
  `;
}

// Busca una especie y construye su ficha completa.
function presentarDetalle(identificadorElegido) {
  let fichaElegida = null;
  for (const fichaCandidata of recuperarCatalogo()) {
    if (fichaCandidata.id === identificadorElegido) {
      fichaElegida = fichaCandidata;
    }
  }
  // Muestra un aviso si el identificador no existe.
  if (!fichaElegida) {
    zonaPrincipal.innerHTML = `
      <section>
        <h1>Pokémon no disponible</h1>
        <p>No se encontró ese número en el archivo.</p>
        <button class="boton-principal" data-vista="especies">Volver a la Pokédex</button>
      </section>
    `;
    return;
  }
  // Prepara el texto sobre la evolución.
  let explicacionEvolucion = "No tiene evolución";
  if (fichaElegida.tieneEvolucion) {
    explicacionEvolucion = fichaElegida.evolucion;
    if (fichaElegida.nivelEvolucion !== null) {
      explicacionEvolucion += " · Nivel " + fichaElegida.nivelEvolucion;
    } else {
      explicacionEvolucion += " · No evoluciona por nivel";
    }
  }
  // Prepara la imagen variocolor si está disponible.
  let vistaVariante = `
    <p class="texto-tenue">Sin variante variocolor registrada.</p>
  `;
  if (fichaElegida.shiny) {
    vistaVariante = `
      <figure class="variante-ficha">
        <img src="${textoSeguro(fichaElegida.imagenShiny)}" alt="Variante variocolor de ${textoSeguro(fichaElegida.nombre)}" />
        <figcaption>Variante variocolor</figcaption>
      </figure>
    `;
  }

  // Carga la información y las imágenes de la ficha.
  zonaPrincipal.innerHTML = `
    <section>
      <button class="boton-volver" data-vista="especies">← Volver a la Pokédex</button>
      <div class="encabezado-seccion">
        <div>
          <p class="antetitulo">FICHA N.º ${fichaElegida.id}</p>
          <h1>${textoSeguro(fichaElegida.nombre)}<span>.</span></h1>
        </div>
        <span class="rotulo-rareza">${textoSeguro(fichaElegida.rareza)}</span>
      </div>
      <div class="ficha-completa">
        <div class="galeria-ficha">
          <figure>
            <img class="retrato-ficha" src="${textoSeguro(fichaElegida.imagen)}" alt="${textoSeguro(fichaElegida.nombre)}" />
            <figcaption>Aspecto habitual</figcaption>
          </figure> ${vistaVariante}
        </div>
        <div class="informacion-ficha">
          <div class="lista-tipos">${etiquetasTipos(fichaElegida.tipo)}</div>
          <p class="descripcion-ficha">${textoSeguro(fichaElegida.descripcion)}</p>
          <dl class="datos-ficha"> ${datoDetalle("Altura", fichaElegida.altura + " m")}${datoDetalle("Peso", fichaElegida.peso + " kg")}
            ${datoDetalle("Generación", fichaElegida.generacion)}${datoDetalle("Habilidad", fichaElegida.habilidad)} ${datoDetalle("Puntos de salud (HP)", fichaElegida.hp)}${datoDetalle("Ataque", fichaElegida.ataque)}
            ${datoDetalle("Defensa", fichaElegida.defensa)}${datoDetalle("Velocidad", fichaElegida.velocidad)} ${datoDetalle("Evolución", explicacionEvolucion)}${datoDetalle("Variocolor disponible", fichaElegida.shiny ? "Sí" : "No")} </dl>
          <p class="texto-tenue">Sonido del Pokémon</p>
          <audio id="sonido-especie" controls preload="none"></audio>
          <p id="aviso-sonido" class="mensaje" role="status" hidden></p>
        </div>
      </div>
    </section>
  `;
  // Configura los mensajes del reproductor de sonido.
  const reproductorFicha = document.querySelector("#sonido-especie");
  const salidaSonido = document.querySelector("#aviso-sonido");
  reproductorFicha.src = fichaElegida.sonido;
  reproductorFicha.addEventListener("playing", function () {
    informar(salidaSonido, "Reproduciendo el sonido de " + fichaElegida.nombre + ".");
  });

  reproductorFicha.addEventListener("error", function () {
    informar(
      salidaSonido,
      "No se pudo reproducir el sonido. Revisá el archivo o la conexión si usaste una URL.",
      true
    );
  });

  reproductorFicha.addEventListener("ended", function () {
    informar(salidaSonido, "Reproducción finalizada.");
  });
}

// Inicio de sesión

// Construye el formulario de acceso.
function presentarAcceso() {
  zonaPrincipal.innerHTML = `
    <section class="vista-cuenta">
      <div class="presentacion-cuenta">
        <p class="antetitulo">TU PRÓXIMA EXPEDICIÓN</p>
        <h1>Qué bueno<br>verte de<br><em>nuevo.</em></h1>
        <p>Ingresá para continuar tu aventura.</p>
        <span class="simbolo-cuenta" aria-hidden="true">◎</span>
      </div>
      <div class="panel-formulario">
        <p class="antetitulo">ACCESO DE ENTRENADORES</p>
        <h2>Iniciar sesión</h2>
        <form id="acceso-cuenta" novalidate aria-describedby="aviso-acceso">
          <label for="apodo-acceso">Usuario</label>
          <input id="apodo-acceso" autocomplete="username" required maxlength="30" />
          <label for="clave-acceso">Contraseña</label>
          <input id="clave-acceso" type="password" autocomplete="current-password" required />
          <p id="aviso-acceso" class="mensaje" role="status" hidden></p>
          <button type="submit">Ingresar <span aria-hidden="true">→</span>
          </button>
        </form>
        <p class="pie-formulario">¿Tu primera visita? <a href="#inscripcion"
            data-vista="inscripcion">Creá tu cuenta</a>.</p>
      </div>
    </section>
  `;
  const accesoFormulario = document.querySelector("#acceso-cuenta");
  const salidaAcceso = document.querySelector("#aviso-acceso");
  // Comprueba las credenciales cuando se envía el formulario.
  accesoFormulario.addEventListener("submit", function (sucesoAcceso) {
    sucesoAcceso.preventDefault();
    if (!comprobarCampos(accesoFormulario, salidaAcceso)) {
      return;
    }
    // Busca una cuenta que coincida con el usuario y la contraseña.
    try {
      const apodoIngresado = document.querySelector("#apodo-acceso").value.trim().toLowerCase();
      const claveIngresada = document.querySelector("#clave-acceso").value;
      let cuentaCoincidente = null;
      for (const cuentaEvaluada of recuperarCuentas()) {
        if (
          cuentaEvaluada.username.toLowerCase() === apodoIngresado &&
          cuentaEvaluada.password === claveIngresada
        ) {
          cuentaCoincidente = cuentaEvaluada;
          break;
        }
      }
      // Informa si no se encontró una cuenta coincidente.
      if (!cuentaCoincidente) {
        informar(salidaAcceso, "El usuario o la contraseña son incorrectos.", true);
        return;
      }
      // Guarda la sesión y vuelve a la pantalla principal.
      recordarAcceso(cuentaCoincidente);
      cambiarPantalla("inicio");
      informar(
        anuncioPrincipal,
        "Bienvenido/a, " +
          cuentaCoincidente.nombre +
          ". " +
          (cuentaCoincidente.admin
            ? "Ya podés acceder a Cargar Pokémon desde el menú."
            : "Tu sesión está iniciada.")
      );
    } catch (falloAcceso) {
      informar(salidaAcceso, explicarFallo(falloAcceso), true);
    }
  });
}

// Registro de usuarios

// Construye el formulario para crear una cuenta.
function presentarInscripcion() {
  zonaPrincipal.innerHTML = `
    <section class="vista-cuenta">
      <div class="presentacion-cuenta">
        <p class="antetitulo">UN NUEVO COMIENZO</p>
        <h1>Tu historia<br>merece una<br><em>aventura.</em></h1>
        <p>Creá tu perfil de entrenador.</p>
        <span class="simbolo-cuenta" aria-hidden="true">◎</span>
      </div>
      <div class="panel-formulario">
        <p class="antetitulo">PERFIL DE ENTRENADOR</p>
        <h2>Registrarse</h2>
        <form id="inscripcion-cuenta" novalidate aria-describedby="aviso-inscripcion">
          <label for="nombre-personal">Nombre</label>
          <input id="nombre-personal" autocomplete="name" required maxlength="60" />
          <label for="correo-personal">Correo electrónico</label>
          <input id="correo-personal" type="email" autocomplete="email" required maxlength="120" />
          <label for="apodo-personal">Usuario (3 a 30 caracteres)</label>
          <input id="apodo-personal" autocomplete="username" required minlength="3" maxlength="30"
            pattern="[A-Za-z0-9_.\\-]+" />
          <label for="clave-personal">Contraseña (mínimo 6 caracteres)</label>
          <input id="clave-personal" type="password" autocomplete="new-password" required
            minlength="6" maxlength="100" />
          <label for="avatar-personal">Avatar</label>
          <select id="avatar-personal">
            <option value="./recursos/avatares/default.png">Entrenador</option>
            <option value="./recursos/avatares/1.png">Entrenador con gorra</option>
            <option value="./recursos/avatares/2.png">Entrenadora</option>
          </select>
          <p id="aviso-inscripcion" class="mensaje" role="status" hidden></p>
          <button type="submit">Crear cuenta <span aria-hidden="true">→</span>
          </button>
        </form>
        <p class="pie-formulario">¿Ya tenés cuenta? <a href="#acceso" data-vista="acceso">Iniciá
            sesión</a>.</p>
      </div>
    </section>
  `;
  const inscripcionFormulario = document.querySelector("#inscripcion-cuenta");
  const salidaInscripcion = document.querySelector("#aviso-inscripcion");
  // Valida y guarda la cuenta cuando se envía el formulario.
  inscripcionFormulario.addEventListener("submit", function (sucesoInscripcion) {
    sucesoInscripcion.preventDefault();
    if (!comprobarCampos(inscripcionFormulario, salidaInscripcion)) {
      return;
    }
    // Calcula un identificador nuevo para la cuenta.
    try {
      let siguienteIdentificador = 1;
      for (const cuentaPrevia of recuperarCuentas()) {
        if (cuentaPrevia.id >= siguienteIdentificador) {
          siguienteIdentificador = cuentaPrevia.id + 1;
        }
      }
      // Reúne los datos introducidos en el formulario.
      const cuentaCreada = {
        id: siguienteIdentificador,
        nombre: document.querySelector("#nombre-personal").value.trim(),
        email: document.querySelector("#correo-personal").value.trim().toLowerCase(),
        username: document.querySelector("#apodo-personal").value.trim().toLowerCase(),
        password: document.querySelector("#clave-personal").value,
        avatar: document.querySelector("#avatar-personal").value,
        admin: false
      };
      // Guarda la cuenta y dirige al formulario de acceso.
      incorporarCuenta(cuentaCreada);
      cambiarPantalla("acceso");
      informar(
        document.querySelector("#aviso-acceso"),
        "Tu cuenta se guardó correctamente. Ya podés iniciar sesión."
      );
      document.querySelector("#apodo-acceso").value = cuentaCreada.username;
    } catch (falloInscripcion) {
      informar(salidaInscripcion, explicarFallo(falloInscripcion), true);
    }
  });
}

// Inicializa el almacenamiento, la navegación y la pantalla inicial.
try {
  prepararAlmacenamiento();
  activarEnlaces(document.querySelector(".navegacion"));
  document.querySelector("#volver-portada").addEventListener("click", function () {
    cambiarPantalla("inicio");
  });
  cambiarPantalla("inicio");
} catch (falloInicio) {
  zonaPrincipal.innerHTML = `
    <h1>No se pudo abrir PokeApp</h1>
    <p>Habilitá el almacenamiento del sitio o revisá sus datos y volvé a cargar la página.</p>
  `;
  informar(anuncioPrincipal, explicarFallo(falloInicio), true);
}
