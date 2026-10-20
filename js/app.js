/* ── WaySearch — interfaz ──
   Los datos de Archive.org (títulos, autores, nombres de archivo) los escribe
   cualquiera que suba un elemento, así que nunca se insertan como HTML:
   todo se pinta con textContent. */
'use strict';

const Q = window.WaySearchQuery;
const ROWS = 24;
const $ = id => document.getElementById(id);

const I18N = {
  es: {
    brand_title: 'Un fantasma en el sistema', tagline: 'Buscador de archivos de Internet Archive',
    toggle_lang: 'Switch to English', toggle_theme: 'Cambiar tema claro/oscuro',
    search_label: 'Qué buscas', placeholder: 'Ej.: windows 95, jazz, quijote…', format: 'Formato', any_format: 'Cualquier formato',
    g_software: 'Software e imágenes de disco', g_video: 'Vídeo', g_audio: 'Audio', g_docs: 'Documentos', comic: 'Cómic (CBR/CBZ)',
    search: 'Buscar', more_filters: 'Más filtros', mode: 'Palabras', mode_all: 'Todas', mode_any: 'Cualquiera', mode_phrase: 'Frase exacta',
    scope: 'Buscar en', scope_all: 'Todo', scope_title: 'Título', scope_creator: 'Autor', scope_subject: 'Tema', scope_description: 'Descripción',
    type: 'Tipo', type_any: 'Cualquiera', type_software: 'Software', type_movies: 'Vídeo', type_audio: 'Audio', type_etree: 'Conciertos',
    type_texts: 'Textos', type_image: 'Imágenes', type_data: 'Datos', type_collection: 'Colección',
    sort: 'Orden', sort_relevance: 'Relevancia', sort_downloads: 'Más descargados', sort_newest: 'Subidos recientemente',
    sort_year_desc: 'Más modernos', sort_oldest: 'Más antiguos', sort_title: 'Título (A-Z)',
    year_from: 'Año desde', year_to: 'Año hasta', only_downloadable: 'Solo descargables (sin préstamo)',
    legal: 'Internet Archive es una biblioteca digital sin ánimo de lucro. Respeta los derechos de autor y la licencia de cada elemento. WaySearch solo consulta su API pública desde tu navegador.',
    source: 'Código',
    need_query: 'Escribe algo que buscar o elige un formato o un tipo.',
    searching: 'Buscando en Internet Archive…', found: '{n} resultados', found_one: '1 resultado', page_of: 'página {p} de {t}',
    none: 'No hay resultados. Prueba con menos palabras, «Cualquiera» en vez de «Todas» u otro formato.',
    error: 'Internet Archive no ha respondido. Inténtalo de nuevo en unos segundos.', timeout: 'La búsqueda ha tardado demasiado. Inténtalo de nuevo.',
    prev: '← Anterior', next: 'Siguiente →', downloads: '{n} descargas', lending: 'Préstamo',
    show_files: 'Ver archivos', show_files_fmt: 'Ver archivos .{ext}', hide_files: 'Ocultar archivos', details: 'Ficha en archive.org',
    loading_files: 'Cargando la lista de archivos…', no_files: 'Este elemento no tiene archivos {ext} descargables.',
    no_files_any: 'Este elemento no tiene archivos originales descargables.', files_error: 'No se pudo cargar la lista de archivos.',
    restricted_note: 'Elemento de préstamo: los archivos solo se pueden consultar con una cuenta de archive.org.',
    more_files: 'y {n} archivos más en la ficha', untitled: '(sin título)', unknown: 'desconocido',
    help_title: 'Busca por formato real',
    help_body: 'Archive.org no guarda extensiones sino nombres de formato («MPEG4», «ISO Image», «VBR MP3»…). WaySearch traduce cada formato y, al abrir un resultado, lista solo los archivos de esa extensión con su tamaño y enlace de descarga directa.',
    examples: 'Ejemplos:',
  },
  en: {
    brand_title: 'Un fantasma en el sistema', tagline: 'Internet Archive file finder',
    toggle_lang: 'Cambiar a español', toggle_theme: 'Toggle light/dark theme',
    search_label: 'What are you looking for', placeholder: 'e.g. windows 95, jazz, don quixote…', format: 'Format', any_format: 'Any format',
    g_software: 'Software & disk images', g_video: 'Video', g_audio: 'Audio', g_docs: 'Documents', comic: 'Comic (CBR/CBZ)',
    search: 'Search', more_filters: 'More filters', mode: 'Words', mode_all: 'All', mode_any: 'Any', mode_phrase: 'Exact phrase',
    scope: 'Search in', scope_all: 'Everything', scope_title: 'Title', scope_creator: 'Creator', scope_subject: 'Subject', scope_description: 'Description',
    type: 'Type', type_any: 'Any', type_software: 'Software', type_movies: 'Video', type_audio: 'Audio', type_etree: 'Live music',
    type_texts: 'Texts', type_image: 'Images', type_data: 'Data', type_collection: 'Collection',
    sort: 'Sort', sort_relevance: 'Relevance', sort_downloads: 'Most downloaded', sort_newest: 'Recently added',
    sort_year_desc: 'Newest', sort_oldest: 'Oldest', sort_title: 'Title (A-Z)',
    year_from: 'Year from', year_to: 'Year to', only_downloadable: 'Downloadable only (no lending)',
    legal: 'The Internet Archive is a non-profit digital library. Respect copyright and each item\'s licence. WaySearch only queries its public API from your browser.',
    source: 'Source',
    need_query: 'Type something, or pick a format or a type.',
    searching: 'Searching the Internet Archive…', found: '{n} results', found_one: '1 result', page_of: 'page {p} of {t}',
    none: 'No results. Try fewer words, "Any" instead of "All", or another format.',
    error: 'The Internet Archive did not answer. Try again in a few seconds.', timeout: 'The search took too long. Try again.',
    prev: '← Previous', next: 'Next →', downloads: '{n} downloads', lending: 'Lending',
    show_files: 'Show files', show_files_fmt: 'Show .{ext} files', hide_files: 'Hide files', details: 'Page on archive.org',
    loading_files: 'Loading the file list…', no_files: 'This item has no downloadable {ext} files.',
    no_files_any: 'This item has no downloadable original files.', files_error: 'Could not load the file list.',
    restricted_note: 'Lending item: its files are only available with an archive.org account.',
    more_files: 'and {n} more files on the item page', untitled: '(untitled)', unknown: 'unknown',
    help_title: 'Search by real format',
    help_body: 'Archive.org does not store extensions but format names ("MPEG4", "ISO Image", "VBR MP3"…). WaySearch translates each format and, when you open a result, lists only the files with that extension, with their size and a direct download link.',
    examples: 'Examples:',
  },
};

const state = { lang: document.documentElement.lang === 'en' ? 'en' : 'es', opts: null, page: 1, controller: null };

function t(key, params) {
  let s = (I18N[state.lang] || I18N.es)[key];
  if (s === undefined) s = I18N.es[key] !== undefined ? I18N.es[key] : key;
  if (params) for (const k in params) s = s.split('{' + k + '}').join(String(params[k]));
  return s;
}

const nf = () => new Intl.NumberFormat(state.lang === 'es' ? 'es-ES' : 'en-GB');

function fmtSize(bytes) {
  if (!bytes) return '';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0, n = bytes;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return (n >= 100 || i === 0 ? Math.round(n) : n.toFixed(1)) + ' ' + u[i];
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

const first = v => (Array.isArray(v) ? v[0] : v);

// ─── Idioma y tema ───
function applyI18n() {
  document.documentElement.lang = state.lang;
  document.title = state.lang === 'es' ? 'WaySearch — Buscador de archivos de Internet Archive' : 'WaySearch — Internet Archive file finder';
  document.querySelectorAll('[data-i18n]').forEach(n => { n.textContent = t(n.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(n => { n.placeholder = t(n.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-title]').forEach(n => { n.title = t(n.dataset.i18nTitle); n.setAttribute('aria-label', n.title); });
  document.querySelectorAll('[data-i18n-label]').forEach(n => { n.label = t(n.dataset.i18nLabel); });
  $('langBtn').textContent = state.lang === 'es' ? 'EN' : 'ES';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  $('themeBtn').textContent = theme === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('ws_theme', theme); } catch (e) { /* sin almacenamiento */ }
}

// ─── Formulario ↔ URL (las búsquedas se pueden compartir) ───
const KEYS = ['q', 'format', 'mode', 'scope', 'mediatype', 'sort', 'from', 'to'];

function readForm() {
  const o = {};
  KEYS.forEach(k => { o[k] = $(k).value.trim(); });
  o.downloadable = $('downloadable').checked;
  return o;
}

function writeForm(o) {
  KEYS.forEach(k => {
    const v = o[k] || '';
    const node = $(k);
    if (node.tagName === 'SELECT' && v && ![...node.options].some(op => op.value === v)) return;
    node.value = v || (node.tagName === 'SELECT' ? node.options[0].value : '');
  });
  $('downloadable').checked = o.downloadable !== false;
  if (o.mode && o.mode !== 'all' || o.scope && o.scope !== 'all' || o.mediatype || o.from || o.to || (o.sort && o.sort !== 'relevance') || o.downloadable === false) {
    $('filtersBox').open = true;
  }
}

function toParams(o, page) {
  const p = new URLSearchParams();
  KEYS.forEach(k => { if (o[k] && !((k === 'mode' || k === 'scope') && o[k] === 'all') && !(k === 'sort' && o[k] === 'relevance')) p.set(k, o[k]); });
  if (!o.downloadable) p.set('all', '1');
  if (page > 1) p.set('p', String(page));
  return p;
}

function fromParams(p) {
  const o = {};
  KEYS.forEach(k => { if (p.get(k)) o[k] = p.get(k).slice(0, 200); });
  o.downloadable = p.get('all') !== '1';
  return { opts: o, page: Math.max(1, parseInt(p.get('p'), 10) || 1) };
}

// ─── Búsqueda ───
/** Hace falta texto, formato, tipo o años: "solo descargables" por sí solo no es una búsqueda. */
const hasCriteria = o => !!(String(o.q || '').trim() || o.format || o.mediatype || o.from || o.to);

async function search(opts, page, push) {
  if (!hasCriteria(opts)) {
    setStatus(t('need_query'), 'warn');
    return;
  }
  state.opts = opts;
  state.page = page;
  if (push) {
    const qs = toParams(opts, page).toString();
    history.pushState(null, '', qs ? '?' + qs : location.pathname);
  }
  if (state.controller) state.controller.abort();
  const controller = new AbortController();
  state.controller = controller;
  const timer = setTimeout(() => controller.abort('timeout'), 20000);

  setStatus(t('searching'), 'busy');
  $('results').setAttribute('aria-busy', 'true');
  try {
    const res = await fetch(Q.searchUrl(opts, page, ROWS), { signal: controller.signal });
    const data = await res.json();
    if (!res.ok || !data.response) throw new Error(data.error || 'HTTP ' + res.status);
    if (controller !== state.controller) return;
    render(data.response, opts, page);
  } catch (e) {
    if (controller !== state.controller) return;
    setStatus(controller.signal.aborted ? t('timeout') : t('error'), 'error');
    $('results').replaceChildren();
    $('pager').replaceChildren();
  } finally {
    clearTimeout(timer);
    $('results').removeAttribute('aria-busy');
  }
}

function setStatus(text, kind) {
  const s = $('status');
  s.textContent = text;
  s.className = 'status' + (kind ? ' ' + kind : '');
}

function render(resp, opts, page) {
  const total = resp.numFound || 0;
  const pages = Math.max(1, Math.ceil(Math.min(total, 10000) / ROWS));
  if (!total) {
    setStatus(t('none'), 'warn');
    $('results').replaceChildren();
    $('pager').replaceChildren();
    return;
  }
  setStatus((total === 1 ? t('found_one') : t('found', { n: nf().format(total) })) + (pages > 1 ? ' · ' + t('page_of', { p: page, t: nf().format(pages) }) : ''));
  $('results').replaceChildren(...resp.docs.map(doc => card(doc, opts)));
  renderPager(page, pages);
  if (page > 1 || window.scrollY > 400) $('status').scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function card(doc, opts) {
  const node = $('cardTpl').content.firstElementChild.cloneNode(true);
  const id = String(doc.identifier || '');
  const details = 'https://archive.org/details/' + encodeURIComponent(id);
  const title = String(first(doc.title) || '').trim() || t('untitled');
  const restricted = doc['access-restricted-item'] === true || doc['access-restricted-item'] === 'true';

  node.querySelector('.thumb').href = details;
  const img = node.querySelector('img');
  img.src = 'https://archive.org/services/img/' + encodeURIComponent(id);
  img.addEventListener('error', () => { img.closest('.thumb').classList.add('no-thumb'); img.remove(); });

  const a = node.querySelector('.title');
  a.href = details;
  a.textContent = title;
  a.title = title;

  const badges = node.querySelector('.badges');
  if (doc.mediatype) badges.append(el('span', 'badge type-' + String(doc.mediatype).replace(/\W/g, ''), t('type_' + doc.mediatype) !== 'type_' + doc.mediatype ? t('type_' + doc.mediatype) : String(doc.mediatype)));
  if (opts.format) badges.append(el('span', 'badge fmt', opts.format.toUpperCase()));
  if (restricted) badges.append(el('span', 'badge lend', t('lending')));

  const meta = [];
  const creator = first(doc.creator);
  if (creator) meta.push(String(creator).slice(0, 80));
  const year = doc.year || (doc.date ? String(doc.date).slice(0, 4) : '');
  if (year) meta.push(String(year));
  if (doc.downloads) meta.push(t('downloads', { n: nf().format(doc.downloads) }));
  if (doc.item_size) meta.push(fmtSize(doc.item_size));
  node.querySelector('.meta').textContent = meta.join(' · ');

  const btn = node.querySelector('.btn-files');
  const label = () => (opts.format ? t('show_files_fmt', { ext: opts.format === 'comic' ? 'cbr/cbz' : opts.format }) : t('show_files'));
  btn.textContent = label();
  btn.setAttribute('aria-expanded', 'false');
  const box = node.querySelector('.files');
  btn.addEventListener('click', () => toggleFiles(id, opts.format, restricted, box, btn, label));

  const det = node.querySelector('.details');
  det.href = details;
  det.textContent = t('details');
  return node;
}

async function toggleFiles(id, format, restricted, box, btn, label) {
  if (!box.hidden) {
    box.hidden = true;
    btn.textContent = label();
    btn.setAttribute('aria-expanded', 'false');
    return;
  }
  box.hidden = false;
  btn.textContent = t('hide_files');
  btn.setAttribute('aria-expanded', 'true');
  if (box.dataset.loaded) return;
  box.replaceChildren(el('p', 'files-msg', t('loading_files')));
  try {
    const res = await fetch('https://archive.org/metadata/' + encodeURIComponent(id) + '/files');
    const data = await res.json();
    const files = Q.pickFiles(data.result || data.files || [], format);
    const list = el('ul', 'file-list');
    files.slice(0, 40).forEach(f => {
      const li = el('li');
      const link = el('a', 'file-name', f.name);
      link.href = Q.downloadUrl(id, f.name);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = '';
      li.append(link, el('span', 'file-size', fmtSize(f.size)));
      if (f.format) li.append(el('span', 'file-fmt', f.format));
      list.append(li);
    });
    const parts = [];
    if (restricted) parts.push(el('p', 'files-msg warn', t('restricted_note')));
    if (!files.length) {
      parts.push(el('p', 'files-msg', format ? t('no_files', { ext: '.' + (format === 'comic' ? 'cbr/cbz' : format) }) : t('no_files_any')));
    } else {
      parts.push(list);
      if (files.length > 40) parts.push(el('p', 'files-msg', t('more_files', { n: files.length - 40 })));
    }
    box.replaceChildren(...parts);
    box.dataset.loaded = '1';
  } catch (e) {
    box.replaceChildren(el('p', 'files-msg error', t('files_error')));
  }
}

function renderPager(page, pages) {
  const nav = $('pager');
  nav.replaceChildren();
  if (pages <= 1) return;
  const go = p => () => search(state.opts, p, true);
  const prev = el('button', 'btn-ghost', t('prev'));
  prev.type = 'button';
  prev.disabled = page <= 1;
  prev.addEventListener('click', go(page - 1));
  const next = el('button', 'btn-ghost', t('next'));
  next.type = 'button';
  next.disabled = page >= pages;
  next.addEventListener('click', go(page + 1));
  nav.append(prev, el('span', 'pager-info', page + ' / ' + nf().format(pages)), next);
}

// ─── Pantalla inicial ───
const EXAMPLES = [
  { q: 'windows 95', format: 'iso' }, { q: 'jazz', format: 'flac' }, { q: 'nasa apollo', format: 'mp4' },
  { q: 'cervantes', format: 'epub' }, { q: 'doom', format: 'zip', mediatype: 'software' },
];

function renderWelcome() {
  setStatus('');
  $('pager').replaceChildren();
  const box = el('section', 'welcome');
  box.append(el('h2', null, t('help_title')), el('p', null, t('help_body')));
  const ex = el('div', 'examples');
  ex.append(el('span', null, t('examples')));
  EXAMPLES.forEach(o => {
    const b = el('button', 'chip', o.q + ' · ' + o.format.toUpperCase());
    b.type = 'button';
    b.addEventListener('click', () => { writeForm(Object.assign({ downloadable: true }, o)); search(readForm(), 1, true); });
    ex.append(b);
  });
  box.append(ex);
  $('results').replaceChildren(box);
}

function loadFromUrl() {
  const { opts, page } = fromParams(new URLSearchParams(location.search));
  writeForm(opts);
  if (hasCriteria(opts)) search(readForm(), page, false);
  else renderWelcome();
}

// ─── Inicio ───
document.addEventListener('DOMContentLoaded', () => {
  applyI18n();
  setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  $('searchForm').addEventListener('submit', e => {
    e.preventDefault();
    search(readForm(), 1, true);
  });
  $('langBtn').addEventListener('click', () => {
    state.lang = state.lang === 'es' ? 'en' : 'es';
    try { localStorage.setItem('ws_lang', state.lang); } catch (e) { /* sin almacenamiento */ }
    applyI18n();
    if (state.opts) search(state.opts, state.page, false);
    else renderWelcome();
  });
  $('themeBtn').addEventListener('click', () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
  window.addEventListener('popstate', loadFromUrl);
  loadFromUrl();
});
