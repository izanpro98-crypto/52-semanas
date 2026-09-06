# 52 Semanas de Hierro — PWA

App de entrenamiento instalable, funciona sin internet, datos guardados en tu
dispositivo. Todo gratis y sin cuentas de terceros.

## Ficheros

| Fichero | Para qué |
|---|---|
| `index.html` | La app entera |
| `manifest.webmanifest` | Nombre, iconos y colores para que se instale |
| `sw.js` | Service worker: es lo que la hace funcionar sin internet |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Iconos |
| `.nojekyll` | Evita que GitHub procese la carpeta y se coma ficheros |
| `_iconos.js` | Solo si algún día quieres regenerar los iconos: `node _iconos.js` |
| `_servidor-local.js` | Solo para probarla en tu PC antes de subirla |

Los dos que empiezan por `_` no forman parte de la app; puedes borrarlos.

## Probarla en tu ordenador antes de subirla

```bash
node _servidor-local.js
```

Abre <http://localhost:8129> en Chrome. Para comprobar que el modo offline
funciona: F12 → pestaña **Application** → **Service Workers** debe aparecer
como *activated and is running*. Luego marca la casilla **Offline** en esa
misma pantalla y recarga: la app tiene que seguir abriendo.

## Subirla a GitHub Pages (gratis y permanente)

Sin usar la terminal:

1. Crea una cuenta en <https://github.com> si no la tienes.
2. Botón **+** arriba a la derecha → **New repository**.
   - Nombre: `52-semanas` (o el que quieras)
   - Marca **Public** — Pages gratis requiere repositorio público
   - Crea el repositorio
3. En el repositorio vacío, pincha **uploading an existing file**.
4. Arrastra **todos** los ficheros de esta carpeta. Importante: los ficheros
   sueltos, no la carpeta que los contiene. El `.nojekyll` es invisible en
   Windows; si no lo ves, activa *Elementos ocultos* en la pestaña Vista del
   explorador.
5. Botón **Commit changes**.
6. Pestaña **Settings** → menú lateral **Pages** → en *Branch* elige `main`
   y carpeta `/ (root)` → **Save**.
7. Espera un par de minutos y tu app estará en:
   `https://TU-USUARIO.github.io/52-semanas/`

## Instalarla en el móvil

Abre esa dirección en el móvil:

- **Android (Chrome):** sale solo un aviso "Ponla en tu pantalla de inicio".
  Si no, menú ⋮ → *Añadir a pantalla de inicio*.
- **iPhone (Safari):** botón Compartir → *Añadir a pantalla de inicio*.
  Tiene que ser Safari; desde Chrome en iPhone no se puede instalar.

Queda con su icono y se abre a pantalla completa, sin barra de navegador.

## Pasar los datos entre el móvil y el ordenador

Pestaña **Progreso** → sección *Tus datos*:

- **Copiar datos** / **Pegar datos** — lo más cómodo entre dispositivos.
- **Descargar** / **Abrir fichero** — guarda un `.json` como copia de seguridad.

Al importar los datos **se fusionan**: para cada serie gana la marca más
reciente. Puedes ir y volver entre dispositivos sin perder nada, y desmarcar
algo en un sitio no lo resucita al importar del otro.

Haz una **Descarga** de vez en cuando como copia de seguridad: si borras los
datos de navegación del móvil, el historial se va con ellos.

## Cambiar la app más adelante

Edita `index.html` y **sube el número de `VERSION` en `sw.js`** (`v1` → `v2`).
Sin eso, los dispositivos que ya la tengan instalada seguirán con la copia
antigua guardada. Al subir la versión, la app muestra un aviso de
"Hay una versión nueva" con un botón para actualizar.
