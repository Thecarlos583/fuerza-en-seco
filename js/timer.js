// Temporizadores: descanso (círculo que se llena como una ola) y trabajo (cuenta regresiva grande).
// Se basan en la hora de fin, así que siguen exactos aunque se bloquee el teléfono.
import { S, guardar } from './store.js';
import { $, fmt, sonar, vibrar } from './util.js';

// ── Descanso ─────────────────────────────────────────────────
let t = null, raf = 0, ultimoSeg = null, terminando = false, grande = false;

export const descansoActivo = () => !!t;

export function iniciarDescanso(seg, titulo, sub = '') {
  if (!seg) return;
  t = { fin: Date.now() + seg * 1000, total: seg, titulo, sub };
  S().timer = t; guardar();
  terminando = false; ultimoSeg = null;
  $('#descanso').classList.remove('listo'); $('#mini').classList.remove('listo');
  mostrar(true);
  bucle();
}

function restaurar() {
  const x = S().timer;
  if (x && x.fin > Date.now()) { t = x; mostrar(false); bucle(); }
  else if (x) { S().timer = null; guardar(); }
}

function mostrar(g) {
  grande = g;
  const d = $('#descanso');
  if (g) {
    d.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('abierto')));
  } else {
    d.classList.remove('abierto');
    setTimeout(() => { if (!grande) d.hidden = true; }, 280);
  }
  $('#mini').hidden = g || !t;
  document.body.classList.toggle('con-mini', !g && !!t);
  if (t) {
    $('#descanso .descanso-titulo').textContent = t.titulo;
    $('#descanso .descanso-sub').textContent = t.sub;
    $('#descanso .descanso-sub').hidden = !t.sub;
    $('#mini .mini-txt').textContent = t.titulo;
  }
  pintar();
}

function pintar() {
  if (!t) return;
  const resta = (t.fin - Date.now()) / 1000;
  const frac = Math.min(1, Math.max(0, 1 - resta / t.total));
  // La ola sube desde abajo a medida que pasa el descanso
  $('#ola-agua').style.transform = `translateY(${(1 - frac) * 100}%)`;
  const txt = terminando ? '¡Dale!' : fmt(resta);
  $('#descanso .reloj-num').textContent = txt;
  $('#mini .mini-num').textContent = txt;
  $('#mini .mini-barra').style.transform = `scaleX(${frac})`;
  const seg = Math.ceil(resta);
  if (seg !== ultimoSeg) {
    if (seg <= 3 && seg > 0 && ultimoSeg !== null) sonar.tic();
    ultimoSeg = seg;
  }
  if (resta <= 0) terminar();
}

function bucle() {
  cancelAnimationFrame(raf);
  const paso = () => { pintar(); if (t && !terminando) raf = requestAnimationFrame(paso); };
  raf = requestAnimationFrame(paso);
}

function terminar() {
  if (terminando) return;
  terminando = true;
  $('#descanso').classList.add('listo'); $('#mini').classList.add('listo');
  sonar.fin();
  vibrar([260, 120, 260]);
  setTimeout(cerrar, 1600);
}

export function cerrarDescanso() { if (t) cerrar(); }
function cerrar() {
  cancelAnimationFrame(raf);
  t = null; terminando = false;
  S().timer = null; guardar();
  mostrar(false);
}

function ajustar(d) {
  if (!t || terminando) return;
  t.fin += d * 1000;
  if (d > 0) t.total += d;
  if (t.fin < Date.now()) t.fin = Date.now();
  S().timer = t; guardar();
  vibrar();
  pintar();
}

// ── Trabajo (planchas, isométricos, tiempos) ─────────────────
let w = null, wraf = 0;

// tramos: [{ tipo: 'prep' | 'trabajo' | 'cambio', s, txt }]
export function iniciarTrabajo(nombre, tramos, alTerminar) {
  w = { nombre, tramos, i: 0, fin: Date.now() + tramos[0].s * 1000, pausa: null, alTerminar, ultimo: null };
  const el = $('#trabajo');
  el.hidden = false;
  el.classList.remove('fin', 'pausada');
  requestAnimationFrame(() => el.classList.add('abierto'));
  $('#tr-nombre').textContent = nombre;
  pintarTramo();
  wbucle();
}

function pintarTramo() {
  const tr = w.tramos[w.i];
  const el = $('#trabajo');
  el.dataset.tipo = tr.tipo;
  $('#tr-fase').textContent = tr.tipo === 'prep' ? 'Prepárate' : tr.tipo === 'cambio' ? 'Cambia de lado' : '¡Aguanta!';
  $('#tr-lado').textContent = tr.txt || '';
  const resto = w.tramos.filter((x, k) => k > w.i && x.tipo === 'trabajo').length;
  $('#tr-sig').textContent = resto ? `Después: ${w.tramos.slice(w.i + 1).find(x => x.tipo === 'trabajo').txt || 'otra vez'}` : '';
}

function wpintar() {
  if (!w || w.pausa) return;
  const tr = w.tramos[w.i];
  const resta = (w.fin - Date.now()) / 1000;
  const seg = Math.ceil(resta);
  $('#tr-reloj').textContent = Math.max(0, seg);
  $('#tr-barra').style.transform = `scaleX(${Math.max(0, resta / tr.s)})`;
  if (seg !== w.ultimo) {
    if (seg <= 3 && seg > 0 && w.ultimo !== null) { sonar.tic(); vibrar(30); }
    w.ultimo = seg;
  }
  if (resta <= 0) {
    w.i++;
    if (w.i >= w.tramos.length) return wterminar(true);
    w.fin = Date.now() + w.tramos[w.i].s * 1000; w.ultimo = null;
    sonar.ya(); vibrar([200, 80, 200]);
    pintarTramo();
  }
}

function wbucle() {
  cancelAnimationFrame(wraf);
  const paso = () => { wpintar(); if (w) wraf = requestAnimationFrame(paso); };
  wraf = requestAnimationFrame(paso);
}

function wterminar(ok) {
  cancelAnimationFrame(wraf);
  const cb = w?.alTerminar;
  const el = $('#trabajo');
  if (ok) {
    el.classList.add('fin');
    $('#tr-fase').textContent = '¡Listo!';
    $('#tr-reloj').textContent = '✓';
    $('#tr-lado').textContent = ''; $('#tr-sig').textContent = '';
    sonar.fin(); vibrar([260, 120, 260]);
  }
  w = null;
  setTimeout(() => {
    el.classList.remove('abierto');
    setTimeout(() => { if (!w) el.hidden = true; }, 300);
    cb?.(ok);
  }, ok ? 900 : 0);
}

function wpausa() {
  if (!w) return;
  const el = $('#trabajo');
  if (w.pausa) { w.fin = Date.now() + w.pausa; w.pausa = null; el.classList.remove('pausada'); wbucle(); }
  else { w.pausa = w.fin - Date.now(); el.classList.add('pausada'); }
  $('#tr-pausa').innerHTML = w.pausa ? 'Seguir' : 'Pausa';
}

export function initTimer() {
  $('#descanso').addEventListener('click', e => {
    const b = e.target.closest('[data-t]');
    if (!b) return;
    const a = b.dataset.t;
    if (a === 'min') mostrar(false);
    else if (a === 'saltar') { vibrar(); cerrar(); }
    else ajustar(Number(a));
  });
  $('#mini').addEventListener('click', () => { if (t) mostrar(true); });
  $('#trabajo').addEventListener('click', e => {
    const b = e.target.closest('[data-w]');
    if (!b) return;
    if (b.dataset.w === 'pausa') wpausa();
    if (b.dataset.w === 'listo') { if (w) wterminar(true); }
    if (b.dataset.w === 'cerrar') { if (w) wterminar(false); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (t) { pintar(); bucle(); }
    if (w && !w.pausa) wbucle();
  });
  restaurar();
}
