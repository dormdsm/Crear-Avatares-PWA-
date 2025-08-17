# Crear Avatares · PWA (Starter)

App web (PWA) para gestionar avatares, variaciones, escenarios y contador. Funciona **offline** con IndexedDB (Dexie).

## Uso rápido
1. Abre `index.html` (mejor desde un hosting https como Netlify).
2. Añade a pantalla de inicio en tu móvil (PWA).
3. Guarda avatares/variaciones/escenarios y pega enlaces directos de Drive (`https://drive.google.com/uc?id=FILE_ID`).
4. Exporta/Importa JSON para backup o migrar datos.

## Estructura de datos
- **Avatares**: { id, nombre, descripcion, url, createdAt }
- **Variaciones**: { id, avatarId, nombre, descripcion, estado, url, createdAt }
- **Escenarios**: { id, nombre, direccion, estado, url, createdAt }
- **Contador**: { id, fecha, hora, descripcion }

## Publicar en GitHub + Netlify (paso a paso)
1) **GitHub**
- Crea repo `crear-avatares-pwa` → Public.
- Sube todos los archivos (que `index.html` quede en la raíz).

2) **Netlify**
- Add new site → Import from Git → selecciona el repo.
- *Build command*: (vacío) · *Publish directory*: `/`
- Deploy → URL tipo `https://tu-sitio.netlify.app`.

3) **PWA**
- Abre tu URL en el móvil → “Añadir a pantalla de inicio”.
- Funciona offline gracias al `sw.js`.

## Notas
- Para que el Service Worker funcione en móvil, sirve por **HTTPS** (Netlify recomendado).
- Si usas enlaces de Google Drive, recuerda ponerlos en formato directo: `https://drive.google.com/uc?id=FILE_ID`.
