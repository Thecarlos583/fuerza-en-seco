// Motor de animación de figura humana en SVG (100% offline).
// Cada pose son ángulos de articulación; el motor calcula la figura (cinemática directa),
// la apoya (pie, cuerpo acostado o asiento) y la interpola con requestAnimationFrame.
//
// Ángulos (grados), vista lateral mirando a la derecha:
//   torso: inclinación adelante (negativo = hacia atrás) · cadera: flexión · rodilla: flexión (nunca negativa)
//   punta: pie en puntas · hombro: flexión (negativo = atrás) · codo: flexión · cabeza: inclinación
//   giro: rota toda la figura (−90 = boca arriba con la cabeza a la izquierda, 90 = boca abajo)
//   Sufijo 2 (cadera2, hombro2…) = pierna o brazo del fondo; si falta, copia al de adelante.
//   dx / dy: avance y altura · bal: balón en las manos (0 = ya lo soltó)
// Vista de frente: ancho (separación de pies), valgo (rodillas adentro), lat (desplazamiento lateral),
//   hF / cF: abducción del brazo y flexión del codo · rF: rotación externa del antebrazo
// Apoyo (def.apoyo o pose.apoyo): 1 / 2 = pie de adelante / del fondo · 'cuerpo' = lo más bajo toca el suelo
// def.ancla = 'cadera': la cadera queda fija en (x0 + dx, y0 − dy), para máquinas con asiento.
// curva: espalda redonda (+) o hundida (−) · tr: giro del tronco visto de frente · cu: vuelta de la cuerda
// def.vuelta = ['hombro', …]: esos ángulos dan la vuelta completa (círculos) por el camino más corto.
import { ANIM } from './poses.js';

const L = { torso: 38, cuello: 4, cabeza: 9, muslo: 33, pierna: 32, pie: 12, brazo: 22, ante: 20 };
export const SUELO = 182;
const PARAMS = ['torso', 'cadera', 'rodilla', 'punta', 'hombro', 'codo', 'cadera2', 'rodilla2', 'punta2', 'hombro2', 'codo2',
  'dx', 'dy', 'cabeza', 'giro', 'ancho', 'valgo', 'lat', 'rodLat', 'hF', 'cF', 'rF', 'hF2', 'cF2', 'rF2', 'bal', 'curva', 'tr', 'cu'];
const rad = g => g * Math.PI / 180;
const vec = (a, l) => [Math.sin(rad(a)) * l, Math.cos(rad(a)) * l];
const sum = (p, v) => [p[0] + v[0], p[1] + v[1]];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const f1 = n => n.toFixed(1);

// Completa la pose: lo que falta del lado 2 copia al lado 1; rodillas y codos nunca al revés
function completar(p, def = {}) {
  const q = { ...p, __ok: true };
  for (const k of ['cadera', 'rodilla', 'punta', 'hombro', 'codo', 'hF', 'cF', 'rF']) { q[k] ??= 0; q[k + '2'] ??= q[k]; }
  q.bal ??= def.mano === 'balon' ? 1 : 0;
  q.ancho ??= def.ancho ?? 11;
  for (const k of PARAMS) q[k] ??= 0;
  // Rangos humanos: la rodilla y el codo nunca se doblan al revés ni más allá de lo posible
  for (const k of ['rodilla', 'rodilla2']) q[k] = clamp(q[k], 0, 140);
  for (const k of ['codo', 'codo2']) q[k] = clamp(q[k], 0, 145);
  for (const k of ['cadera', 'cadera2']) q[k] = clamp(q[k], -40, 140);
  return q;
}

// Cinemática directa desde la cadera (en coordenadas locales)
function local(p) {
  const t = p.torso;
  const cad = [0, 0];
  const hom = vec(180 - t, L.torso);
  const cab = sum(hom, vec(180 - t - p.cabeza, L.cuello + L.cabeza));
  const pierna = (h, k, pu) => {
    const am = -t + h, rod = vec(am, L.muslo);
    const tob = sum(rod, vec(am - k, L.pierna));
    const pie = 90 - pu;
    return { rod, tob, punta: sum(tob, vec(pie, L.pie)), talon: sum(tob, vec(pie, -4)) };
  };
  const brazo = (s, e) => {
    const ab = -t + s, cod = sum(hom, vec(ab, L.brazo));
    return { cod, mano: sum(cod, vec(ab + e, L.ante)) };
  };
  let f = { cad, hom, cab, p1: pierna(p.cadera, p.rodilla, p.punta), p2: pierna(p.cadera2, p.rodilla2, p.punta2), b1: brazo(p.hombro, p.codo), b2: brazo(p.hombro2, p.codo2) };
  if (p.giro) {
    const c = Math.cos(rad(p.giro)), s = Math.sin(rad(p.giro));
    f = mapear(f, ([x, y]) => [x * c - y * s, x * s + y * c]);
  }
  return f;
}
const mapear = (o, fn) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Array.isArray(v) ? fn(v) : mapear(v, fn)]));

function puntos(f) {
  return [f.cad, f.hom, [f.cab[0], f.cab[1] + L.cabeza - 3], f.p1.rod, f.p1.tob, f.p1.punta, f.p1.talon, f.p2.rod, f.p2.tob, f.p2.punta, f.p2.talon, f.b1.cod, f.b1.mano, f.b2.cod, f.b2.mano];
}

// Dónde va la figura: pie clavado, cuerpo acostado o cadera fija en un asiento
function anclar(f, p, def, apoyo) {
  if (def.ancla === 'cadera') return { ox: (def.x0 ?? 110) + p.dx, oy: (def.y0 ?? 120) - p.dy };
  if (apoyo === 'cuerpo') {
    const bajo = Math.max(...puntos(f).map(q => q[1])) + 3;
    return { ox: (def.x0 ?? 110) + p.dx, oy: SUELO - p.dy - bajo };
  }
  const pa = apoyo === 2 ? f.p2 : f.p1;
  // def.puntas: se apoya solo la punta (talones colgando de un escalón)
  return { ox: (def.x0 ?? 110) + p.dx - pa.punta[0], oy: SUELO - p.dy - (def.puntas ? pa.punta[1] : Math.max(pa.punta[1], pa.talon[1])) };
}

function figura(p, def, fijo = null) {
  const f = local(p);
  const o = fijo?.ox !== undefined ? fijo : anclar(f, p, def, fijo?.apoyo ?? p.apoyo ?? def.apoyo ?? 1);
  return mapear(f, ([x, y]) => [x + o.ox, y + o.oy]);
}
const traslado = (p, def) => anclar(local(p), p, def, p.apoyo ?? def.apoyo ?? 1);

// ── Dibujo ───────────────────────────────────────────────────
const ln = (a, b, cls) => `<line class="${cls}" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;
const pl = (pts, cls) => `<polyline class="${cls}" points="${pts.map(q => q.map(f1).join(',')).join(' ')}"/>`;
const medio = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function mancuerna([x, y]) {
  return `<g class="equipo" transform="translate(${f1(x)} ${f1(y)})"><rect x="-1.3" y="-7" width="2.6" height="14" rx="1"/><rect x="-5" y="-9.5" width="10" height="4" rx="1.3"/><rect x="-5" y="5.5" width="10" height="4" rx="1.3"/></g>`;
}
const disco = ([x, y], r = 6.5) => `<g class="equipo"><circle cx="${f1(x)}" cy="${f1(y)}" r="${r}"/><circle class="eje" cx="${f1(x)}" cy="${f1(y)}" r="2"/></g>`;

// Equipo fijo (detrás de la figura)
function equipoFijo(def, vista) {
  return (def.equipo || []).map(q => {
    if (q.vista && q.vista !== vista) return '';
    switch (q.tipo) {
      case 'cajon': return vista === 'frente'
        ? `<rect class="cajon fr" x="78" y="${SUELO - q.alto}" width="84" height="${q.alto}" rx="4"/>`
        : `<rect class="cajon" x="${q.x}" y="${SUELO - q.alto}" width="${q.ancho}" height="${q.alto}" rx="4"/>`;
      case 'banco': return `<rect class="banco" x="${q.x}" y="${SUELO - q.alto}" width="${q.ancho}" height="6" rx="3"/><line class="pata" x1="${q.x + 6}" y1="${SUELO - q.alto + 6}" x2="${q.x + 6}" y2="${SUELO}"/><line class="pata" x1="${q.x + q.ancho - 6}" y1="${SUELO - q.alto + 6}" x2="${q.x + q.ancho - 6}" y2="${SUELO}"/>`;
      case 'muro': return `<rect class="muro" x="${q.x}" y="30" width="8" height="${SUELO - 30}"/>`;
      case 'torre': return `<rect class="torre" x="${q.x - 5}" y="${q.y0 ?? 14}" width="10" height="${SUELO - (q.y0 ?? 14)}" rx="3"/>`;
      case 'poste': return `<line class="pata" x1="${q.x}" y1="${q.y}" x2="${q.x}" y2="${SUELO}"/>`;
      case 'barraFija': return `<line class="barra-fija" x1="${q.x1}" y1="${q.y}" x2="${q.x2}" y2="${q.y}"/><line class="pata" x1="${q.x1 + 4}" y1="${q.y}" x2="${q.x1 + 4}" y2="${SUELO}"/>`;
      case 'linea': return `<line class="maquina" x1="${q.x1}" y1="${q.y1}" x2="${q.x2}" y2="${q.y2}"/>`;
      case 'rect': return `<rect class="maquina-r" x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" rx="${q.r ?? 3}"/>`;
      case 'colchoneta': return `<rect class="colchoneta" x="${q.x}" y="${SUELO - 3}" width="${q.ancho}" height="3" rx="1.5"/>`;
      default: return '';
    }
  }).join('');
}

// Equipo que se mueve con la figura (cables, carro de la prensa, balón, barra)
function equipoMovil(def, f, p, vista) {
  let s = '';
  const mano = def.mano;
  for (const q of def.equipo || []) {
    if (q.vista && q.vista !== vista) continue;
    if (q.tipo === 'cable') {
      const h = q.mano === 2 ? f.b2.mano : vista === 'frente' && f.fm ? f.fm[q.lado ?? 1] : f.b1.mano;
      s += `<line class="cable" x1="${q.x}" y1="${q.y}" x2="${f1(h[0])}" y2="${f1(h[1])}"/><circle class="polea" cx="${q.x}" cy="${q.y}" r="4"/>`;
      if (q.agarre === 'cuerda') s += `<circle class="agarre" cx="${f1(h[0])}" cy="${f1(h[1])}" r="3.5"/>`;
      else s += `<rect class="agarre" x="${f1(h[0] - 2.5)}" y="${f1(h[1] - 5)}" width="5" height="10" rx="2"/>`;
    }
    if (q.tipo === 'banda') {
      const h = q.mano === 2 ? f.b2.mano : vista === 'frente' && f.fm ? (q.lado === 'medio' ? medio(f.fm[0], f.fm[1]) : f.fm[q.lado ?? 1]) : f.b1.mano;
      s += `<line class="banda" x1="${q.x}" y1="${q.y}" x2="${f1(h[0])}" y2="${f1(h[1])}"/><circle class="polea" cx="${q.x}" cy="${q.y}" r="2.5"/>`;
    }
    if (q.tipo === 'carro') {
      // Plataforma de la prensa: perpendicular al riel, apoyada en los pies
      const c = medio(f.p1.punta, f.p1.talon);
      const d = vec(q.riel, 1), n = [d[1], -d[0]];
      const a = [c[0] + n[0] * 16 + d[0] * 4, c[1] + n[1] * 16 + d[1] * 4], b = [c[0] - n[0] * 16 + d[0] * 4, c[1] - n[1] * 16 + d[1] * 4];
      s += `<line class="riel" x1="${f1(c[0] - d[0] * 60)}" y1="${f1(c[1] - d[1] * 60)}" x2="${f1(c[0] + d[0] * 40)}" y2="${f1(c[1] + d[1] * 40)}"/>`;
      s += `<line class="carro" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;
    }
    if (q.tipo === 'respaldo') {
      // Respaldo pegado a la espalda (asientos reclinados)
      const d = [f.hom[0] - f.cad[0], f.hom[1] - f.cad[1]], l = Math.hypot(...d) || 1, u = [d[0] / l, d[1] / l];
      const nrm = [-u[1] * (q.lado ?? -1) * 7, u[0] * (q.lado ?? -1) * 7];
      const a = [f.cad[0] + nrm[0] - u[0] * 4, f.cad[1] + nrm[1] - u[1] * 4], b = [f.hom[0] + nrm[0] + u[0] * 6, f.hom[1] + nrm[1] + u[1] * 6];
      s += `<line class="respaldo" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;
    }
    if (q.tipo === 'bandaRod') {
      s += vista === 'frente' && f.fr ? `<line class="banda" x1="${f1(f.fr[0][0])}" y1="${f1(f.fr[0][1] - 4)}" x2="${f1(f.fr[1][0])}" y2="${f1(f.fr[1][1] - 4)}"/>`
        : `<line class="banda" x1="${f1(f.p1.rod[0] - 3)}" y1="${f1(f.p1.rod[1] - 6)}" x2="${f1(f.p1.rod[0] + 3)}" y2="${f1(f.p1.rod[1] - 6)}"/>`;
    }
    if (q.tipo === 'cuerda') {
      // La cuerda va de mano a mano; su punto medio pasa bajo los pies (cu = 0) o sobre la cabeza (cu = 180)
      const [a, b] = vista === 'frente' && f.fm ? f.fm : [f.b1.mano, f.b2.mano];
      const m = medio(a, b), c = Math.cos(rad(p.cu));
      const ctrl = [m[0] + (vista === 'frente' ? 0 : Math.sin(rad(p.cu)) * 70), m[1] + (c > 0 ? c * 2 * (SUELO + 1 - m[1]) : c * 2 * (m[1] - f.cab[1] + 16))];
      s += `<path class="cuerda" d="M${f1(a[0])} ${f1(a[1])} Q${f1(ctrl[0])} ${f1(ctrl[1])} ${f1(b[0])} ${f1(b[1])}"/>`;
    }
    if (q.tipo === 'pesoCadera') s += disco([f.cad[0] + 2, f.cad[1] - 8], 7);
    if (q.tipo === 'balonPiso' && def.mano === 'balon' && p.bal <= 0.5) s += `<circle class="balon" cx="${q.x}" cy="${SUELO - 8}" r="8"/>`;
    if (q.tipo === 'objeto') { const r = q.en === 'rodilla' ? (vista === 'frente' && f.fr ? medio(f.fr[0], f.fr[1]) : f.p1.rod) : f.cad; s += `<circle class="balon" cx="${f1(r[0])}" cy="${f1(r[1] + (q.dy ?? 0))}" r="${q.r ?? 6}"/>`; }
    if (q.tipo === 'rodillo') { const r = { rodilla: f.p1.rod, tobillo: f.p1.tob, hombro: f.hom }[q.en] || f.cad; s += `<circle class="rodillo" cx="${f1(r[0] + (q.dx ?? 0))}" cy="${f1(r[1] + (q.dy ?? -8))}" r="6"/>`; }
    if (q.tipo === 'almohadillas' && vista === 'frente' && f.fr) s += f.fr.map(r => `<rect class="rodillo" x="${f1(r[0] + (r[0] < 120 ? -9 : 3))}" y="${f1(r[1] - 6)}" width="6" height="14" rx="3"/>`).join('');
  }
  if (mano === 'goblet') s += vista === 'frente' && f.fm ? `<g class="equipo"><rect x="113" y="${f1(f.fm[0][1] + 2)}" width="14" height="4" rx="1.3"/></g>` : mancuerna([f.b1.mano[0] + 2, f.b1.mano[1] + 7]);
  if (mano === 'mancuernas') s += vista === 'frente' && f.fm ? f.fm.map(m => disco([m[0], m[1] + 2], 4.5)).join('') : disco([f.b1.mano[0], f.b1.mano[1] + 3]);
  if (mano === 'barra') s += vista === 'frente' && f.fm ? `<line class="barra-m" x1="${f1(f.fm[0][0] - 14)}" y1="${f1(f.fm[0][1])}" x2="${f1(f.fm[1][0] + 14)}" y2="${f1(f.fm[1][1])}"/>` : `<circle class="barra-p" cx="${f1(f.b1.mano[0])}" cy="${f1(f.b1.mano[1])}" r="3.5"/>`;
  if (mano === 'balon' && p.bal > 0.5) {
    const c = vista === 'frente' && f.fm ? medio(f.fm[0], f.fm[1]) : medio(f.b1.mano, f.b2.mano);
    s += `<circle class="balon" cx="${f1(c[0])}" cy="${f1(c[1] - 2)}" r="8"/>`;
  }
  return s;
}

function lado(p, def, punto, fijo) {
  const f = figura(p, def, fijo);
  const pierna = (x, cls) => ln(f.cad, x.rod, cls + ' muslo') + ln(x.rod, x.tob, cls + ' canilla') + pl([x.talon, x.tob, x.punta], cls + ' pie-l');
  const brazo = (x, cls) => ln(f.hom, x.cod, cls + ' brazo') + ln(x.cod, x.mano, cls + ' ante');
  let s = brazo(f.b2, 'hueso fondo') + pierna(f.p2, 'hueso fondo');
  s += pl([f.cad, columna(f, p.curva), f.hom], 'torso') + `<circle class="cabeza" cx="${f1(f.cab[0])}" cy="${f1(f.cab[1])}" r="${L.cabeza}"/>`;
  s += pierna(f.p1, 'hueso') + brazo(f.b1, 'hueso');
  s += equipoMovil(def, f, p, 'lado');
  s += marca(punto, {
    rodilla: [f.p1.rod], cadera: [f.cad], pies: [f.p1.tob], hombro: [f.hom], manos: [f.b1.mano], codo: [f.b1.cod],
    espalda: [medio(f.cad, f.hom)], cabeza: [f.cab],
  }, f);
  return s;
}

// Punto medio de la espalda, desplazado hacia atrás si está redonda
function columna(f, curva) {
  const d = [f.hom[0] - f.cad[0], f.hom[1] - f.cad[1]], l = Math.hypot(...d) || 1, u = [d[0] / l, d[1] / l];
  const m = medio(f.cad, f.hom);
  return [m[0] + u[1] * curva, m[1] - u[0] * curva];
}

// Vista de frente: alturas de la vista lateral y anchos propios
function frente(p, def, punto, fijo) {
  const f = figura(p, def, fijo);
  const CX = 120 + p.lat, s = [];
  const piernaF = (sg, x, flexion) => {
    const hx = CX + sg * 7, fx = CX + sg * p.ancho;
    const r = (x.rod[1] - f.cad[1]) / ((x.tob[1] - f.cad[1]) || 1);
    const enLinea = hx + (fx - hx) * r;
    const flex = clamp(flexion / 90, 0, 1);
    const kx = enLinea + (fx + sg * 2 - enLinea) * flex - sg * p.valgo * flex + p.rodLat;
    const suelo = Math.max(x.punta[1], x.talon[1]);
    return { rod: [kx, x.rod[1] + Math.abs(p.rodLat) * 0.5], tob: [fx, x.tob[1]], pie: [fx + sg * 2, suelo - 2.5], cad: [hx, f.cad[1]] };
  };
  const izq = piernaF(-1, f.p1, p.rodilla), der = piernaF(1, f.p2, p.rodilla2);
  const brazoF = (sg, x, hF, cF, rF, lado) => {
    const sx = CX + sg * 11 * Math.cos(rad(p.tr)) + Math.sin(rad(p.tr)) * 4, hom = [sx, f.hom[1]];
    if (def.brazosF) {
      const cod = sum(hom, [sg * Math.sin(rad(hF)) * L.brazo, Math.cos(rad(hF)) * L.brazo]);
      const a = hF + cF;
      const rota = def.rotF === true || def.rotF === lado;
      const mano = rota ? [cod[0] + sg * Math.sin(rad(rF)) * L.ante, cod[1] + 1] : sum(cod, [sg * Math.sin(rad(a)) * L.ante, Math.cos(rad(a)) * L.ante]);
      return { hom, cod, mano };
    }
    const mx = def.juntas ? CX + sg * 3 : sx + sg * 3;
    const ex = def.juntas ? CX + sg * 11 : sx + sg * 3;
    return { hom, cod: [ex, x.cod[1]], mano: [mx, x.mano[1]] };
  };
  const bi = brazoF(-1, f.b1, p.hF, p.cF, p.rF, 1), bd = brazoF(1, f.b2, p.hF2, p.cF2, p.rF2, 2);
  f.fm = [bi.mano, bd.mano];
  f.fr = [izq.rod, der.rod];
  for (const x of [izq, der]) s.push(ln(x.cad, x.rod, 'hueso muslo'), ln(x.rod, x.tob, 'hueso canilla'), `<ellipse class="pie" cx="${f1(x.pie[0])}" cy="${f1(x.pie[1])}" rx="4.5" ry="2.5"/>`);
  s.push(ln(izq.cad, der.cad, 'hueso'), ln([CX, f.cad[1]], [CX + Math.sin(rad(p.tr)) * 4, f.hom[1]], 'torso'), ln(bi.hom, bd.hom, 'hueso'));
  s.push(`<circle class="cabeza" cx="${f1(CX + Math.sin(rad(p.tr)) * 5)}" cy="${f1(f.cab[1])}" r="${L.cabeza}"/>`);
  for (const x of [bi, bd]) s.push(ln(x.hom, x.cod, 'hueso brazo'), ln(x.cod, x.mano, 'hueso ante'));
  s.push(equipoMovil(def, f, p, 'frente'));
  s.push(marca(punto, { rodilla: [izq.rod, der.rod], pies: [izq.pie, der.pie], cadera: [[CX, f.cad[1]]], espalda: [[CX, (f.cad[1] + f.hom[1]) / 2]], hombro: [bi.hom, bd.hom], manos: [bi.mano, bd.mano], codo: [bi.cod, bd.cod], cabeza: [[CX, f.cab[1]]] }, null));
  return s.join('');
}

// La marca coral siempre existe (línea + 2 círculos) para no recrear nodos: se oculta cuando no hace falta
function marca(punto, pts, f) {
  const lin = punto && punto.zona === 'espalda' && f;
  const qs = punto ? (pts[punto.zona] || pts.cadera) : [];
  const a = f ? f.cad : [0, 0], b = f ? f.hom : [0, 0];
  let s = `<line class="marca-linea${lin ? '' : ' oculta'}" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;
  for (let i = 0; i < 2; i++) { const q = qs[i] || [0, 0]; s += `<circle class="marca${qs[i] ? '' : ' oculta'}" cx="${f1(q[0])}" cy="${f1(q[1])}" r="9"/>`; }
  return s;
}

function puntoClave(def, q, vista) {
  const f = figura(q, def);
  const k = def.sigue || 'cadera';
  if (vista === 'frente') return [120 + q.lat, { cadera: f.cad, manos: f.b1.mano, pies: f.p1.tob, hombro: f.hom, rodilla: f.p1.rod }[k][1]];
  return { cadera: f.cad, manos: f.b1.mano, pies: f.p1.tob, hombro: f.hom, rodilla: f.p1.rod }[k];
}
function flecha(def, a, b, vista) {
  const p = puntoClave(def, a, vista), q = puntoClave(def, b, vista);
  const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy);
  if (l < 8) return '';
  const u = [dx / l, dy / l], largo = Math.min(l * 0.75, 38), ini = [p[0] + u[0] * 10, p[1] + u[1] * 10], fin = [ini[0] + u[0] * largo, ini[1] + u[1] * largo];
  const n = [-u[1], u[0]], h1 = [fin[0] - u[0] * 7 + n[0] * 5, fin[1] - u[1] * 7 + n[1] * 5], h2 = [fin[0] - u[0] * 7 - n[0] * 5, fin[1] - u[1] * 7 - n[1] * 5];
  return `<line class="flecha" x1="${f1(ini[0])}" y1="${f1(ini[1])}" x2="${f1(fin[0])}" y2="${f1(fin[1])}"/><polygon class="flecha-p" points="${[fin, h1, h2].map(x => x.map(f1).join(',')).join(' ')}"/>`;
}

const fondo = (def, vista) => `<line class="suelo" x1="6" y1="${SUELO}" x2="234" y2="${SUELO}"/>` + equipoFijo(def, vista);
const figuraSVG = (def, q, vista, punto, fijo) => (vista === 'frente' ? frente(q, def, punto, fijo) : lado(q, def, punto, fijo));

export function dibujarPose(def, p, vista = 'lado', punto = null, fijo = null, siguiente = null) {
  const q = p.__ok ? p : completar(p, def);
  const sig = siguiente ? (siguiente.__ok ? siguiente : completar(siguiente, def)) : null;
  return fondo(def, vista) + figuraSVG(def, q, vista, punto, fijo) + (sig ? flecha(def, q, sig, vista) : '');
}

// Actualiza un grupo SVG sin reconstruirlo: si la estructura es la misma, solo cambia los atributos
const RE_TAG = /<(\/?)(\w+)([^>]*?)\/?>/g, RE_ATR = /([\w-]+)="([^"]*)"/g;
function parchear(g, html) {
  const nodos = [];
  for (const m of html.matchAll(RE_TAG)) {
    if (m[1]) continue;
    const a = {};
    for (const x of m[3].matchAll(RE_ATR)) a[x[1]] = x[2];
    nodos.push([m[2], a]);
  }
  const firma = nodos.map(n => n[0]).join('|');
  if (g._firma !== firma) {
    g.innerHTML = html;
    g._firma = firma;
    g._els = [...g.querySelectorAll('*')];
    g._els.forEach((el, i) => { el._a = nodos[i][1]; });
    return;
  }
  g._els.forEach((el, i) => {
    const a = nodos[i][1], prev = el._a;
    for (const k in a) if (prev[k] !== a[k]) el.setAttribute(k, a[k]);
    el._a = a;
  });
}

// ── Línea de tiempo ──────────────────────────────────────────
const suave = x => 0.5 - Math.cos(Math.PI * x) / 2;

function preparar(def) {
  const poses = def.poses.map(p => completar(p, def));
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
  const vuelta = prep.def.vuelta || [];
  for (const k of PARAMS) p[k] = a[k] + (vuelta.includes(k) ? ((b[k] - a[k] + 540) % 360) - 180 : b[k] - a[k]) * f;
  // Mismo apoyo: queda clavado. Si cambia, se interpola el traslado de la figura.
  const ap = x => x.apoyo ?? prep.def.apoyo ?? 1;
  let fijo = { apoyo: ap(a) };
  if (prep.def.ancla !== 'cadera' && ap(a) !== ap(b)) { const ta = prep.tras[tr.i], tb = prep.tras[(tr.i + 1) % prep.poses.length]; fijo = { ox: ta.ox + (tb.ox - ta.ox) * f, oy: ta.oy + (tb.oy - ta.oy) * f }; }
  return { p, activa: f < 0.5 ? tr.i : (tr.i + 1) % prep.poses.length, fijo };
}

// Un ejercicio puede usar la animación de otro parecido (como: 'id')
const defDe = e => { const d = ANIM[e]; return d?.como ? ANIM[d.como] : d; };
export const tieneAnimacion = e => !!defDe(e);

// Solo una animación a la vez
let detenerActual = null;

// Monta el reproductor dentro de un contenedor
export function montar(cont, e) {
  const def = defDe(e);
  if (!def) return;
  detenerActual?.();
  const prep = preparar(def);
  const vistas = def.vistas || ['lado'];
  const st = { t: 0, play: true, vel: 1, vista: vistas[0], ult: performance.now(), dib: 0, raf: 0, paso: null, visible: true, costo: [], gaps: [], lento: false };
  const nombreVista = v => v === 'frente' ? 'Ver de frente' : 'Ver de lado';
  cont.innerHTML = `
    <div class="anim">
      <svg class="anim-svg" viewBox="0 0 240 196" role="img" aria-label="Animación del ejercicio"><g class="anim-fijo"></g><g class="anim-g"></g></svg>
      <p class="anim-punto" aria-live="polite"></p>
    </div>
    <div class="anim-ctrl">
      <button data-an="play" aria-label="Pausa"></button>
      <button data-an="vel">Lento 0,5×</button>
      <button data-an="prev" aria-label="Pose anterior">‹ Pose</button>
      <button data-an="next" aria-label="Pose siguiente">Pose ›</button>
      ${vistas.length > 1 ? `<button data-an="vista" class="vista">${nombreVista(vistas[1])}</button>` : ''}
    </div>
    <p class="anim-lento" hidden>Tu teléfono va algo lento: aquí van las poses fijas, con flechas de hacia dónde te mueves.</p>
    <div class="anim-fijas" hidden></div>
    <ol class="anim-pasos">${def.poses.map((p, i) => `<li data-an="ir" data-i="${i}">${p.n || ''}</li>`).join('')}</ol>`;
  const fijoG = cont.querySelector('.anim-fijo'), g = cont.querySelector('.anim-g'), txt = cont.querySelector('.anim-punto');
  const bPlay = cont.querySelector('[data-an=play]');
  const icoPlay = () => { bPlay.innerHTML = st.play ? '❚❚ Pausa' : '▶ Seguir'; };
  icoPlay();
  fijoG.innerHTML = fondo(def, st.vista);
  cont._st = st; // para las pruebas automáticas

  let ultActiva = -1;
  const pintar = () => {
    const t0 = performance.now();
    const { p, activa, fijo } = st.paso !== null ? { p: prep.poses[st.paso], activa: st.paso, fijo: null } : poseEn(prep, st.t);
    const punto = def.poses[activa].punto || null;
    parchear(g, figuraSVG(def, p, st.vista, punto, fijo));
    if (activa !== ultActiva) {
      ultActiva = activa;
      txt.textContent = punto ? punto.txt : (def.poses[activa].n || '');
      txt.classList.toggle('alerta', !!punto);
      cont.querySelectorAll('.anim-pasos li').forEach((b, i) => b.classList.toggle('act', i === activa));
    }
    return performance.now() - t0;
  };
  // Pausa cuando no se ve en pantalla
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { st.visible = es[0].isIntersecting; }) : null;
  io?.observe(cont);
  // Poses fijas grandes con flechas (teléfono lento o ejercicio marcado como "fijas")
  const mostrarFijas = () => {
    const n = def.poses.length, caja = cont.querySelector('.anim-fijas');
    caja.innerHTML = def.poses.map((p, i) => `<figure><svg class="anim-svg" viewBox="0 0 240 196">${dibujarPose(def, p, st.vista, p.punto, null, i < n - 1 ? def.poses[i + 1] : null)}</svg><b>${i + 1}</b><figcaption>${p.n || ''}</figcaption></figure>`).join('');
    caja.hidden = false;
    cont.querySelector('.anim').hidden = true;
    cont.querySelector('.anim-ctrl').hidden = vistas.length < 2;
    cont.querySelectorAll('.anim-ctrl button:not(.vista)').forEach(b => { b.hidden = true; });
  };
  const detener = () => { cancelAnimationFrame(st.raf); io?.disconnect(); if (detenerActual === detener) detenerActual = null; };
  detenerActual = detener;

  const bucle = ahora => {
    if (!cont.isConnected) return detener();
    const dt = ahora - st.ult; st.ult = ahora;
    if (st.play && st.visible && document.visibilityState === 'visible') {
      st.t += dt * st.vel;
      if (ahora - st.dib >= 33) {          // máximo 30 cuadros por segundo
        if (st.dib) st.gaps.push(ahora - st.dib);
        st.dib = ahora;
        const c = pintar();
        // Si dibujar cuesta mucho o va a menos de 10 cuadros por segundo, pasamos a poses fijas
        const prom = x => x.reduce((a, b) => a + b, 0) / x.length;
        if (st.costo.length < 20) st.costo.push(c);
        else if (!st.lento && (prom(st.costo) > 18 || prom(st.gaps.slice(-20)) > 100)) {
          st.lento = true; st.play = false; st.paso = 0; icoPlay();
          cont.querySelector('.anim-lento').hidden = false;
          mostrarFijas();
        }
      }
    }
    st.raf = requestAnimationFrame(bucle);
  };
  if (def.fijas) { st.play = false; st.lento = true; mostrarFijas(); }
  else { pintar(); st.raf = requestAnimationFrame(bucle); }

  cont.onclick = ev => {
    const b = ev.target.closest('[data-an]');
    if (!b) return;
    const a = b.dataset.an;
    if (a === 'play') { st.play = !st.play; if (st.play) st.paso = null; icoPlay(); }
    if (a === 'vel') { st.vel = st.vel === 1 ? 0.5 : 1; b.textContent = st.vel === 1 ? 'Lento 0,5×' : 'Lento ✓'; b.classList.toggle('act', st.vel !== 1); }
    if (a === 'vista') {
      const i = (vistas.indexOf(st.vista) + 1) % vistas.length; st.vista = vistas[i];
      b.textContent = nombreVista(vistas[(i + 1) % vistas.length]); ultActiva = -1;
      fijoG.innerHTML = fondo(def, st.vista);
      if (st.lento) mostrarFijas(); else pintar();
    }
    if (a === 'prev' || a === 'next' || a === 'ir') {
      st.play = false; icoPlay();
      const n = def.poses.length;
      const base = st.paso ?? poseEn(prep, st.t).activa;
      st.paso = a === 'ir' ? Number(b.dataset.i) : (base + (a === 'next' ? 1 : -1) + n) % n;
      st.t = prep.tramos[st.paso].ini;
      ultActiva = -1;
      pintar();
    }
  };
}
