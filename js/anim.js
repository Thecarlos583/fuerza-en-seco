// Motor de animación de figura humana en SVG (100% offline).
// Cada pose son ángulos de articulación; el motor calcula la figura (cinemática directa),
// apoya el pie en el suelo y la interpola con requestAnimationFrame.
//
// Ángulos (grados), vista lateral mirando a la derecha:
//   torso: inclinación hacia adelante · cadera: flexión (muslo adelante) · rodilla: flexión (nunca negativa)
//   punta: pie en puntas (talón arriba) · hombro: flexión (brazo adelante/arriba; negativo = atrás) · codo: flexión
//   El sufijo 2 (cadera2, rodilla2…) es la pierna o brazo del fondo; si falta, copia al de adelante.
//   dx / dy: avance y altura del pie de apoyo sobre el suelo · ancho / valgo / juntas: vista de frente
import { ANIM } from './data.js';

const L = { torso: 38, cuello: 4, cabeza: 9, muslo: 33, pierna: 32, pie: 12, brazo: 22, ante: 20 };
const SUELO = 182;
const PARAMS = ['torso', 'cadera', 'rodilla', 'punta', 'hombro', 'codo', 'cadera2', 'rodilla2', 'punta2', 'hombro2', 'codo2', 'dx', 'dy', 'cabeza', 'ancho', 'valgo'];
const rad = g => g * Math.PI / 180;
const vec = (a, l) => [Math.sin(rad(a)) * l, Math.cos(rad(a)) * l];
const sum = (p, v) => [p[0] + v[0], p[1] + v[1]];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// Completa la pose: lo que falta en el lado 2 copia al lado 1; rodillas nunca al revés
function completar(p) {
  const q = { ...p, __ok: true };
  for (const k of ['cadera', 'rodilla', 'punta', 'hombro', 'codo']) { q[k] ??= 0; q[k + '2'] ??= q[k]; }
  for (const k of PARAMS) q[k] ??= 0;
  q.rodilla = Math.max(0, q.rodilla); q.rodilla2 = Math.max(0, q.rodilla2);
  q.codo = Math.max(0, q.codo); q.codo2 = Math.max(0, q.codo2);
  return q;
}

// Cinemática directa desde la cadera
function figura(p, def, fijo = null) {
  const t = p.torso;
  const cad = [0, 0];
  const hom = sum(cad, vec(180 - t, L.torso));
  const cab = sum(hom, vec(180 - t - p.cabeza, L.cuello + L.cabeza));
  const pierna = (h, k, pu) => {
    const am = -t + h, rod = sum(cad, vec(am, L.muslo));
    const ap = am - k, tob = sum(rod, vec(ap, L.pierna));
    const pie = 90 - pu;
    return { rod, tob, punta: sum(tob, vec(pie, L.pie)), talon: sum(tob, vec(pie, -4)) };
  };
  const brazo = (s, e) => {
    const ab = -t + s, cod = sum(hom, vec(ab, L.brazo));
    return { cod, mano: sum(cod, vec(ab + e, L.ante)), ang: ab + e };
  };
  const f = { cad, hom, cab, p1: pierna(p.cadera, p.rodilla, p.punta), p2: pierna(p.cadera2, p.rodilla2, p.punta2), b1: brazo(p.hombro, p.codo), b2: brazo(p.hombro2, p.codo2) };
  // Apoyo: el punto más bajo del pie de apoyo toca el suelo (o el cajón con dy); la punta no se desliza
  let ox, oy;
  if (fijo?.ox !== undefined) ({ ox, oy } = fijo);
  else {
    const pa = (fijo?.apoyo ?? p.apoyo ?? def.apoyo) === 2 ? f.p2 : f.p1;
    ox = (def.x0 ?? 110) + p.dx - pa.punta[0];
    oy = SUELO - p.dy - Math.max(pa.punta[1], pa.talon[1]);
  }
  const mover = pt => [pt[0] + ox, pt[1] + oy];
  const m = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? mover(v) : (typeof v === 'object' ? m(v) : v)]));
  return m(f);
}

function traslado(p, def) {
  const f = figura(p, def, { ox: 0, oy: 0 });
  const pa = (p.apoyo ?? def.apoyo) === 2 ? f.p2 : f.p1;
  return { ox: (def.x0 ?? 110) + p.dx - pa.punta[0], oy: SUELO - p.dy - Math.max(pa.punta[1], pa.talon[1]) };
}

// ── Dibujo ───────────────────────────────────────────────────
const ln = (a, b, cls) => `<line class="${cls}" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"/>`;
const pl = (pts, cls) => `<polyline class="${cls}" points="${pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}"/>`;

function mancuerna(c, ang, vertical) {
  const [x, y] = c;
  const r = vertical ? 0 : ang;
  return `<g class="equipo" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${vertical ? 0 : (-r).toFixed(0)})">
    <rect x="-1.3" y="-7" width="2.6" height="14" rx="1"/><rect x="-5" y="-9.5" width="10" height="4" rx="1.3"/><rect x="-5" y="5.5" width="10" height="4" rx="1.3"/></g>`;
}

function lado(p, def, punto, fijo) {
  const f = figura(p, def, fijo);
  const pierna = (x, cls) => pl([f.cad, x.rod, x.tob, x.punta], cls) + ln(x.tob, x.talon, cls);
  const brazo = (x, cls) => pl([f.hom, x.cod, x.mano], cls);
  let s = '';
  s += brazo(f.b2, 'hueso fondo') + pierna(f.p2, 'hueso fondo');
  s += ln(f.cad, f.hom, 'torso') + `<circle class="cabeza" cx="${f.cab[0].toFixed(1)}" cy="${f.cab[1].toFixed(1)}" r="${L.cabeza}"/>`;
  s += pierna(f.p1, 'hueso');
  s += brazo(f.b1, 'hueso');
  // Goblet: mancuerna parada, pegada al pecho. De lado, una mancuerna en la mano se ve de punta (disco).
  if (def.mano === 'goblet') s += mancuerna([f.b1.mano[0] + 2, f.b1.mano[1] + 7], 0, true);
  if (def.mano === 'mancuernas') s += `<g class="equipo"><circle cx="${f.b1.mano[0].toFixed(1)}" cy="${(f.b1.mano[1] + 3).toFixed(1)}" r="6.5"/><circle class="eje" cx="${f.b1.mano[0].toFixed(1)}" cy="${(f.b1.mano[1] + 3).toFixed(1)}" r="2"/></g>`;
  if (punto) s += marca(punto, {
    rodilla: f.p1.rod, cadera: f.cad, pies: f.p1.tob, hombro: f.hom, manos: f.b1.mano,
    espalda: [(f.cad[0] + f.hom[0]) / 2, (f.cad[1] + f.hom[1]) / 2],
  }, f);
  return s;
}

// Vista de frente: alturas de la vista lateral, anchos propios
function frente(p, def, punto, fijo) {
  const f = figura(p, def, fijo); // de frente solo se usan las alturas
  const CX = 120, s = [];
  const piernaF = (sg, x) => {
    const hx = CX + sg * 7, fx = CX + sg * (p.ancho || def.ancho || 11);
    const r = (x.rod[1] - f.cad[1]) / ((x.tob[1] - f.cad[1]) || 1);
    const enLinea = hx + (fx - hx) * r;
    const flex = clamp(p.rodilla / 90, 0, 1);
    const kx = enLinea + (fx + sg * 2 - enLinea) * flex - sg * p.valgo * flex;
    const suelo = Math.max(x.punta[1], x.talon[1]);
    return { rod: [kx, x.rod[1]], tob: [fx, x.tob[1]], pie: [fx + sg * 2, suelo - 2.5], cad: [hx, f.cad[1]] };
  };
  const izq = piernaF(-1, f.p1), der = piernaF(1, f.p2);
  const brazoF = (sg, x) => {
    const sx = CX + sg * 11;
    const mx = def.juntas ? CX + sg * 3 : sx + sg * 3;
    const ex = def.juntas ? CX + sg * 11 : sx + sg * 3;
    return { hom: [sx, f.hom[1]], cod: [ex, x.cod[1]], mano: [mx, x.mano[1]] };
  };
  const bi = brazoF(-1, f.b1), bd = brazoF(1, f.b2);
  for (const x of [izq, der]) s.push(pl([x.cad, x.rod, x.tob], 'hueso'), `<ellipse class="pie" cx="${x.pie[0].toFixed(1)}" cy="${x.pie[1].toFixed(1)}" rx="4.5" ry="2.5"/>`);
  s.push(ln(izq.cad, der.cad, 'hueso'), ln([CX, f.cad[1]], [CX, f.hom[1]], 'torso'), ln(bi.hom, bd.hom, 'hueso'));
  s.push(`<circle class="cabeza" cx="${CX}" cy="${f.cab[1].toFixed(1)}" r="${L.cabeza}"/>`);
  for (const x of [bi, bd]) s.push(pl([x.hom, x.cod, x.mano], 'hueso'));
  if (def.mano === 'goblet') s.push(`<g class="equipo"><rect x="${CX - 7}" y="${(bi.mano[1] + 2).toFixed(1)}" width="14" height="4" rx="1.3"/></g>`);
  if (punto) s.push(marca(punto, { rodilla: izq.rod, rodillas: [izq.rod, der.rod], pies: izq.pie, cadera: [CX, f.cad[1]], espalda: [CX, (f.cad[1] + f.hom[1]) / 2], hombro: bi.hom, manos: bi.mano }, f));
  return s.join('');
}

function marca(punto, pts, f) {
  const z = punto.zona === 'rodilla' && pts.rodillas ? pts.rodillas : [pts[punto.zona] || pts.cadera];
  let s = '';
  if (punto.zona === 'espalda' && f && !pts.rodillas) s += `<line class="marca-linea" x1="${f.cad[0].toFixed(1)}" y1="${f.cad[1].toFixed(1)}" x2="${f.hom[0].toFixed(1)}" y2="${f.hom[1].toFixed(1)}"/>`;
  for (const p of z) s += `<circle class="marca" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="9"/>`;
  return s;
}

function escena(def, vista) {
  const e = (def.equipo || []).map(q => {
    if (q.tipo === 'cajon') return vista === 'frente'
      ? `<rect class="cajon fr" x="78" y="${SUELO - q.alto}" width="84" height="${q.alto}" rx="4"/>`
      : `<rect class="cajon" x="${q.x}" y="${SUELO - q.alto}" width="${q.ancho}" height="${q.alto}" rx="4"/>`;
    return '';
  }).join('');
  return `<line class="suelo" x1="6" y1="${SUELO}" x2="234" y2="${SUELO}"/>${e}`;
}

export function dibujarPose(def, p, vista = 'lado', punto = null, fijo = null) {
  const q = p.__ok ? p : completar(p);
  return escena(def, vista) + (vista === 'frente' ? frente(q, def, punto, fijo) : lado(q, def, punto, fijo));
}

// ── Línea de tiempo ──────────────────────────────────────────
const suave = x => 0.5 - Math.cos(Math.PI * x) / 2;

function preparar(def) {
  const poses = def.poses.map(completar);
  const tramos = [];
  let t = 0;
  poses.forEach((p, i) => {
    const pausa = def.poses[i].pausa || 0, ms = def.poses[i].ms || 600;
    tramos.push({ i, ini: t, pausa, ms });
    t += pausa + ms;
  });
  return { def, poses, tramos, total: t, tras: poses.map(p => traslado(p, def)) };
}

function poseEn(prep, t) {
  t %= prep.total;
  const tr = prep.tramos.findLast(x => x.ini <= t) || prep.tramos[0];
  const a = prep.poses[tr.i], b = prep.poses[(tr.i + 1) % prep.poses.length];
  const local = t - tr.ini;
  if (local < tr.pausa) return { p: a, activa: tr.i, fijo: null };
  const f = suave(clamp((local - tr.pausa) / tr.ms, 0, 1));
  const p = { __ok: true };
  for (const k of PARAMS) p[k] = a[k] + (b[k] - a[k]) * f;
  // Mismo pie de apoyo: ese pie queda clavado. Si cambia, se interpola el traslado de la figura.
  const ap = x => x.apoyo ?? prep.def.apoyo ?? 1;
  let fijo = { apoyo: ap(a) };
  if (ap(a) !== ap(b)) { const ta = prep.tras[tr.i], tb = prep.tras[(tr.i + 1) % prep.poses.length]; fijo = { ox: ta.ox + (tb.ox - ta.ox) * f, oy: ta.oy + (tb.oy - ta.oy) * f }; }
  return { p, activa: f < 0.5 ? tr.i : (tr.i + 1) % prep.poses.length, fijo };
}

export const tieneAnimacion = e => !!ANIM[e];

// Monta el reproductor dentro de un contenedor
export function montar(cont, e) {
  const def = ANIM[e];
  if (!def) return;
  const prep = preparar(def);
  const vistas = def.vistas || ['lado'];
  const st = { t: 0, play: true, vel: 1, vista: vistas[0], ult: performance.now(), raf: 0, paso: null };
  cont.innerHTML = `
    <div class="anim">
      <svg class="anim-svg" viewBox="0 0 240 196" role="img" aria-label="Animación del ejercicio"><g class="anim-g"></g></svg>
      <p class="anim-punto" aria-live="polite"></p>
    </div>
    <div class="anim-ctrl">
      <button data-an="play" aria-label="Pausa"></button>
      <button data-an="vel">Lento 0,5×</button>
      <button data-an="prev" aria-label="Pose anterior">‹ Pose</button>
      <button data-an="next" aria-label="Pose siguiente">Pose ›</button>
      ${vistas.length > 1 ? '<button data-an="vista" class="vista">Ver de frente</button>' : ''}
    </div>
    <div class="anim-poses">${def.poses.map((p, i) => `<button data-an="ir" data-i="${i}"><svg viewBox="0 0 240 196">${dibujarPose(def, p)}</svg><b>${i + 1}</b><span>${p.n || ''}</span></button>`).join('')}</div>`;
  const g = cont.querySelector('.anim-g'), txt = cont.querySelector('.anim-punto');
  const bPlay = cont.querySelector('[data-an=play]');
  const icoPlay = () => { bPlay.innerHTML = st.play ? '❚❚ Pausa' : '▶ Seguir'; };
  icoPlay();

  let ultActiva = -1;
  const pintar = () => {
    const { p, activa, fijo } = st.paso !== null ? { p: prep.poses[st.paso], activa: st.paso, fijo: null } : poseEn(prep, st.t);
    const punto = def.poses[activa].punto || null;
    g.innerHTML = dibujarPose(def, p, st.vista, punto, fijo);
    if (activa !== ultActiva) {
      ultActiva = activa;
      txt.textContent = punto ? punto.txt : (def.poses[activa].n || '');
      txt.classList.toggle('alerta', !!punto);
      cont.querySelectorAll('.anim-poses button').forEach((b, i) => b.classList.toggle('act', i === activa));
    }
  };
  const bucle = ahora => {
    if (!cont.isConnected) return;
    if (st.play) st.t += (ahora - st.ult) * st.vel;
    st.ult = ahora;
    pintar();
    st.raf = requestAnimationFrame(bucle);
  };
  st.raf = requestAnimationFrame(bucle);

  cont.onclick = ev => {
    const b = ev.target.closest('[data-an]');
    if (!b) return;
    const a = b.dataset.an;
    if (a === 'play') { st.play = !st.play; if (st.play) st.paso = null; icoPlay(); }
    if (a === 'vel') { st.vel = st.vel === 1 ? 0.5 : 1; b.textContent = st.vel === 1 ? 'Lento 0,5×' : 'Lento ✓'; b.classList.toggle('act', st.vel !== 1); }
    if (a === 'vista') { const i = (vistas.indexOf(st.vista) + 1) % vistas.length; st.vista = vistas[i]; b.textContent = st.vista === 'frente' ? 'Ver de lado' : 'Ver de frente'; ultActiva = -1; }
    if (a === 'prev' || a === 'next' || a === 'ir') {
      st.play = false; icoPlay();
      const n = def.poses.length;
      const base = st.paso ?? poseEn(prep, st.t).activa;
      st.paso = a === 'ir' ? Number(b.dataset.i) : (base + (a === 'next' ? 1 : -1) + n) % n;
      st.t = prep.tramos[st.paso].ini;
      ultActiva = -1;
    }
  };
}
