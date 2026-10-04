// Lógica del plan: fases contadas hacia atrás desde la competencia, qué toca cada día,
// mover sesiones y cómo se ajustan las series según la fase, el cansancio y el dolor.
import { EJ, SESIONES, RUTINAS, ACTIVACION, FASES, BLOQUES } from './data.js';
import { S, C, leerDia } from './store.js';
import { SEMANA, sumar, lunesDe, diasEntre, diaDe } from './fechas.js';

// ── Fases ────────────────────────────────────────────────────
// Semanas de construcción: técnica → construir → construir+ → pico.
// Si sobran semanas se repite construir/pico; si faltan, se acorta la técnica.
function secuencia(n) {
  if (n <= 0) return [];
  if (n === 1) return ['construir'];
  if (n === 2) return ['tecnica', 'pico'];
  if (n === 3) return ['tecnica', 'construir', 'pico'];
  const extra = n - 4, rel = [];
  if (extra % 2) rel.push('construir');
  for (let i = 0; i < Math.floor(extra / 2); i++) rel.push('construir', 'pico');
  return ['tecnica', ...rel, 'construir', 'construir2', 'pico'];
}

export const compFin = () => C().comp.fin && C().comp.fin >= C().comp.ini ? C().comp.fin : C().comp.ini;
export const diasParaComp = f => diasEntre(f, C().comp.ini);

export function faseDe(f) {
  const { inicio } = C();
  const dc = diasParaComp(f);
  if (dc <= 0) return f <= compFin() ? 'competencia' : 'despues';
  if (f < inicio) return 'antes';
  if (dc <= 7) return 'puesta';
  if (dc <= 14) return 'descarga';
  const fin = sumar(C().comp.ini, -15);
  const l0 = lunesDe(inicio);
  const n = Math.floor(diasEntre(l0, fin) / 7) + 1;
  const w = Math.floor(diasEntre(l0, f) / 7);
  return secuencia(n)[w] || 'construir';
}

// Semana del plan (1, 2, …) y total hasta la competencia
export function semanaDe(f) {
  const l0 = lunesDe(C().inicio);
  return { n: Math.floor(diasEntre(l0, f) / 7) + 1, total: Math.floor(diasEntre(l0, sumar(C().comp.ini, -1)) / 7) + 1 };
}

// Tramos de la línea de tiempo: [{ fase, ini, fin }]
export function tramos() {
  const out = [];
  let f = C().inicio < C().comp.ini ? C().inicio : C().comp.ini;
  const fin = compFin();
  while (f <= fin) {
    const fa = faseDe(f);
    const u = out[out.length - 1];
    if (u && u.fase === fa) u.fin = f; else out.push({ fase: fa, ini: f, fin: f });
    f = sumar(f, 1);
  }
  return out;
}

// ── Días de gimnasio ─────────────────────────────────────────
export const gymOrden = () => SEMANA.filter(d => C().gym.includes(d));

// Días de gym seguidos (sin un día libre entre medio)
export function diasSeguidos(gym) {
  const o = SEMANA.filter(d => gym.includes(d));
  const idx = o.map(d => SEMANA.indexOf(d));
  return idx.some((v, i) => i > 0 && v - idx[i - 1] === 1);
}

// Fecha → letra de sesión de esa semana, ya con las sesiones movidas
function asignacion(lunes) {
  const m = {}, orden = gymOrden();
  for (let i = 0; i < 7; i++) {
    const f = sumar(lunes, i), k = orden.indexOf(diaDe(f));
    if (k >= 0 && k < 3) m[f] = 'ABC'[k];
  }
  for (const mv of S().movs) {
    if (lunesDe(mv.de) !== lunes || !m[mv.de]) continue;
    m[mv.a] = m[mv.de];
    delete m[mv.de];
  }
  return m;
}
export const letraDe = f => asignacion(lunesDe(f))[f] || null;

// ── Qué toca cada día ────────────────────────────────────────
// tipo: gym · movilidad · descanso · precomp · competencia
export function deFecha(f) {
  const fase = faseDe(f);
  const dc = diasParaComp(f);
  const base = { f, fase };
  if (fase === 'competencia') return { ...base, tipo: 'competencia' };
  if (fase === 'despues' || fase === 'antes') return { ...base, tipo: diaDe(f) === 'dom' ? 'descanso' : 'movilidad' };
  if (dc <= 2) return { ...base, tipo: 'precomp' };
  const otra = (C().otras || []).find(o => { const d = diasEntre(f, o.ini); return d >= 1 && d <= 2; });
  if (diaDe(f) === 'dom') return { ...base, tipo: 'descanso' };
  const letra = letraDe(f);
  const movida = S().movs.find(m => m.de === f && letraDe(m.a));
  if (!letra) return { ...base, tipo: otra ? 'precomp' : 'movilidad', otra, movida: movida?.a };
  if (fase === 'puesta') {
    // Puesta a punto: solo las 2 primeras sesiones, cortas. Las demás se vuelven movilidad.
    let previas = 0;
    for (let x = sumar(C().comp.ini, -7); x < f; x = sumar(x, 1)) if (letraDe(x) && diasParaComp(x) > 2) previas++;
    if (previas >= 2) return { ...base, tipo: 'movilidad', nota: 'En la puesta a punto solo hay 2 sesiones cortas de gimnasio.' };
    return { ...base, tipo: 'gym', letra, corta: true };
  }
  return { ...base, tipo: 'gym', letra, otra };
}

// ── Mover sesión ─────────────────────────────────────────────
// 1) a un día libre de la misma semana sin quedar pegado a otra sesión;
// 2) si no se puede, correr un día todas las sesiones que quedan en la semana.
// Nunca dos sesiones seguidas, nunca más de 3 por semana, nunca domingo.
export function opcionMover(f) {
  const d = deFecha(f);
  if (d.tipo !== 'gym' || d.corta || leerDia(f).completa) return null;
  const lunes = lunesDe(f), m = asignacion(lunes);
  const sab = sumar(lunes, 5);
  const libre = (mapa, x) => !mapa[x] && diasParaComp(x) > 2;
  const valido = mapa => {
    const ds = Object.keys(mapa).sort();
    return ds.every((x, i) => i === 0 || diasEntre(ds[i - 1], x) > 1) && ds.every(x => diaDe(x) !== 'dom');
  };
  const sin = { ...m }; delete sin[f];
  for (let c = sumar(f, 1); c <= sab; c = sumar(c, 1)) {
    if (!libre(sin, c)) continue;
    const prueba = { ...sin, [c]: m[f] };
    if (valido(prueba)) return { tipo: 'uno', movs: [{ de: f, a: c }] };
  }
  const resto = Object.keys(m).filter(x => x >= f).sort();
  const nuevo = {};
  for (const x of Object.keys(m)) if (x < f) nuevo[x] = m[x];
  const movs = [];
  for (const x of resto) {
    const a = sumar(x, 1);
    if (a > sab || diasParaComp(a) <= 2) return null;
    nuevo[a] = m[x];
    movs.push({ de: x, a });
  }
  return valido(nuevo) ? { tipo: 'correr', movs } : null;
}

// ── Construir la sesión del día ──────────────────────────────
const conLado = it => (it.lado ? 2 : 1);
export const contactos = it => (EJ[it.e].salto && it.r ? it.r * conLado(it) : 0);

// Aplica cambio de ejercicio ("Solo hoy" o "Siempre")
function resolver(orig, slot, f) {
  const cambio = leerDia(f).cambios?.[slot] ?? S().siempre[orig.e];
  const alt = cambio && cambio !== orig.e ? (orig.alts || []).find(a => a.e === cambio) : null;
  return { ...(alt || orig), slot, orig, alts: orig.alts || [], cambiado: !!alt };
}

const menos = (s, n) => Math.max(1, s + n);

export function sesionGym(f, { ligera = false, dolor = [], letra = null } = {}) {
  const cal = deFecha(f);
  // Si se eligió otra sesión a mano, se arma esa (y no la versión corta de otro día)
  const d = letra && letra !== cal.letra ? { ...cal, letra, corta: false } : cal;
  const ses = SESIONES[d.letra];
  const fase = FASES[d.fase] || FASES.construir;
  const bloques = [];
  const add = (b, lista) => {
    const items = lista.map((it, i) => resolver(it, `${b}${i}`, f));
    bloques.push({ b, ...BLOQUES[b], items });
  };
  add('activacion', ACTIVACION);
  add('potencia', d.corta ? ses.potencia.slice(0, 2) : ses.potencia);
  if (!d.corta && fase.f !== null) add('fuerza', ses.fuerza);
  add('core', ses.core);

  for (const bl of bloques) for (const it of bl.items) {
    if (bl.b === 'potencia') {
      if (d.corta) { it.s = 2; if (it.r) { it.r = 3; it.rTxt = '2-3'; } }
      else it.s = menos(it.s, fase.p);
    }
    if (bl.b === 'fuerza') it.s = menos(it.s, fase.f);
    if (bl.b === 'core') it.s = menos(it.s, fase.core || 0);
    if (ligera && bl.b !== 'activacion') it.s = menos(it.s, -1);
  }

  let aviso = null;
  if (ligera) {
    const p = bloques.find(b => b.b === 'potencia');
    if (p) p.items = p.items.filter(it => !['cajon', 'cajonSentado'].includes(it.e));
  }
  if (dolor.length) {
    // Con dolor: solo movilidad y core, sin nada que cargue la zona
    const carga = it => (EJ[it.e].carga || []).some(z => dolor.includes(z));
    for (const bl of bloques) {
      if (bl.b === 'potencia' || bl.b === 'fuerza') bl.items = [];
      bl.items = bl.items.filter(it => !carga(it) && !(bl.b === 'activacion' && EJ[it.e].salto));
      if (bl.b === 'activacion') bl.items = bl.items.filter(it => it.e !== 'pogo' || !dolor.includes('rodilla'));
    }
    aviso = 'Hoy solo movilidad y core. Habla con tu entrenador sobre ese dolor antes de la próxima sesión.';
  }
  const bl = bloques.filter(b => b.items.length);
  return {
    clave: d.letra, n: ses.n, sub: ses.sub, c: ses.c, fase: d.fase, corta: d.corta, ligera, dolor, aviso,
    tope: d.corta ? FASES.puesta.tope : fase.tope, rpe: fase.rpe, bloques: bl, min: duracion(bl),
    titulo: `Sesión ${d.letra}${d.corta ? ' corta' : ''}`,
  };
}

// Rutinas fuera del gym (movilidad, precompetencia, Plan B…)
export function sesionRutina(clave, f) {
  const r = RUTINAS[clave];
  const fase = faseDe(f);
  const bloques = r.bloques.map((bl, k) => {
    const items = bl.items.map((it, i) => resolver(it, `${clave}${k}-${i}`, f));
    if (fase === 'descarga' && ['recuperacion', 'forma', 'agua'].includes(clave)) items.forEach(it => { it.s = menos(it.s, -1); });
    return { b: bl.b, ...BLOQUES[bl.b], rondas: bl.rondas && (fase === 'descarga' ? bl.rondas - 1 : bl.rondas), descansoRonda: bl.descansoRonda, items };
  });
  for (const bl of bloques) if (bl.rondas) bl.items.forEach(it => { it.s = bl.rondas; });
  const TITULO = { movilidad: 'Día sin gimnasio', precomp: 'Precompetencia', competencia: 'Día de competencia', noche: 'Recuperación', recuperacion: 'Plan B', forma: 'Plan B', agua: 'Plan B' };
  return { clave, n: r.n, sub: r.sub, c: r.c, casa: !!r.casa, final: r.final, fase, tope: 0, bloques, min: duracion(bloques), titulo: TITULO[clave] || r.n };
}

export function sesionDe(clave, f, opc) {
  return 'ABC'.includes(clave) && clave.length === 1 ? sesionGym(f, { ...opc, letra: clave }) : sesionRutina(clave, f);
}

// Duración estimada en minutos
export function duracion(bloques) {
  let s = 0;
  for (const bl of bloques) {
    for (const it of bl.items) {
      const trabajo = (it.seg ? (Array.isArray(it.seg) ? it.seg[0] : it.seg) : (it.r || 8) * 3) * conLado(it) + 15;
      s += it.s * trabajo + Math.max(0, it.s - 1) * (bl.rondas ? 0 : (it.d || 15)) + 40;
    }
    if (bl.rondas) s += (bl.rondas - 1) * (bl.descansoRonda || 60);
  }
  return Math.max(5, Math.round(s / 60 / 5) * 5);
}

// ── Seguimiento ──────────────────────────────────────────────
// Días de gimnasio pasados que no se hicieron ni se salvaron
export function sesionPerdida(f) {
  const d = deFecha(f), l = leerDia(f);
  return d.tipo === 'gym' && !l.completa && !l.salvado && !l.recuperada && !l.falto;
}

// Racha: sesiones seguidas hechas o salvadas con el Plan B
export function racha(hoyF) {
  let n = 0;
  const desde = leerDia(hoyF).completa ? hoyF : sumar(hoyF, -1);
  for (let f = desde, i = 0; i < 120 && f >= C().inicio; f = sumar(f, -1), i++) {
    const d = deFecha(f), l = leerDia(f);
    if (d.tipo !== 'gym' || (l.falto && l.motivo === 'enfermo')) continue; // enfermarse no rompe la racha
    if (l.completa || l.salvado || l.recuperada) n++; else break;
  }
  return n;
}
export const diasSalvados = () => Object.values(S().log).filter(l => l.salvado).length;

export function faltasSemana(f) {
  const l = lunesDe(f);
  let n = 0;
  for (let i = 0; i < 7; i++) { const x = leerDia(sumar(l, i)); if (x.falto) n++; if (x.faltoAgua) n++; }
  return n;
}
