// Arranque, navegación entre pantallas y service worker
import { C } from './store.js';
import { $, ico, desbloquearAudio, pantallaEncendida, cerrarHoja } from './util.js';
import { hoy } from './fechas.js';
import { renderHoy } from './hoy.js';
import { renderGuia } from './guia.js';
import { renderAjustes, renderBienvenida } from './ajustes.js';
import { initTimer } from './timer.js';
import './app-instalar.js';

const TABS = [['hoy', 'Hoy'], ['guia', 'Guía'], ['ajustes', 'Ajustes']];
const vista = $('#vista');
let ruta = '', fechaPintada = null;

$('#tabs').innerHTML = TABS.map(([v, t]) => `<button data-v="${v}">${ico(v)}<span>${t}</span></button>`).join('');

function ir({ arriba = true } = {}) {
  let [v, ...rest] = location.hash.slice(1).split('/');
  if (!C()) v = 'bienvenida';
  else if (v === 'bienvenida' || v === 'sesion' || !v) v = 'hoy';
  ruta = v;
  fechaPintada = hoy();
  cerrarHoja();
  vista.onclick = null;
  document.body.classList.toggle('sin-tabs', v === 'bienvenida');
  if (v !== 'hoy') pantallaEncendida(false);
  $$tabs(v);
  vista.classList.remove('entra'); void vista.offsetWidth; vista.classList.add('entra');
  if (v === 'guia') renderGuia(vista, rest[0]);
  else if (v === 'ajustes') renderAjustes(vista);
  else if (v === 'bienvenida') renderBienvenida(vista);
  else { ruta = 'hoy'; renderHoy(vista); }
  if (arriba) scrollTo(0, 0);
}

function $$tabs(v) {
  document.querySelectorAll('#tabs [data-v]').forEach(b => {
    const on = b.dataset.v === v;
    b.classList.toggle('act', on);
    b.setAttribute('aria-current', on ? 'page' : 'false');
  });
}

$('#tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-v]');
  if (!b) return;
  if (b.dataset.v === ruta) scrollTo({ top: 0, behavior: 'smooth' });
  else location.hash = b.dataset.v;
});
addEventListener('hashchange', () => ir());
// Refrescar la pantalla actual sin moverla (solo las que no tienen estado en curso)
addEventListener('fs:refrescar', () => ir({ arriba: false }));

// El audio solo puede sonar después de un toque
addEventListener('pointerdown', desbloquearAudio, { passive: true });

// Si la app queda abierta y cambia el día (medianoche), se actualiza sola
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && fechaPintada !== hoy()) ir({ arriba: false });
});

initTimer();
ir();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => { });
}
navigator.storage?.persist?.().catch(() => { });
