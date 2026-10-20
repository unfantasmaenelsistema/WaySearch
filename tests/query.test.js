// Pruebas del constructor de consultas: node tests/query.test.js
'use strict';
const assert = require('assert');
const Q = require('../js/query.js');

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('  ✓ ' + name); };

test('MP4 se traduce a los nombres reales de formato', () => {
  assert.strictEqual(Q.buildQuery({ q: 'windows 95', format: 'mp4' }),
    '(windows AND 95) AND format:("MPEG4" OR "h.264" OR "h.264 IA" OR "512Kb MPEG4")');
});
test('EXE busca "Windows Executable"', () => {
  assert.ok(Q.buildQuery({ q: 'doom', format: 'exe' }).includes('"Windows Executable"'));
});
test('ya no se fuerza la frase exacta', () => {
  assert.strictEqual(Q.buildQuery({ q: 'jazz music' }), '(jazz AND music)');
  assert.strictEqual(Q.buildQuery({ q: 'jazz music', mode: 'any' }), '(jazz OR music)');
  assert.strictEqual(Q.buildQuery({ q: 'jazz music', mode: 'phrase' }), '"jazz music"');
});
test('las frases entre comillas se respetan', () => {
  assert.strictEqual(Q.buildQuery({ q: '"windows 95" iso' }), '("windows 95" AND iso)');
});
test('caracteres especiales van entrecomillados, sin barras', () => {
  const q = Q.buildQuery({ q: 'C++ ms-dos foo:bar (x)', scope: 'title' });
  assert.strictEqual(q, 'title:("C++" AND "ms-dos" AND "foo:bar" AND "(x)")');
  assert.ok(!q.includes(String.fromCharCode(92)));
});
test('operadores sueltos no rompen la consulta', () => {
  assert.strictEqual(Q.buildQuery({ q: 'AND OR' }), '("and" AND "or")');
});
test('comillas sueltas no rompen la consulta', () => {
  assert.strictEqual(Q.buildQuery({ q: 'a"b', mode: 'phrase' }), '"ab"');
  assert.strictEqual(Q.buildQuery({ q: '"abierta' }), 'abierta');
});
test('tipo, años y solo descargables', () => {
  assert.strictEqual(Q.buildQuery({ q: 'nasa', mediatype: 'movies', from: '1960', to: '1970', downloadable: true }),
    'nasa AND mediatype:(movies) AND year:[1960 TO 1970] AND NOT access-restricted-item:true');
});
test('tipo desconocido se ignora', () => {
  assert.strictEqual(Q.buildQuery({ q: 'x', mediatype: 'evil) OR (1' }), 'x');
});
test('solo filtros: consulta válida', () => {
  assert.strictEqual(Q.buildQuery({ format: 'iso' }), 'format:("ISO Image")');
  assert.strictEqual(Q.buildQuery({ downloadable: true }), '*:* AND NOT access-restricted-item:true');
  assert.strictEqual(Q.buildQuery({}), '');
});
test('URL con campos, orden y página', () => {
  const u = new URL(Q.searchUrl({ q: 'x', sort: 'downloads' }, 3, 24));
  assert.strictEqual(u.searchParams.get('page'), '3');
  assert.strictEqual(u.searchParams.getAll('sort[]')[0], 'downloads desc');
  assert.ok(u.searchParams.getAll('fl[]').includes('access-restricted-item'));
});
test('archivos: filtra por extensión y descarta metadatos', () => {
  const files = [
    { name: 'disco.iso', size: '700', source: 'original', format: 'ISO Image' },
    { name: 'x_meta.xml', source: 'original' }, { name: '__ia_thumb.jpg', source: 'original' },
    { name: 'video.mp4', size: '50', source: 'derivative' }, { name: 'otro.ISO', size: '900', source: 'original' },
  ];
  assert.deepStrictEqual(Q.pickFiles(files, 'iso').map(f => f.name), ['otro.ISO', 'disco.iso']);
  assert.deepStrictEqual(Q.pickFiles(files, '').map(f => f.name), ['otro.ISO', 'disco.iso']);
  assert.deepStrictEqual(Q.pickFiles(files, 'mp4').map(f => f.name), ['video.mp4']);
});
test('enlace de descarga codifica cada segmento', () => {
  assert.strictEqual(Q.downloadUrl('mi id', 'carpeta/a b#1.iso'), 'https://archive.org/download/mi%20id/carpeta/a%20b%231.iso');
});
console.log(`\n${n} pruebas correctas`);
