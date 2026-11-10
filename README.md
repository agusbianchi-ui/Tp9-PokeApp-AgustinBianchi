# PokeApp · Atlas Pokémon

**Autor: Agustín Bianchi**  
**Materia: Funcionamiento de los Sistemas Digitales · Trabajo Práctico 9**

Hice esta aplicación para consultar información de Pokémon, registrar usuarios y participar en una batalla basada en decisiones. Usé HTML, CSS y JavaScript, sin frameworks.

## Cómo ejecutar la página

Abro la carpeta del proyecto en Visual Studio Code y ejecuto `index.html` con Live Server.

La página necesita un servidor local porque separé el JavaScript en módulos con `import` y `export`. Por eso no se debe abrir el HTML directamente con doble clic.

## Cuentas de prueba

| Rol           | Nombre          | Usuario     | Contraseña      |
| ---           | ---             | ---         | ---             |
| Administrador | Agustín Bianchi | `agustin.b` | `Entrenador01!` |
| Usuario común | Bruno Acosta    | `bruno.a`   | `Entrenador02!` |

El correo de la cuenta administradora es `agustin.b@example.com`. Desde **Registrarse** también se pueden crear cuentas nuevas, que siempre tienen permisos de usuario común.

## Pantallas de la aplicación

- **Inicio:** presenta la aplicación y permite entrar a la Pokédex o a la batalla.
- **Pokédex:** muestra los Pokémon guardados, con su número, imagen, nombre, tipos y rareza.
- **Detalle:** presenta la información completa del Pokémon seleccionado, su evolución, su variante variocolor si tiene y un reproductor para escuchar su sonido.
- **Iniciar sesión:** compara el usuario y la contraseña con las cuentas registradas.
- **Registrarse:** permite crear una cuenta y comprueba que el usuario y el correo no estén repetidos.
- **Cargar Pokémon:** aparece en el menú solamente cuando inicia sesión un administrador.
- **Batalla:** enfrenta a Blastoise contra Charizard mediante una secuencia de botones y decisiones.

Para cambiar de pantalla uso funciones que actualizan el contenido de `main`. Conecto los botones y formularios con `addEventListener`. El logo permite volver al inicio y la cabecera muestra quién inició sesión.

## Carga de Pokémon

Para agregar un Pokémon entro con mi cuenta administradora y completo el formulario de **Cargar Pokémon**. Incluí todos los datos pedidos en el trabajo: número, nombre, tipos, descripción, medidas, generación, estadísticas, habilidad, evolución, rareza, imágenes y sonido.

Al enviar el formulario, primero verifico los campos y los permisos de la cuenta. Después construyo el objeto, lo agrego al array y guardo la colección actualizada. El Pokémon nuevo aparece en su detalle y también en la Pokédex.

Los valores numéricos se obtienen con `valueAsNumber`; las casillas se leen con `checked`. Si no hay evolución o variante variocolor, los campos que no corresponden quedan en `null`. El número y el nombre del Pokémon no pueden repetirse, y sus dos tipos deben ser diferentes.

Para los recursos uso rutas locales o URLs públicas. Algunos ejemplos incluidos en el proyecto son:

- Imagen: `./recursos/imagenes/raichu.png`
- Sonido: `./recursos/sonidos/raichu.ogg`
- Variante variocolor: `./recursos/imagenes/raichu-shiny.png`

Los archivos propios se tienen que copiar a la carpeta correspondiente antes de cargar su ruta. Si una imagen no se encuentra, muestro una imagen de reemplazo. Si el sonido falla, el mensaje aparece dentro de la ficha.

## Cómo guardo la información

Usé `localStorage` para conservar los Pokémon y los usuarios al cerrar y volver a abrir la página. Como trabaja con texto, convierto los arrays a JSON con `JSON.stringify` y los recupero con `JSON.parse`.

| Clave                       | Información guardada                      |
| ---                         | ---                                       |
| `pokeapp-renovada-especies` | Colección actualizada de Pokémon.         |
| `pokeapp-renovada-cuentas`  | Cuentas iniciales y usuarios registrados. |
| `pokeapp-renovada-sesion`   | ID del usuario que inició sesión.         |

Los datos iniciales se guardan solo la primera vez. Después leo la colección que ya existe, para no perder los registros agregados. La sesión guarda el ID y consulto el rol en la cuenta correspondiente. Al actualizar esta versión también adapto la cuenta administradora y las rutas anteriores, sin reiniciar las colecciones.

Los datos pertenecen al navegador y a la dirección desde la que se abre la página. Por ejemplo, usar otro puerto significa acceder a un almacenamiento diferente. Las contraseñas forman parte del objeto de usuario, como indica el esquema del trabajo práctico.

## Cómo funciona la batalla

Elegí una batalla simple entre dos Pokémon fijos: el jugador usa a **Blastoise** y el rival es **Charizard**. Cada partida tiene dos decisiones y termina en victoria o derrota.

| Primera decisión            | Segunda decisión              | Resultado      |
| ---                         | ---                           | ---            |
| Atacar ahora                | Esperar a que baje la guardia | Gana Blastoise |
| Atacar ahora                | Disparar sin esperar          | Gana Charizard |
| Protegerse con el caparazón | Usar Pistola Agua             | Gana Blastoise |
| Protegerse con el caparazón | Acercarse para empujar        | Gana Charizard |

El fondo del campo es una imagen local y aparece solamente después de presionar **Comenzar batalla**. Antes de empezar se muestran los dos Pokémon sobre un fondo simple.

Cada Pokémon tiene imágenes estáticas para su estado normal, su ataque y su defensa. En la función `mostrarPosturas` cambio el atributo `src` de las dos imágenes según el botón elegido. No uso movimiento, temporizadores ni animaciones de CSS.

Las imágenes acompañan el relato y no calculo daño ni estadísticas de combate. Al terminar se puede repetir la partida o volver al inicio. Repetir vuelve a la presentación inicial, sin el fondo de batalla.

## Organización del código

| Archivo                 | Qué contiene                                                      |
| ---                     | ---                                                               |
| `index.html`            | Estructura general, menú y contenedor de las vistas.              |
| `css/style.css`         | Estilos separados por secciones y adaptación a celulares.         |
| `js/app.js`             | Navegación, inicio, Pokédex, detalle, registro y acceso.          |
| `js/almacenamiento.js`  | Lectura, escritura y actualización de los datos guardados.        |
| `js/carga.js`           | Formulario administrativo y creación de Pokémon.                  |
| `js/batalla.js`         | Decisiones de la batalla y cambio de las imágenes de los Pokémon. |
| `js/utilidades.js`      | Validación de formularios y funciones compartidas.                |
| `js/datos/pokemones.js` | Datos iniciales de los Pokémon.                                   |
| `js/datos/usuarios.js`  | Datos iniciales de las cuentas.                                   |

Las imágenes, sonidos y avatares están organizados dentro de `recursos/`. Conservé los nombres originales de los archivos que ya existían y usé nombres en español para los archivos nuevos.

Para el código usé funciones, parámetros, arrays, objetos, condicionales, recorridos y manipulación del DOM. Cada botón tiene un evento `click` o `submit`, como en la referencia. Organicé el CSS por partes: estilos generales, menú, inicio, Pokédex, detalle, formularios, batalla y adaptación a pantallas pequeñas. Cada propiedad está en su propia línea. Los nombres propios están en español; mantuve las claves que exige el PDF, como `username`, `password`, `hp`, `shiny` e `imagenShiny`, además de los nombres estándar del lenguaje y del navegador.

Los errores y confirmaciones se muestran dentro de la página. Los formularios usan `novalidate` para que la validación de JavaScript escriba los mensajes en el HTML, sin ventanas emergentes.

## Pruebas de funcionamiento

Para comprobar el proyecto revisé la navegación, el registro y el inicio de sesión, la diferencia entre roles y la carga de Pokémon. También comprobé que los registros siguieran disponibles después de recargar, que las cuatro rutas de la batalla terminaran y que el diseño se adaptara a escritorio y celular.

## Recursos utilizados

Usé las imágenes y sonidos locales del proyecto. Las variantes de Pokémon proceden de `PokeAPI/sprites` y los sonidos incorporados de `PokeAPI/cries`. Los avatares con iniciales y la imagen de reemplazo son recursos del proyecto. Pokémon pertenece a sus respectivos titulares; esta página tiene fines educativos.

### Imágenes de la batalla

El fondo está en `recursos/imagenes/fondo-batalla.png`. La imagen normal de Blastoise y la postura elegida para la guardia de Charizard son renders de Pokémon HOME disponibles en [PokeAPI/sprites](https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/home).

Para las posturas reutilicé las ilustraciones de Blastoise y Charizard que ya estaban incluidas, y agregué dos imágenes estáticas de PNGpix:

- [Blastoise usando un ataque de agua](https://pngpix.com/png/blastoise-pokemon-water-attack-ppmokwjv8qt1n4sc.html).
- [Charizard en una pose de ataque](https://pngpix.com/png/charizard-fire-breathing-pokemon-i9brnhph8bkm29le.html).

Para la defensa de Blastoise elegí la ilustración que muestra el caparazón hacia el rival. Todas las imágenes están incluidas en el proyecto, así que no hace falta descargarlas al ejecutar la página.
