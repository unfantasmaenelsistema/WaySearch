<p align="center">
  <a href="https://www.unfantasmaenelsistema.com"><img src="img/logo.png" width="96" alt="Un fantasma en el sistema"></a>
</p>

<h1 align="center">WaySearch</h1>

<p align="center">
  <b>Buscador de archivos de Internet Archive por formato real</b><br>
  Software e imágenes de disco, vídeo, audio y libros, con enlace de descarga directa a cada archivo.
</p>

<p align="center">
  <a href="https://unfantasmaenelsistema.github.io/WaySearch/"><b>▶ Abrir WaySearch</b></a> ·
  <a href="https://www.unfantasmaenelsistema.com">unfantasmaenelsistema.com</a> ·
  <a href="LICENSE">MIT</a>
</p>

![Resultados de «windows 95» en formato ISO](docs/captura.png)

## Qué hace

- **Busca por formato de verdad.** Archive.org no guarda extensiones sino nombres de formato («MPEG4», «ISO Image», «VBR MP3»…). WaySearch traduce cada extensión a los nombres que usa el archivo: por eso MP4, EXE, MOV, MKV o WAV dan resultados.
- **Lista los archivos de cada resultado** con su tamaño y enlace de descarga directa. Si has elegido un formato, solo muestra los archivos de esa extensión.
- **Filtros**: todas las palabras, cualquiera o frase exacta; buscar en todo, título, autor, tema o descripción; tipo (software, vídeo, audio, conciertos, textos, imágenes, datos); rango de años; orden por relevancia, descargas, fecha o título; y **solo descargables**, que excluye los libros de préstamo.
- **Paginación** de 24 en 24 con el total de resultados.
- **Enlaces compartibles**: la búsqueda queda en la URL (`?q=jazz&format=flac`) y los botones atrás/adelante del navegador funcionan.
- Español e inglés, tema oscuro y claro, y diseño adaptado a móvil.

Formatos: ISO, IMG, ZIP, 7Z, RAR, EXE, APK · MP4, MKV, AVI, MOV, WEBM, MPEG · MP3, FLAC, WAV, OGG, OPUS · PDF, EPUB, MOBI, TXT, cómic (CBR/CBZ).

## Privacidad y seguridad

- Funciona entero en tu navegador: consulta directamente la API pública de Internet Archive (`advancedsearch` y `metadata`). No hay servidor intermedio ni analítica, y solo se guardan en el navegador el idioma y el tema.
- Los títulos, autores y nombres de archivo los escribe quien sube cada elemento, así que **nunca se insertan como HTML**: un título malicioso se muestra como texto.

## Uso responsable

Internet Archive es una biblioteca digital sin ánimo de lucro. Respeta los derechos de autor y la licencia de cada elemento.

## Desarrollo

Es HTML, CSS y JavaScript sin dependencias ni compilación: basta con abrir `index.html` desde un servidor local.

```bash
python -m http.server 8000      # http://localhost:8000
node tests/query.test.js        # pruebas del constructor de consultas
```

```
index.html          # página
style.css           # estilos (tema oscuro y claro)
js/query.js         # traducción de formatos y consultas para la API (también en Node)
js/app.js           # interfaz, textos ES/EN y lista de archivos
tests/              # pruebas del constructor de consultas
```

GitHub Pages publica la rama `main`, y el workflow `test.yml` pasa las pruebas en cada cambio.

---

Proyecto de [Un fantasma en el sistema](https://www.unfantasmaenelsistema.com) · Licencia [MIT](LICENSE)

<details>
<summary><b>English</b></summary>

**WaySearch** searches the Internet Archive by real file format. The archive stores format names ("MPEG4", "ISO Image", "VBR MP3"…) instead of extensions, so WaySearch maps each extension to them, and for every result it lists the matching files with their size and a direct download link. It offers word mode, field, media type, year range, sort and downloadable-only filters, pagination and shareable URLs, in Spanish or English, with dark and light themes. It runs entirely in your browser against the public API, and API data is never inserted as HTML. Please respect copyright and each item's licence. MIT licensed.

</details>
