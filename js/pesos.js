// Pesos guiados: peso inicial, tope del ciclo, escalones, unidades y calculadora de discos.
// Regla de oro: es mejor quedarse corto que pasarse.
// Unidad de cada ejercicio: por defecto mancuernas, balón, máquinas y poleas en kg, y barras en lb.
// Con el switch "Discos en kg | lb" de la tarjeta, Juan elige la unidad real de los discos de esa máquina o barra:
// los pesos, los escalones y la calculadora de discos pasan a esa unidad.
import { PESOS, FASES } from './data.js';
import { S, C, leerDia } from './store.js';
import { diasEntre } from './fechas.js';
import { faseDe, semanaDe } from './plan.js';

const MANC = { kg: [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22.5, 25, 27.5, 30], lb: [2.5, 5, 8, 10, 12.5, 15, 17.5, 20, 22.5, 25, 30, 35, 40, 45, 50, 55, 60] };
const DISCOS = { kg: [20, 10, 5, 2.5, 1.25], lb: [45, 25, 10, 5, 2.5] };
const rango = (a, b, p) => { const o = []; for (let v = a; v <= b + 1e-9; v += p) o.push(Math.round(v * 100) / 100); return o; };
export const KG_LB = 2.20462;

export const info = e => PESOS[e] || null;
export const conPeso = e => ['manc', 'mano', 'barra', 'maquina', 'balon'].includes(PESOS[e]?.eq);

// Unidad de cada ejercicio: la que Juan eligió para sus discos, o la de su equipo (el balón siempre en kg)
export const nativa = e => (PESOS[e]?.eq === 'barra' ? 'lb' : 'kg');
export const unidad = e => (PESOS[e]?.eq === 'balon' ? 'kg' : C()?.unidades?.[e] || nativa(e));

// Barra olímpica 45 lb (20 kg); Smith 20 lb (10 kg); barra Z según el gimnasio (20 lb por defecto, se cambia en Ajustes)
export function barra(e, u = unidad(e)) {
  const t = PESOS[e]?.barra;
  if (t === 'oli') return u === 'kg' ? 20 : 45;
  if (t === 'smith') return u === 'kg' ? 10 : 20;
  const z = Number(C()?.barraZ) > 0 ? Number(C().barraZ) : 20;
  return u === 'kg' ? Math.round((z / KG_LB) * 2) / 2 : z;
}

// Pesos que existen de verdad en un gimnasio para ese equipo, en su unidad
export function lista(e, u = unidad(e)) {
  const eq = PESOS[e].eq;
  if (eq === 'manc' || eq === 'mano') return MANC[u];
  if (eq === 'balon') return [1, 2, 3, 4, 5, 6, 8];
  if (eq === 'barra') return rango(barra(e, u), barra(e, u) + (u === 'kg' ? 80 : 180), u === 'kg' ? 2.5 : 5);
  return u === 'kg' ? rango(2.5, 120, 2.5) : rango(5, 260, 5);
}

const abajo = (l, v) => l.filter(x => x <= v + 1e-9).pop() ?? 0;
const cerca = (l, v) => l.reduce((a, x) => (Math.abs(x - v) < Math.abs(a - v) ? x : a), l[0]);

const idx = u => (u === 'kg' ? 0 : 1);
const liviano = () => { const p = C().pesoCorp; return p && (p.u === 'kg' ? p.v : p.v / KG_LB) < 55; };

export function tope(e, f) {
  const p = PESOS[e], u = unidad(e);
  if (!conPeso(e)) return null;
  if (p.desde && f && semanaDe(f).n < p.desde) return 0;
  let t = p.topeExtra ? barra(e) + p.topeExtra[idx(u)] : p.tope[idx(u)];
  if (liviano()) t = abajo(lista(e), t * 0.85);
  return t;
}

export function inicial(e) {
  const p = PESOS[e], u = unidad(e);
  if (!conPeso(e)) return null;
  if (p.ini === 'barra') return barra(e);
  if (!p.ini) return 0;
  return Math.min(p.ini[idx(u)], tope(e));
}

// Lleva un peso guardado en otra unidad (versiones viejas de la app) a la de su equipo
export function aSuUnidad(e, v, u) {
  if (!v || !u || u === unidad(e)) return v;
  return cerca(lista(e), unidad(e) === 'kg' ? v / KG_LB : v * KG_LB);
}

// Peso de trabajo guardado
export function trabajo(e) {
  const g = S().pesos[e];
  return g ? aSuUnidad(e, g.v, g.u) : null;
}

export function paso(e, v, dir) {
  const l = lista(e);
  if (dir > 0) {
    const sube = unidad(e) === 'kg' ? (PESOS[e].eq === 'balon' ? 1 : 2) : 5; // barras: 5 lb (un disco de 2,5 por lado)
    const n = abajo(l, v + sube);
    return n > v ? n : (l.find(x => x > v) ?? v);
  }
  const prev = l.filter(x => x < v - 1e-9).pop();
  return prev ?? 0;
}

// Peso que la app propone hoy
export function sugerido(e, f, { ligera = false } = {}) {
  const p = PESOS[e];
  if (!conPeso(e)) return null;
  const t = tope(e, f);
  if (t === 0) return 0;
  if (p.sinPesoSem1 && semanaDe(f).n <= 1) return 0;
  let v = trabajo(e) ?? inicial(e);
  const fa = FASES[faseDe(f)];
  if (fa?.peso && v) v = abajo(lista(e), v * fa.peso) || lista(e)[0];
  if (ligera && v) v = paso(e, v, -1) || v;
  return Math.min(v, t);
}

export function guardarTrabajo(e, v, f, subio = false) {
  const prev = S().pesos[e];
  S().pesos[e] = { v, u: unidad(e), sube: subio ? f : (prev?.sube || f) };
}

// Si la sesión pasada salió perfecta, sugiere subir un escalón (máximo uno por semana)
export function subida(e, f) {
  const fa = faseDe(f);
  if (!conPeso(e) || ['descarga', 'puesta', 'competencia'].includes(fa)) return null;
  const g = S().pesos[e];
  if (!g || (g.sube && diasEntre(g.sube, f) < 7)) return null;
  const fechas = Object.keys(S().log).filter(x => x < f && leerDia(x).res?.[e]).sort();
  const ult = fechas.pop();
  if (!ult) return null;
  const l = leerDia(ult), r = l.res[e];
  if (!r.ok || !l.rpe || l.rpe > 7) return null;
  const v = trabajo(e), n = paso(e, v, 1);
  return n > v && n <= tope(e, f) ? n : null;
}

// ── Texto ────────────────────────────────────────────────────
const num = v => String(v).replace('.', ',');

// Un peso ya está en la unidad de su ejercicio: se muestra tal cual
export const mostrar = (v, u) => ({ n: num(v || 0), u, aprox: false });
export const cifra = (e, v) => `${num(v || 0)} ${unidad(e)}`;

export function texto(e, v, { mano = true } = {}) {
  const p = PESOS[e];
  if (!v) return 'Peso corporal';
  const base = cifra(e, v);
  if (p.eq === 'balon') return `Balón de ${base}`;
  return `${base}${mano && p.eq === 'mano' ? ' en cada mano' : ''}`;
}

// Switch "Discos en kg | lb" de un ejercicio (attr: el data-* que usa la pantalla para sus toques)
export function switchDiscos(e, attr) {
  const v = unidad(e);
  return `<div class="unid" role="group" aria-label="Discos de este ejercicio en"><span>Discos en</span>${['kg', 'lb'].map(u => `<button type="button" ${attr}="discos" data-e="${e}" data-u="${u}" aria-pressed="${u === v}">${u}</button>`).join('')}</div>`;
}
// Cambia la unidad de un ejercicio (si vuelve a la de su equipo, se borra la preferencia)
export function ponerUnidad(e, u) {
  const c = C();
  c.unidades ||= {};
  if (u === nativa(e)) delete c.unidades[e]; else c.unidades[e] = u;
}

// Etiquetas "Empieza con" y "Tope" para ejercicios sin peso (cajón, banda, corporal)
export function textoFijo(e) {
  const p = PESOS[e];
  if (!p) return null;
  if (p.eq === 'cajon') return { ini: 'Cajón de 30-40 cm', tope: '50 cm' };
  if (p.eq === 'banda') return { ini: 'Banda ligera', tope: 'Banda mediana' };
  if (p.eq === 'corporal') return { ini: p.ini, tope: p.tope };
  return null;
}

// ── Calculadora de discos (en la unidad de los discos de ese ejercicio) ──
export function discos(e, total) {
  const u = unidad(e), b = barra(e, u);
  let lado = Math.max(0, (total - b) / 2);
  const out = [];
  for (const d of DISCOS[u]) while (lado >= d - 1e-9) { out.push(d); lado = Math.round((lado - d) * 100) / 100; }
  const tipo = PESOS[e].barra === 'oli' ? 'Barra olímpica' : PESOS[e].barra === 'smith' ? 'Barra de la Smith' : 'Barra Z';
  return { barra: b, u, lado: out, tipo };
}
