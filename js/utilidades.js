// Los textos ingresados se muestran como texto, sin interpretarlos como HTML.
// Convierte caracteres especiales para evitar que se interpreten como HTML.
export function textoSeguro(contenido) {
  return String(contenido)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Comprueba que una dirección sea válida y use HTTP o HTTPS.
export function direccionSegura(direccion) {
  try {
    const destinoRecurso = new URL(direccion, document.baseURI);
    return (
      direccion.trim() !== "" && (destinoRecurso.protocol === "http:" || destinoRecurso.protocol === "https:")
    );
  } catch {
    return false;
  }
}

// Reemplaza imágenes con direcciones inválidas o que no pudieron cargarse.
export function prepararImagenes(contenedor) {
  for (const ilustracion of contenedor.querySelectorAll("img")) {
    if (!direccionSegura(ilustracion.getAttribute("src"))) {
      ilustracion.src = "./recursos/imagenes/sin-imagen.svg";
    }
    ilustracion.addEventListener(
      "error",
      function () {
        ilustracion.src = "./recursos/imagenes/sin-imagen.svg";
      },
      { once: true }
    );
  }
}

// Muestra un mensaje informativo o de error en la página.
export function informar(destinoMensaje, contenidoMensaje, esError = false) {
  destinoMensaje.textContent = contenidoMensaje;
  destinoMensaje.hidden = false;
  destinoMensaje.classList.toggle("mensaje-error", esError);
}

// novalidate evita los globos del navegador; los errores se escriben en la página.
// Valida todos los campos activos del formulario.
export function comprobarCampos(formularioActual, salidaMensaje) {
  for (const controlActual of formularioActual.querySelectorAll("input, select, textarea")) {
    controlActual.removeAttribute("aria-invalid");
    if (controlActual.disabled) {
      continue;
    }
    if (controlActual.required && controlActual.type !== "checkbox" && controlActual.value.trim() === "") {
      return rechazarCampo(controlActual, salidaMensaje, "Completá este campo.");
    }
    if (!controlActual.validity.valid) {
      let explicacion = "Revisá el valor ingresado.";
      if (controlActual.validity.typeMismatch) {
        explicacion = "Ingresá un correo electrónico válido.";
      }
      if (controlActual.validity.tooShort) {
        explicacion = "Usá al menos " + controlActual.minLength + " caracteres.";
      }
      if (controlActual.validity.rangeUnderflow) {
        explicacion = "El mínimo permitido es " + controlActual.min + ".";
      }
      if (controlActual.validity.rangeOverflow) {
        explicacion = "El máximo permitido es " + controlActual.max + ".";
      }
      if (controlActual.validity.stepMismatch) {
        explicacion = "Revisá los decimales; este valor puede requerir un entero.";
      }
      if (controlActual.validity.patternMismatch) {
        explicacion = "Usá letras, números, puntos, guiones o guion bajo.";
      }
      return rechazarCampo(controlActual, salidaMensaje, explicacion);
    }
  }
  salidaMensaje.hidden = true;
  return true;
}

// Muestra el error de un campo y le devuelve el foco.
export function rechazarCampo(controlRechazado, salidaMensaje, explicacion) {
  const etiquetaControl = controlRechazado.labels[0];
  informar(salidaMensaje, etiquetaControl.textContent.trim() + ": " + explicacion, true);
  controlRechazado.setAttribute("aria-invalid", "true");
  controlRechazado.focus();
  return false;
}

// Convierte errores técnicos en mensajes comprensibles para el usuario.
export function explicarFallo(falloRecibido) {
  if (falloRecibido.name === "QuotaExceededError") {
    return "No hay espacio para guardar los datos. Liberá espacio del sitio y volvé a intentarlo.";
  }
  if (falloRecibido.name === "SecurityError") {
    return "El navegador bloqueó el almacenamiento. Habilitalo para este sitio y volvé a intentarlo.";
  }
  if (falloRecibido.name === "SyntaxError") {
    return "Los datos guardados no se pueden leer. No se modificaron. Revisá el almacenamiento del sitio.";
  }
  return falloRecibido.message || "No se pudo completar la operación. Volvé a intentarlo.";
}
