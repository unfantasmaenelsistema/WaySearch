/* ── WaySearch — construcción de consultas para la API de Internet Archive ──
   Archive.org no guarda extensiones sino nombres de formato ("MPEG4", "ISO Image",
   "VBR MP3"…). Por eso buscar format:(mp4) daba 0 resultados: aquí cada
   extensión se traduce a los nombres reales que usa el archivo.
   Funciona en el navegador (window.WaySearchQuery) y en Node (module.exports). */
(function (root) {
  'use strict';

  const FORMATS = {
    // grupo, nombres de formato en Archive.org, extensiones de archivo reales
    iso:   { group: 'software', names: ['ISO Image'], ext: /\.iso$/i },
    img:   { group: 'software', names: ['Disk Image'], ext: /\.(img|ima|dsk)$/i },
    zip:   { group: 'software', names: ['ZIP'], ext: /\.zip$/i },
    '7z':  { group: 'software', names: ['7z'], ext: /\.7z$/i },
    rar:   { group: 'software', names: ['RAR'], ext: /\.rar$/i },
    exe:   { group: 'software', names: ['Windows Executable', 'EXE'], ext: /\.exe$/i },
    apk:   { group: 'software', names: ['Android Package Archive'], ext: /\.apk$/i },
    mp4:   { group: 'video', names: ['MPEG4', 'h.264', 'h.264 IA', '512Kb MPEG4'], ext: /\.(mp4|m4v)$/i },
    mkv:   { group: 'video', names: ['Matroska'], ext: /\.mkv$/i },
    avi:   { group: 'video', names: ['Cinepack', 'AVI'], ext: /\.avi$/i },
    mov:   { group: 'video', names: ['QuickTime'], ext: /\.mov$/i },
    webm:  { group: 'video', names: ['WebM'], ext: /\.webm$/i },
    mpeg:  { group: 'video', names: ['MPEG2', 'MPEG1'], ext: /\.(mpe?g|m2v|vob)$/i },
    mp3:   { group: 'audio', names: ['VBR MP3', 'MP3', '128Kbps MP3', '64Kbps MP3'], ext: /\.mp3$/i },
    flac:  { group: 'audio', names: ['Flac', '24bit Flac'], ext: /\.flac$/i },
    wav:   { group: 'audio', names: ['WAVE', 'WAV'], ext: /\.wav$/i },
    ogg:   { group: 'audio', names: ['Ogg Vorbis'], ext: /\.(ogg|oga)$/i },
    opus:  { group: 'audio', names: ['Opus'], ext: /\.opus$/i },
    pdf:   { group: 'docs', names: ['Text PDF', 'Additional Text PDF', 'Image Container PDF', 'PDF'], ext: /\.pdf$/i },
    epub:  { group: 'docs', names: ['EPUB'], ext: /\.epub$/i },
    mobi:  { group: 'docs', names: ['MOBI'], ext: /\.(mobi|azw3?)$/i },
    txt:   { group: 'docs', names: ['DjVuTXT', 'TXT'], ext: /\.txt$/i },
    comic: { group: 'docs', names: ['Comic Book'], ext: /\.(cbr|cbz)$/i },
  };

  const MEDIATYPES = ['software', 'movies', 'audio', 'texts', 'image', 'data', 'etree', 'collection'];
  const SCOPES = { all: null, title: 'title', creator: 'creator', subject: 'subject', description: 'description' };
  const SORTS = {
    relevance: null,
    downloads: 'downloads desc',
    newest: 'publicdate desc',
    oldest: 'date asc',
    year_desc: 'date desc',
    title: 'titleSorter asc',
  };
  const FIELDS = ['identifier', 'title', 'creator', 'year', 'date', 'mediatype', 'downloads', 'item_size', 'access-restricted-item', 'format'];

  /** Término suelto: si lleva caracteres especiales de Lucene (C++, foo:bar…) va entre
      comillas, porque la API de Archive.org rechaza los escapes con barra invertida. */
  function escapeTerm(t) {
    const v = String(t);
    if (/^(AND|OR|NOT|TO)$/.test(v)) return quote(v.toLowerCase());
    return /[+\-!(){}[\]^"~*?:\\/&|]/.test(v) ? quote(v) : v;
  }

  /** Divide el texto en términos respetando "frases entre comillas". */
  function tokenize(text) {
    const out = [];
    const re = /"([^"]+)"|(\S+)/g;
    let m;
    while ((m = re.exec(String(text))) !== null) {
      if (m[1] && m[1].trim()) out.push({ phrase: true, value: m[1].trim() });
      else if (m[2]) {
        const v = m[2].replace(/^"+|"+$/g, '');
        if (v) out.push({ phrase: false, value: v });
      }
    }
    return out;
  }

  // La API no admite escapes con barra invertida: se quitan comillas y barras de dentro
  const quote = s => '"' + String(s).replace(/["\\]/g, ' ').replace(/\s+/g, ' ').trim() + '"';

  /**
   * Construye la consulta Lucene.
   * opts: { q, mode: 'all'|'any'|'phrase', scope, format, mediatype, from, to, downloadable }
   */
  function buildQuery(opts) {
    const o = opts || {};
    const parts = [];
    const text = String(o.q || '').trim();
    if (text) {
      let expr;
      if (o.mode === 'phrase') {
        expr = quote(text.replace(/"/g, ''));
      } else {
        const tokens = tokenize(text).map(t => (t.phrase ? quote(t.value) : escapeTerm(t.value)));
        expr = tokens.join(o.mode === 'any' ? ' OR ' : ' AND ');
        if (tokens.length > 1) expr = '(' + expr + ')';
      }
      const field = SCOPES[o.scope] || null;
      parts.push(field ? field + ':' + (expr.startsWith('(') ? expr : '(' + expr + ')') : expr);
    }
    const fmt = FORMATS[o.format];
    if (fmt) parts.push('format:(' + fmt.names.map(quote).join(' OR ') + ')');
    if (MEDIATYPES.includes(o.mediatype)) parts.push('mediatype:(' + o.mediatype + ')');
    const from = parseInt(o.from, 10), to = parseInt(o.to, 10);
    if (from || to) parts.push('year:[' + (from || '*') + ' TO ' + (to || '*') + ']');
    if (o.downloadable) parts.push('NOT access-restricted-item:true');
    if (!parts.length) return '';
    // Una consulta que empieza por NOT necesita algo a la izquierda
    if (parts[0].startsWith('NOT ')) parts.unshift('*:*');
    return parts.join(' AND ');
  }

  /** URL de advancedsearch con campos, orden y página. */
  function searchUrl(opts, page, rows) {
    const params = new URLSearchParams();
    params.set('q', buildQuery(opts));
    FIELDS.forEach(f => params.append('fl[]', f));
    const sort = SORTS[opts.sort];
    if (sort) params.append('sort[]', sort);
    params.set('rows', String(rows || 24));
    params.set('page', String(Math.max(1, page || 1)));
    params.set('output', 'json');
    return 'https://archive.org/advancedsearch.php?' + params.toString();
  }

  /** Archivos del elemento que interesan: los de la extensión elegida o los originales. */
  function pickFiles(files, format) {
    const fmt = FORMATS[format];
    const skip = /(_meta\.(xml|sqlite)|_files\.xml|_reviews\.xml|_archive\.torrent|__ia_thumb\.jpg|_thumb\.jpg|\.sqlite)$/i;
    return (files || [])
      .filter(f => f && f.name && !skip.test(f.name))
      .filter(f => (fmt ? fmt.ext.test(f.name) : f.source === 'original'))
      .map(f => ({ name: f.name, size: Number(f.size) || 0, format: f.format || '' }))
      .sort((a, b) => b.size - a.size);
  }

  /** Enlace de descarga directa (cada segmento de la ruta codificado). */
  function downloadUrl(identifier, name) {
    return 'https://archive.org/download/' + encodeURIComponent(identifier) + '/' +
      String(name).split('/').map(encodeURIComponent).join('/');
  }

  const api = { FORMATS, MEDIATYPES, SCOPES, SORTS, escapeTerm, tokenize, buildQuery, searchUrl, pickFiles, downloadUrl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WaySearchQuery = api;
})(typeof window !== 'undefined' ? window : globalThis);
