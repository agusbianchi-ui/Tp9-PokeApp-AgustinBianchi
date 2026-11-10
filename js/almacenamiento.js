import { especiesIniciales } from "./datos/pokemones.js";
import { cuentasIniciales } from "./datos/usuarios.js";

const claveCatalogo = "pokeapp-renovada-especies";
const claveCuentas = "pokeapp-renovada-cuentas";
const claveSesion = "pokeapp-renovada-sesion";

// Una colección existente nunca se reemplaza por los datos iniciales.
function prepararColeccion(clave, contenidoInicial) {
  if (localStorage.getItem(clave) === null) {
    localStorage.setItem(clave, JSON.stringify(contenidoInicial));
  }
}

function recuperarColeccion(clave) {
  const contenidoGuardado = JSON.parse(localStorage.getItem(clave));
  if (!Array.isArray(contenidoGuardado)) {
    throw new Error("Los datos guardados no tienen el formato esperado.");
  }
  return contenidoGuardado;
}

export function prepararAlmacenamiento() {
  prepararColeccion(claveCatalogo, especiesIniciales);
  prepararColeccion(claveCuentas, cuentasIniciales);
  recuperarCatalogo();
  recuperarCuentas();
  actualizarDatosAnteriores();
}

// Mantengo los registros existentes al cambiar la cuenta y los nombres de archivos.
function actualizarDatosAnteriores() {
  const cuentasGuardadas = recuperarCuentas();
  let cambiaronCuentas = false;
  for (const cuentaAnterior of cuentasGuardadas) {
    if (
      cuentaAnterior.id === 1 &&
      cuentaAnterior.admin === true &&
      cuentaAnterior.username === "renata.s" &&
      cuentaAnterior.email === "renata.s@example.com"
    ) {
      cuentaAnterior.nombre = cuentasIniciales[0].nombre;
      cuentaAnterior.email = cuentasIniciales[0].email;
      cuentaAnterior.username = cuentasIniciales[0].username;
      cambiaronCuentas = true;
    }
    const avatarActualizado = actualizarRutaAnterior(cuentaAnterior.avatar);
    if (avatarActualizado !== cuentaAnterior.avatar) {
      cuentaAnterior.avatar = avatarActualizado;
      cambiaronCuentas = true;
    }
  }
  if (cambiaronCuentas) {
    localStorage.setItem(claveCuentas, JSON.stringify(cuentasGuardadas));
  }

  const especiesGuardadas = recuperarCatalogo();
  let cambiaronRecursos = false;
  for (const fichaAnterior of especiesGuardadas) {
    for (const campoRecurso of ["imagen", "imagenShiny", "sonido"]) {
      const rutaActualizada = actualizarRutaAnterior(fichaAnterior[campoRecurso]);
      if (rutaActualizada !== fichaAnterior[campoRecurso]) {
        fichaAnterior[campoRecurso] = rutaActualizada;
        cambiaronRecursos = true;
      }
    }
  }
  if (cambiaronRecursos) {
    localStorage.setItem(claveCatalogo, JSON.stringify(especiesGuardadas));
  }
}

function actualizarRutaAnterior(rutaGuardada) {
  if (typeof rutaGuardada !== "string") {
    return rutaGuardada;
  }
  // Comparo rutas conocidas para no modificar recursos agregados por el usuario.
  for (const fichaInicial of especiesIniciales) {
    if (rutaGuardada === fichaInicial.imagenShiny.replace("-shiny.png", "-variocolor.png")) {
      return fichaInicial.imagenShiny;
    }
  }
  for (const cuentaInicial of cuentasIniciales) {
    if (rutaGuardada === cuentaInicial.avatar.replace("/trainer-", "/entrenador-")) {
      return cuentaInicial.avatar;
    }
  }
  if (rutaGuardada === "./recursos/avatares/predeterminado.png") {
    return "./recursos/avatares/default.png";
  }
  return rutaGuardada;
}

export function recuperarCatalogo() {
  return recuperarColeccion(claveCatalogo);
}

export function recuperarCuentas() {
  return recuperarColeccion(claveCuentas);
}

export function incorporarEspecie(fichaNueva) {
  const listadoActual = recuperarCatalogo();
  for (const fichaGuardada of listadoActual) {
    if (
      fichaGuardada.id === fichaNueva.id ||
      fichaGuardada.nombre.toLowerCase() === fichaNueva.nombre.toLowerCase()
    ) {
      throw new Error("Ya existe un Pokémon con ese número o nombre.");
    }
  }
  listadoActual.push(fichaNueva);
  listadoActual.sort(function (primeraFicha, segundaFicha) {
    return primeraFicha.id - segundaFicha.id;
  });
  localStorage.setItem(claveCatalogo, JSON.stringify(listadoActual));
}

export function incorporarCuenta(cuentaNueva) {
  const cuentasActuales = recuperarCuentas();
  for (const cuentaGuardada of cuentasActuales) {
    if (
      cuentaGuardada.username.toLowerCase() === cuentaNueva.username.toLowerCase() ||
      cuentaGuardada.email.toLowerCase() === cuentaNueva.email.toLowerCase()
    ) {
      throw new Error("Ese usuario o correo electrónico ya está registrado.");
    }
  }
  cuentasActuales.push(cuentaNueva);
  localStorage.setItem(claveCuentas, JSON.stringify(cuentasActuales));
}

export function recordarAcceso(cuentaEncontrada) {
  // La sesión guarda solo el identificador; el rol se consulta en las cuentas.
  localStorage.setItem(claveSesion, JSON.stringify(cuentaEncontrada.id));
}

export function consultarAcceso() {
  const identificadorGuardado = JSON.parse(localStorage.getItem(claveSesion));
  for (const cuentaDisponible of recuperarCuentas()) {
    if (cuentaDisponible.id === identificadorGuardado) {
      return cuentaDisponible;
    }
  }
  return null;
}

export function olvidarAcceso() {
  localStorage.removeItem(claveSesion);
}
