import { S } from './store.js';
import { TRANSFER } from './data.js';

export const $ = (sel, raiz = document) => raiz.querySelector(sel);
export const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
export const fmt = s => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
export const num = n => String(n).replace('.', ',');
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const ajustes = () => S().config || {};

// ── Íconos (trazo, 24×24) ───────────────────────────────────
const P = {
  hoy: '<path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><circle cx="12" cy="6" r="3"/>',
  guia: '<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v14H7.5A2.5 2.5 0 0 0 5 19.5z"/><path d="M5 19.5A2.5 2.5 0 0 0 7.5 22H19v-5"/>',
  ajustes: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  cambiar: '<path d="M7 3L3 7l4 4"/><path d="M3 7h13a4 4 0 0 1 4 4"/><path d="M17 21l4-4-4-4"/><path d="M21 17H8a4 4 0 0 1-4-4"/>',
  abajo: '<path d="M6 9l6 6 6-6"/>',
  atras: '<path d="M15 6l-6 6 6 6"/>',
  play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
  pausa: '<path d="M8 5v14M16 5v14"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  fuego: '<path d="M12 22c4.4 0 7.5-3 7.5-7.2 0-3.6-2.3-6-4.1-8.3-.1 2.3-1.2 3.6-2.6 3.6C11 10.1 12.3 5.5 9 2.5 9 6.6 4.5 9.3 4.5 14.8 4.5 19 7.8 22 12 22z"/>',
  luna: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  reloj: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  trofeo: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  menos: '<path d="M5 12h14"/>',
  casa: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  alto: '<path d="M8 2h8l6 6v8l-6 6H8l-6-6V8z"/><path d="M12 7v6M12 16.5v.5"/>',
  mano: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11V4a1.5 1.5 0 0 1 3 0v7"/><path d="M14 11V5.5a1.5 1.5 0 0 1 3 0V13"/><path d="M17 9.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L3.3 14a1.6 1.6 0 0 1 2.7-1.7L8 15"/>',
  candado: '<rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  salto: '<path d="M12 3v10"/><path d="M8 7l4-4 4 4"/><path d="M5 21c2-3 4.5-4 7-4s5 1 7 4"/>',
  mover: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M10 15h6M14 13l2 2-2 2"/>',
  piscina: '<path d="M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8M8 12.5h8"/>',
  ojo: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  copiar: '<rect x="8" y="8" width="13" height="13" rx="2.5"/><path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-8A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8"/>',
  camara: '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6H8l1.5-2h5L16 6h2.5A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="12.5" r="3.5"/>',
  descargar: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  bandera: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  marcas: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/>',
  progreso: '<path d="M4 4v16h16"/><path d="M8 15l3.5-4 3 2.5L20 7"/>',
  entrenador: '<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  corazon: '<path d="M12 20s-7.5-4.5-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.5-7.5 10-7.5 10z"/>',
};
export const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

export const chipTransfer = k => {
  const t = TRANSFER[k];
  return t ? `<span class="tr" style="--c:${t.c}"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${t.i}</svg>${t.n}</span>` : '';
};

// ── Vibración (Android) ─────────────────────────────────────
export function vibrar(patron = 18) {
  if (ajustes().vibracion === false) return;
  try { navigator.vibrate?.(patron); } catch { }
}

// ── Sonido (Web Audio, sin archivos) ────────────────────────
let actx = null;
// Un único AudioContext: se crea y se desbloquea dentro del primer toque del usuario (Chrome Android lo exige)
export function desbloquearAudio() {
  try {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      actx = new AC({ latencyHint: 'interactive' });
      window.__fsAudio = () => actx.state; // para las pruebas automáticas
    }
    if (actx.state !== 'running') actx.resume().catch(() => { });
    // Un sonido vacío termina de "despertar" la salida de audio en algunos Android
    const b = actx.createBuffer(1, 1, 22050), src = actx.createBufferSource();
    src.buffer = b; src.connect(actx.destination); src.start(0);
  } catch { }
}
export function pitido(freq = 880, dur = 0.14, en = 0, vol = 0.3) {
  if (ajustes().sonido === false || !actx) return;
  if (actx.state !== 'running') { actx.resume().then(() => pitido(freq, dur, en, vol)).catch(() => { }); return; }
  const t = actx.currentTime + en, o = actx.createOscillator(), g = actx.createGain();
  o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(actx.destination);
  o.start(t); o.stop(t + dur + 0.03);
}
export const sonar = {
  serie: () => pitido(1175, 0.07, 0, 0.12),
  tic: () => pitido(740, 0.08, 0, 0.2),
  fin: () => { pitido(880, 0.16); pitido(880, 0.16, 0.24); pitido(1320, 0.4, 0.48); },
  ya: () => { pitido(988, 0.12); pitido(1319, 0.3, 0.16); },
  logro: () => [523, 659, 784, 1047].forEach((f, i) => pitido(f, 0.22, i * 0.11, 0.22)),
};

// ── Pantalla encendida durante la sesión ────────────────────
let lock = null, quiero = false;
export async function pantallaEncendida(on) {
  quiero = on;
  try {
    if (quiero && 'wakeLock' in navigator && !lock && document.visibilityState === 'visible') {
      lock = await navigator.wakeLock.request('screen');
      lock.addEventListener('release', () => { lock = null; });
    } else if (!quiero && lock) { await lock.release(); lock = null; }
  } catch { lock = null; }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && quiero) pantallaEncendida(true); });

// ── Aviso breve ─────────────────────────────────────────────
let tt;
export function aviso(msg, icono = '', ms = 2800) {
  const t = $('#aviso');
  t.innerHTML = (icono ? ico(icono) : '') + `<span>${msg}</span>`;
  t.classList.add('visible');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('visible'), ms);
}

// ── Hoja inferior ───────────────────────────────────────────
export function abrirHoja(html, { alCerrar } = {}) {
  const raiz = $('#hoja');
  raiz.innerHTML = `<div class="hoja-fondo" data-cerrar></div><section class="hoja" role="dialog" aria-modal="true"><div class="hoja-asa"></div>${html}</section>`;
  raiz.hidden = false;
  raiz._alCerrar = alCerrar;
  requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.add('abierta')));
  raiz.querySelector('[data-cerrar]').onclick = cerrarHoja;
  const h = raiz.querySelector('.hoja');
  arrastrarParaCerrar(h);
  return h;
}
export function cerrarHoja() {
  const raiz = $('#hoja');
  if (raiz.hidden) return;
  raiz.classList.remove('abierta');
  const cb = raiz._alCerrar; raiz._alCerrar = null;
  setTimeout(() => { if (!raiz.classList.contains('abierta')) { raiz.hidden = true; raiz.innerHTML = ''; } }, 300);
  cb?.();
}
function arrastrarParaCerrar(h) {
  let y0 = null, dy = 0;
  h.addEventListener('touchstart', e => { if (h.scrollTop <= 0) { y0 = e.touches[0].clientY; dy = 0; h.style.transition = 'none'; } }, { passive: true });
  h.addEventListener('touchmove', e => {
    if (y0 === null) return;
    dy = Math.max(0, e.touches[0].clientY - y0);
    if (dy > 0) h.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  h.addEventListener('touchend', () => {
    if (y0 === null) return;
    h.style.transition = ''; h.style.transform = '';
    if (dy > 110) cerrarHoja();
    y0 = null;
  });
}

// Modo ligero (por defecto) o "reducir movimiento" del sistema: sin burbujas ni confeti
export const ligero = () => ajustes().ligero !== false || matchMedia('(prefers-reduced-motion: reduce)').matches;
const sinMovimiento = ligero;

// ── Confeti: "llegada a la pared" ───────────────────────────
export function confeti(grande = true) {
  if (sinMovimiento()) return;
  const c = $('#confeti'), ctx = c.getContext('2d'), dpr = devicePixelRatio || 1;
  const W = innerWidth, H = innerHeight;
  c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = ['#00D1FF', '#1DE9B6', '#FFD166', '#FF6B6B', '#F2F8FF', '#7C9CFF'];
  const ps = Array.from({ length: grande ? 140 : 60 }, (_, i) => ({
    x: W / 2 + (Math.random() - 0.5) * 80, y: H * 0.4,
    vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 12 - 5,
    r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
    w: 5 + Math.random() * 6, h: 3 + Math.random() * 4, c: cols[i % cols.length],
  }));
  const t0 = performance.now(), DUR = 3000;
  (function cuadro(t) {
    const el = t - t0;
    ctx.clearRect(0, 0, W, H);
    for (const p of ps) {
      p.vy += 0.3; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.globalAlpha = Math.max(0, 1 - el / DUR);
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 1);
      ctx.restore();
    }
    if (el < DUR) requestAnimationFrame(cuadro); else ctx.clearRect(0, 0, W, H);
  })(t0);
}

// ── Burbujas que suben desde un elemento ────────────────────
export function burbujas(el, n = 7) {
  if (sinMovimiento() || !el) return;
  const r = el.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const b = document.createElement('span');
    b.className = 'burbuja';
    const t = 6 + Math.random() * 10;
    b.style.cssText = `left:${r.left + r.width / 2 + (Math.random() - 0.5) * r.width}px;top:${r.top + r.height / 2}px;width:${t}px;height:${t}px;--dx:${(Math.random() - 0.5) * 40}px;animation-delay:${i * 40}ms`;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1300 + i * 40);
  }
}

// Número estable por fecha, para elegir frases sin que cambien al recargar
export const semilla = f => [...f].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);

// Notificación local cuando la app está en segundo plano (mejor esfuerzo, necesita permiso)
export function notificar(titulo, cuerpo) {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted' || document.visibilityState === 'visible') return;
    navigator.serviceWorker?.ready.then(r => r.showNotification(titulo, { body: cuerpo, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', vibrate: [200, 100, 200], tag: 'fs-timer', renotify: true })).catch(() => { });
  } catch { }
}

// Tema: automático (sigue al teléfono), oscuro o claro. Ajusta también la barra de estado.
const mqClaro = matchMedia('(prefers-color-scheme: light)');
export function aplicarTema(t = ajustes().tema || 'auto') {
  const c = t === 'auto' ? (mqClaro.matches ? 'claro' : 'oscuro') : t;
  document.documentElement.dataset.tema = c;
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', c === 'claro' ? '#F2F8FF' : '#06142B');
  document.querySelector('meta[name=color-scheme]')?.setAttribute('content', c === 'claro' ? 'only light' : 'dark light');
}
mqClaro.addEventListener?.('change', () => aplicarTema());
