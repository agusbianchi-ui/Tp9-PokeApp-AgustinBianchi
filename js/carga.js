// Importa funciones para acceder a la sesión y guardar especies.
import { consultarAcceso, incorporarEspecie } from "./almacenamiento.js";
// Importa utilidades para validar campos, rutas y mensajes.
import { comprobarCampos, direccionSegura, informar, rechazarCampo, explicarFallo } from "./utilidades.js";

// Lista de tipos Pokémon disponibles.
const categoriasElementales = [
  "Acero",
  "Agua",
  "Bicho",
  "Dragón",
  "Eléctrico",
  "Fantasma",
  "Fuego",
  "Hada",
  "Hielo",
  "Lucha",
  "Normal",
  "Planta",
  "Psíquico",
  "Roca",
  "Siniestro",
  "Tierra",
  "Veneno",
  "Volador"
];

// Genera las opciones del selector de tipos.
function opcionesElementales() {
  let opcionesCreadas = "";
  for (const categoriaElemental of categoriasElementales) {
    opcionesCreadas += `
      <option>${categoriaElemental}</option>
    `;
  }
  return opcionesCreadas;
}

// Muestra y controla el formulario para cargar un Pokémon.
export function presentarCarga(zonaCarga, alIncorporar) {
  // Verifica que haya una cuenta administradora.
  const cuentaSolicitante = consultarAcceso();
  if (!cuentaSolicitante || cuentaSolicitante.admin !== true) {
    zonaCarga.innerHTML = `
      <section class="panel-acotado">
        <p class="antetitulo">ADMINISTRACIÓN</p>
        <h1>Acceso restringido</h1>
        <p>La carga de Pokémon está disponible únicamente para cuentas administradoras.</p>
        <button class="boton-principal" data-vista="acceso">Iniciar sesión</button>
      </section>
    `;
    return;
  }
  // Dibuja el formulario completo de carga.
  zonaCarga.innerHTML = `
    <section>
      <div class="encabezado-seccion">
        <div>
          <p class="antetitulo">ADMINISTRACIÓN DEL ARCHIVO</p>
          <h1>Cargar Pokémon<span>.</span></h1>
        </div>
      </div>
      <p class="texto-tenue">Completá la ficha. Los datos se guardan en este navegador y se
        incorporan a la Pokédex.</p>
      <form id="alta-especie" class="formulario-carga" novalidate aria-describedby="aviso-carga">
        <fieldset>
          <legend>01 · Identidad</legend>
          <div class="campos-dobles">
            <div>
              <label for="ficha-numero">Número en la Pokédex</label>
              <input id="ficha-numero" type="number" min="1" max="999999" step="1" required />
            </div>
            <div>
              <label for="ficha-denominacion">Nombre del Pokémon</label>
              <input id="ficha-denominacion" required maxlength="60" />
            </div>
            <div>
              <label for="ficha-elemento">Tipo principal</label>
              <select id="ficha-elemento" required>
                <option value="">Elegir tipo</option>
                ${opcionesElementales()}
              </select>
            </div>
            <div>
              <label for="ficha-elemento-adicional">Tipo secundario</label>
              <select id="ficha-elemento-adicional">
                <option value="">Sin segundo tipo</option>
                ${opcionesElementales()}
              </select>
            </div>
            <div class="campo-completo">
              <label for="ficha-relato">Descripción</label>
              <textarea id="ficha-relato" rows="3" required maxlength="1000"></textarea>
            </div>
            <div>
              <label for="ficha-categoria">Rareza</label>
              <select id="ficha-categoria" required>
                <option value="">Elegir rareza</option>
                <option>Común</option>
                <option>Poco común</option>
                <option>Raro</option>
                <option>Legendario</option>
                <option>Mítico</option>
              </select>
            </div>
            <div>
              <label for="ficha-generacion">Generación</label>
              <input id="ficha-generacion" type="number" min="1" max="99" step="1" required />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>02 · Características</legend>
          <div class="campos-dobles">
            <div>
              <label for="ficha-estatura">Altura en metros</label>
              <input id="ficha-estatura" type="number" min="0.01" step="any" required />
            </div>
            <div>
              <label for="ficha-masa">Peso en kilogramos</label>
              <input id="ficha-masa" type="number" min="0.01" step="any" required />
            </div>
            <div>
              <label for="ficha-salud">Puntos de salud (HP)</label>
              <input id="ficha-salud" type="number" min="1" max="9999" step="1" required />
            </div>
            <div>
              <label for="ficha-fuerza">Ataque</label>
              <input id="ficha-fuerza" type="number" min="1" max="9999" step="1" required />
            </div>
            <div>
              <label for="ficha-rapidez">Velocidad</label>
              <input id="ficha-rapidez" type="number" min="1" max="9999" step="1" required />
            </div>
            <div>
              <label for="ficha-resistencia">Defensa</label>
              <input id="ficha-resistencia" type="number" min="1" max="9999" step="1" required />
            </div>
            <div class="campo-completo">
              <label for="ficha-talento">Habilidad</label>
              <input id="ficha-talento" required maxlength="80" />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>03 · Evolución</legend>
          <label class="casilla" for="ficha-evoluciona">
            <input id="ficha-evoluciona" type="checkbox" /> Tiene evolución
          </label>
          <div id="campos-evolucion" class="campos-dobles" hidden>
            <div>
              <label for="ficha-sucesor">Nombre de la evolución</label>
              <input id="ficha-sucesor" maxlength="60" disabled />
            </div>
            <div>
              <label for="ficha-nivel">Nivel de evolución</label>
              <input id="ficha-nivel" type="number" min="1" max="100" step="1" disabled />
              <small>Dejá vacío si evoluciona mediante piedra u otro método.</small>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>04 · Imágenes y sonido</legend>
          <p class="ayuda-campo">Ingresá rutas de archivos incluidos en el proyecto o URLs públicas
            HTTP/HTTPS. Ejemplo de imagen: ./recursos/imagenes/raichu.png; sonido:
            ./recursos/sonidos/raichu.ogg.</p>
          <label for="ficha-retrato">Ruta o URL de la imagen</label>
          <input id="ficha-retrato" required />
          <label for="ficha-audio">Ruta o URL del sonido</label>
          <input id="ficha-audio" required />
          <label class="casilla" for="ficha-variocolor">
            <input id="ficha-variocolor" type="checkbox" /> Tiene variante variocolor
          </label>
          <div id="campo-variocolor" hidden>
            <label for="ficha-retrato-alterno">Ruta o URL de la imagen variocolor</label>
            <input id="ficha-retrato-alterno" disabled />
          </div>
        </fieldset>
        <p id="aviso-carga" class="mensaje" role="status" hidden></p>
        <div class="acciones">
          <button class="boton-principal" type="submit">Guardar Pokémon <span aria-hidden="true">→
            </span>
          </button>
          <button class="boton-secundario" type="button" data-vista="especies">Volver a la Pokédex
          </button>
        </div>
      </form>
    </section>
  `;

  // Guarda referencias a los controles principales del formulario.
  const cargaFormulario = document.querySelector("#alta-especie");
  const salidaCarga = document.querySelector("#aviso-carga");
  const casillaEvolucion = document.querySelector("#ficha-evoluciona");
  const casillaVariocolor = document.querySelector("#ficha-variocolor");
  // Muestra u oculta los campos de evolución.
  casillaEvolucion.addEventListener("change", function () {
    document.querySelector("#campos-evolucion").hidden = !casillaEvolucion.checked;
    document.querySelector("#ficha-sucesor").disabled = !casillaEvolucion.checked;
    document.querySelector("#ficha-sucesor").required = casillaEvolucion.checked;
    document.querySelector("#ficha-nivel").disabled = !casillaEvolucion.checked;
  });
  // Muestra u oculta el campo para la imagen variocolor.
  casillaVariocolor.addEventListener("change", function () {
    document.querySelector("#campo-variocolor").hidden = !casillaVariocolor.checked;
    document.querySelector("#ficha-retrato-alterno").disabled = !casillaVariocolor.checked;
    document.querySelector("#ficha-retrato-alterno").required = casillaVariocolor.checked;
  });

  // Valida y guarda los datos cuando se envía el formulario.
  cargaFormulario.addEventListener("submit", function (sucesoCarga) {
    sucesoCarga.preventDefault();
    try {
      // Se comprueba otra vez al guardar, aunque alguien altere el menú.
      const cuentaAutorizada = consultarAcceso();
      if (!cuentaAutorizada || cuentaAutorizada.admin !== true) {
        informar(
          salidaCarga,
          "Tu sesión no tiene permisos para cargar Pokémon. Iniciá sesión con una cuenta administradora.",
          true
        );
        return;
      }
      // Valida los campos obligatorios y sus límites.
      if (!comprobarCampos(cargaFormulario, salidaCarga)) {
        return;
      }
      // Comprueba que los tipos elegidos sean diferentes.
      const elementoPrincipal = document.querySelector("#ficha-elemento").value;
      const elementoSecundario = document.querySelector("#ficha-elemento-adicional").value;
      if (elementoPrincipal === elementoSecundario) {
        rechazarCampo(
          document.querySelector("#ficha-elemento-adicional"),
          salidaCarga,
          "Elegí un tipo diferente al principal."
        );
        return;
      }
      // Verifica que las rutas sean locales o URLs seguras.
      for (const campoRuta of cargaFormulario.querySelectorAll(
        "#ficha-retrato, #ficha-audio, #ficha-retrato-alterno"
      )) {
        if (!campoRuta.disabled && !direccionSegura(campoRuta.value)) {
          rechazarCampo(campoRuta, salidaCarga, "Ingresá una ruta local o una URL HTTP/HTTPS válida.");
          return;
        }
      }
      // Forma la lista de tipos seleccionados.
      const elementosElegidos = [elementoPrincipal];
      if (elementoSecundario !== "") {
        elementosElegidos.push(elementoSecundario);
      }
      // Obtiene los datos opcionales de evolución.
      let evolucionElegida = null;
      let nivelElegido = null;
      if (casillaEvolucion.checked) {
        evolucionElegida = document.querySelector("#ficha-sucesor").value.trim();
        if (document.querySelector("#ficha-nivel").value !== "") {
          nivelElegido = document.querySelector("#ficha-nivel").valueAsNumber;
        }
      }

      // Obtiene la imagen variocolor si fue seleccionada.
      let imagenAlternativa = null;
      if (casillaVariocolor.checked) {
        imagenAlternativa = document.querySelector("#ficha-retrato-alterno").value.trim();
      }

      // Construye el objeto con todos los datos del nuevo Pokémon.
      const fichaCreada = {
        id: document.querySelector("#ficha-numero").valueAsNumber,
        nombre: document.querySelector("#ficha-denominacion").value.trim(),
        tipo: elementosElegidos,
        descripcion: document.querySelector("#ficha-relato").value.trim(),
        altura: document.querySelector("#ficha-estatura").valueAsNumber,
        peso: document.querySelector("#ficha-masa").valueAsNumber,
        generacion: document.querySelector("#ficha-generacion").valueAsNumber,
        hp: document.querySelector("#ficha-salud").valueAsNumber,
        ataque: document.querySelector("#ficha-fuerza").valueAsNumber,
        velocidad: document.querySelector("#ficha-rapidez").valueAsNumber,
        defensa: document.querySelector("#ficha-resistencia").valueAsNumber,
        habilidad: document.querySelector("#ficha-talento").value.trim(),
        tieneEvolucion: casillaEvolucion.checked,
        evolucion: evolucionElegida,
        nivelEvolucion: nivelElegido,
        rareza: document.querySelector("#ficha-categoria").value,
        imagen: document.querySelector("#ficha-retrato").value.trim(),
        sonido: document.querySelector("#ficha-audio").value.trim(),
        shiny: casillaVariocolor.checked,
        imagenShiny: imagenAlternativa
      };
      // Guarda la especie y notifica al resto de la aplicación.
      incorporarEspecie(fichaCreada);
      alIncorporar(fichaCreada);
    } catch (falloCarga) {
      // Muestra un mensaje si ocurre un error durante la carga.
      informar(salidaCarga, explicarFallo(falloCarga), true);
    }
  });
}
