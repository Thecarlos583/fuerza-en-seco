// Agarres y accesorios: cómo agarrar cada ejercicio y qué accesorio (boquilla de polea, banda, balón…) usar.
// Dibujos SVG propios, sin internet. Mismo archivo en "Mi Rutina" y en "Fuerza en Seco".
// Cada ejercicio trae en data.js su agarre: { manos, ancho, equipo, nota, deducido, pos, imp, carga }
//   manos: pronado · supino · neutro · diagonal · ninguno (o una lista: ['neutro', 'pronado'])
//   ancho: cerrado · hombros · ancho · n/a · equipo: id del catálogo de abajo (o lista) · deducido: no estaba en la tabla
//   pos: dónde quedan las manos en el ejercicio (POSES) · imp: qué tienen las manos (barra, mancuernas, cuerda…)
//   carga: solo en piernas; cómo se lleva el peso (CARGAS). En piernas no se muestra el agarre de las manos.
import { abrirHoja } from './util.js';

export const MANOS = {
  pronado: { n: 'Pronado', d: 'Con los brazos colgando, palmas hacia tus piernas y nudillos al frente. Con los brazos arriba, palmas hacia adelante.', uso: 'Remo con barra, jalón al pecho, press y laterales.' },
  supino: { n: 'Supino', d: 'Con los brazos colgando, palmas hacia el frente. Con los brazos arriba, palmas hacia tu cara.', uso: 'Curls, jalón supino y dominadas supinas: el bíceps trabaja más.' },
  neutro: { n: 'Neutro', d: 'Palmas enfrentadas, una mirando a la otra, con los pulgares hacia arriba o al frente.', uso: 'Martillos, remos con triángulo y press con mancuernas: el más cómodo para hombros y muñecas.' },
  diagonal: { n: 'Diagonal', d: 'A medio camino entre neutro y supino, con las manos un poco giradas hacia adentro, como piden las curvas de la barra Z.', uso: 'Curl y press francés con barra Z: alivia muñecas y codos.' },
};
export const ANCHOS = {
  cerrado: { n: 'Cerrado', d: 'Manos casi juntas, más adentro que los hombros.', uso: 'Triángulo, remos y jalones cerrados.' },
  hombros: { n: 'A los hombros', d: 'Cada mano frente a su hombro.', uso: 'Curls, press militar y peso muerto.' },
  ancho: { n: 'Ancho', d: 'Más abierto que los hombros.', uso: 'Jalón ancho, dominadas, press plano y remo con barra.' },
};
export const TRUCO_ANCHO = 'En la posición baja del movimiento (barra a la altura del pecho), los antebrazos deben quedar verticales.';

// Piernas: cómo se lleva el peso (los brazos solo lo sostienen)
export const CARGAS = {
  lados: { n: 'Mancuernas a los lados', d: 'Una mancuerna en cada mano, brazos colgando a los lados y palmas mirando a tus piernas. Los brazos solo sostienen: no los dobles.' },
  frenteMuslos: { n: 'Mancuernas frente a los muslos', d: 'Mancuernas delante de los muslos, palmas hacia ti. Bajan rozando las piernas, con los brazos rectos todo el tiempo.' },
  goblet: { n: 'Mancuerna pegada al pecho', d: 'Mancuerna parada, agarrada con las dos manos por debajo del disco de arriba. Pegada al pecho y con los codos apuntando al piso.' },
  espalda: { n: 'Barra en la espalda', d: 'La barra descansa en los trapecios, no en el cuello. Manos más abiertas que los hombros, palmas al frente y muñecas rectas: las manos solo la sujetan.' },
  cadera: { n: 'Barra sobre la cadera', d: 'La barra, con almohadilla, sobre el pliegue de la cadera. Las manos la sujetan a los lados para que no ruede.' },
  caderaManc: { n: 'Mancuerna sobre la cadera', d: 'La mancuerna acostada sobre la cadera, sujeta con las dos manos por los discos para que no ruede.' },
  hombrosCarga: { n: 'Mancuernas en los hombros', d: 'Una mancuerna apoyada en cada hombro, palmas enfrentadas y codos al frente.' },
  entrePiernas: { n: 'Mancuerna entre las piernas', d: 'Mancuerna parada colgando entre las piernas, agarrada con las dos manos por el disco de arriba. Brazos rectos.' },
  rodilla: { n: 'Mancuerna sobre la rodilla', d: 'La mancuerna acostada sobre el muslo, cerca de la rodilla. Las manos solo la sujetan para que no se caiga.' },
  unaMano: { n: 'Mancuerna en una mano', d: 'La mancuerna en la mano del lado que trabaja, brazo colgando. Con la otra mano te apoyas en la pared.' },
  colgandoBarra: { n: 'Barra pegada a las piernas', d: 'Manos al ancho de los hombros, palmas hacia ti y brazos rectos. La barra baja rozando las piernas.' },
};

export const ACCESORIOS = {
  'barra-jalon': { n: 'Barra de jalón ancha', otros: 'barra lat, barra de dorsales', reconoce: 'Barra larga con las puntas dobladas hacia abajo y mangos de goma; cuelga de la polea alta.', si: 'Barra recta larga, con las manos en la parte recta.' },
  'barra-recta': { n: 'Barra recta corta', otros: 'barra de tríceps, barra corta', reconoce: 'Barra recta de unos 50-60 cm, con un gancho que gira en el centro.', si: 'Barra Z o dos manijas individuales.' },
  'barra-z': { n: 'Barra Z de polea', otros: 'barra EZ, barra W', reconoce: 'Barra corta con dos curvas en el centro, en forma de W.', si: 'Barra recta corta.' },
  triangulo: { n: 'Agarre en V (triángulo)', otros: 'triángulo, V, agarre de remo', reconoce: 'Pieza de metal en forma de triángulo con dos mangos juntos abajo.', si: 'Dos manijas individuales juntas, o los extremos de la cuerda.' },
  cuerda: { n: 'Cuerda', otros: 'cuerda de tríceps, soga', reconoce: 'Soga gruesa doble, con topes de goma en las puntas.', si: 'Dos manijas individuales (en face pull, a la altura de la cara).' },
  manija: { n: 'Manija individual (estribo)', otros: 'estribo, agarre D, manija', reconoce: 'Manija en forma de D con un mango de goma, para una mano.', si: 'Una de las manijas del triángulo o el extremo de la cuerda.' },
  'barra-remo': { n: 'Barra de remo larga', otros: 'barra de remo, barra con agarres', reconoce: 'Barra larga con las puntas dobladas y mangos de goma, para remo en polea baja.', si: 'Barra recta larga.' },
  tobillera: { n: 'Tobillera', otros: 'tobillera de polea, correa de tobillo', reconoce: 'Correa acolchada con velcro y una argolla de metal; se ata al tobillo.', si: 'Hacer el ejercicio con banda elástica.' },
  banda: { n: 'Banda elástica', otros: 'liga, banda de resistencia, mini band', reconoce: 'Liga de goma; el color indica la dureza, de la más clara (suave) a la más oscura (dura).', si: 'Una toalla (para pull-apart) o hacerlo sin banda, más lento.' },
  balon: { n: 'Balón medicinal', otros: 'balón de peso, med ball', reconoce: 'Balón pesado de goma, de 2 a 6 kg, con el peso escrito.', si: 'Una mancuerna ligera agarrada con las dos manos (nunca para lanzarla).' },
  fitball: { n: 'Pelota grande (fitball)', otros: 'pelota suiza, balón de pilates', reconoce: 'Pelota inflable grande, de 55 a 75 cm.', si: 'Un banco o el piso con los talones apoyados.' },
};

export const REGLAS_AGARRE = [
  { t: 'Pulgar siempre rodeando', d: 'Nunca agarres sin pulgar: la barra se te puede resbalar.' },
  { t: 'Muñeca recta', d: 'Que no se doble hacia atrás. El peso va sobre el talón de la mano.' },
  { t: 'Revisa la polea antes de cada serie', d: 'El mosquetón de la boquilla bien cerrado, el cable sin torcer y el pin del peso metido hasta el fondo.' },
  { t: 'Si duele, cambia de agarre', d: 'Si te duele la muñeca, el codo o el hombro, pasa por ejemplo de pronado a neutro, o baja el peso.' },
  { t: 'La primera vez, pregunta', d: 'Pídele a un instructor que te muestre dónde están los accesorios y que te revise el agarre.' },
];

const lista = x => (Array.isArray(x) ? x : x ? [x] : []);
// ['a', 'b', 'c'] → "a, b o c"
const unir = (xs, f) => { const t = xs.map(f); return t.length > 1 ? `${t.slice(0, -1).join(', ')} o ${t.at(-1)}` : t[0] || ''; };
export const tieneAgarre = a => !!a && lista(a.manos).some(m => MANOS[m]);
export const tieneEquipo = a => !!a && lista(a.equipo).some(e => ACCESORIOS[e]);
export const esPierna = a => !!a && !!CARGAS[a.carga];
export const textoAgarre = a => {
  const m = unir(lista(a.manos).filter(x => MANOS[x]), x => MANOS[x].n.toLowerCase());
  const an = unir(lista(a.ancho).filter(x => ANCHOS[x]), x => ANCHOS[x].n.toLowerCase());
  return (m.charAt(0).toUpperCase() + m.slice(1)) + (an ? ` · ${an}` : '');
};
export const textoEquipo = a => unir(lista(a.equipo).filter(e => ACCESORIOS[e]), e => ACCESORIOS[e].n);

// ── Posiciones del ejercicio, vistas de frente ───────────────
// y: altura de las manos en la figura · ante: hacia dónde sale el antebrazo desde la mano
// vista: qué cara de la mano ve alguien parado al frente · codo: dónde queda el codo (s = hombro, h = mano, l = lado)
const V_ARRIBA = { pronado: 'palma', supino: 'dorso', neutro: 'canto', diagonal: 'palma' };
const V_JALAR = { pronado: 'dorso', supino: 'palma', neutro: 'canto', diagonal: 'palma' };
const POSES = {
  arriba: { y: 12, ante: 'abajo', vista: V_ARRIBA, codo: (s, h, l) => [(s[0] + h[0]) / 2 + l * 12, (s[1] + h[1]) / 2] },
  empujeArriba: { y: 26, ante: 'abajo', vista: V_ARRIBA, codo: (s, h, l) => [h[0] + l * 6, s[1] + 20] },
  hombrosC: { y: 58, ante: 'abajo', vista: V_ARRIBA, codo: (s, h, l) => [h[0] + l * 4, s[1] + 34] },
  espalda: { y: 54, ante: 'abajo', vista: V_ARRIBA, codo: (s, h, l) => [h[0] + l * 10, s[1] + 30] },
  jalonAbajo: { y: 72, ante: 'abajo', vista: V_ARRIBA, codo: (s, h, l, c) => [c.ancho === 'cerrado' ? h[0] + l * 16 : h[0], h[1] + 36] },
  empujeFrente: { y: 84, ante: 'abajo', vista: V_ARRIBA, codo: (s, h, l) => [s[0] + l * 24, s[1] + 26] },
  jalarCara: { y: 44, ante: 'abajo', vista: V_JALAR, codo: (s, h, l) => [s[0] + l * 30, s[1] + 4] },
  jalarFrente: { y: 94, ante: 'abajo', vista: V_JALAR, codo: (s, h, l) => [s[0] + l * 16, s[1] + 40] },
  sostener: { y: 86, ante: 'abajo', vista: V_JALAR, codo: (s, h, l) => [s[0] + l * 4, s[1] + 40] },
  triceps: { y: 114, ante: 'arriba', vista: V_JALAR, codo: (s, h, l) => [s[0] + l * 2, s[1] + 40] },
  cadera: { y: 124, ante: 'arriba', vista: V_JALAR, codo: (s, h, l) => [(s[0] + h[0]) / 2 + l * 10, (s[1] + h[1]) / 2] },
  colgando: { y: 140, ante: 'arriba', vista: V_JALAR, codo: (s, h, l) => [(s[0] + h[0]) / 2 + l * 3, (s[1] + h[1]) / 2] },
  piso: { y: 184, ante: 'arriba', vista: {}, codo: (s, h) => [(s[0] + h[0]) / 2, (s[1] + h[1]) / 2] },
};
// Hacia dónde miran las palmas, dicho con partes del cuerpo (sin depender de quién mira)
const PALMAS = {
  arriba: { pronado: 'Palmas hacia adelante, mirando lejos de tu cara.', supino: 'Palmas hacia tu cara.', neutro: 'Palmas enfrentadas, una frente a la otra.', diagonal: 'Palmas hacia adelante, un poco giradas hacia adentro.' },
  empujeArriba: { pronado: 'Palmas hacia adelante, con las muñecas rectas encima de los codos.', supino: 'Palmas hacia tu cara al empezar.', neutro: 'Palmas enfrentadas, una frente a la otra.', diagonal: 'Palmas hacia adelante, un poco giradas hacia adentro.' },
  espalda: { pronado: 'Palmas hacia adelante.', neutro: 'Palmas enfrentadas, con las manos junto a la cabeza.' },
  empujeFrente: { pronado: 'Palmas hacia afuera, en la dirección en que empujas; nudillos hacia ti.', supino: 'Palmas hacia ti.', neutro: 'Palmas enfrentadas, una frente a la otra.', diagonal: 'Palmas hacia afuera, un poco giradas hacia adentro.' },
  jalarCara: { pronado: 'Palmas hacia el piso.', neutro: 'Palmas enfrentadas, con los pulgares apuntando hacia ti.' },
  jalarFrente: { pronado: 'Palmas hacia el piso, nudillos al frente.', supino: 'Palmas hacia el techo.', neutro: 'Palmas enfrentadas, pulgares hacia arriba.', diagonal: 'Palmas hacia el techo, un poco giradas hacia adentro.' },
  sostener: { neutro: 'Palmas enfrentadas, sosteniendo el peso frente al pecho.', pronado: 'Palmas enfrentadas, sosteniendo el peso frente al pecho.' },
  triceps: { pronado: 'Palmas hacia el piso, nudillos al frente.', supino: 'Palmas hacia el techo.', neutro: 'Palmas enfrentadas, pulgares hacia arriba.' },
  cadera: { pronado: 'Palmas hacia abajo, sobre la barra.', neutro: 'Palmas sobre el peso, sujetándolo.' },
  colgando: { pronado: 'Palmas hacia tus piernas, nudillos al frente.', supino: 'Palmas hacia el frente.', neutro: 'Palmas enfrentadas, pulgares al frente.', diagonal: 'Palmas hacia el frente, un poco giradas hacia adentro, en las curvas de la barra Z.' },
  piso: { pronado: 'Palmas apoyadas en el piso, dedos hacia adelante.' },
};
// Piernas: posición y peso de la figura para cada forma de llevar la carga
const CARGA_FIG = {
  lados: { pos: 'colgando', imp: 'mancuernas', manos: 'neutro', sep: 33 },
  frenteMuslos: { pos: 'colgando', imp: 'mancuernas', manos: 'neutro', sep: 16 },
  goblet: { pos: 'sostener', imp: 'mancuerna1', manos: 'neutro' },
  espalda: { pos: 'espalda', imp: 'barra', manos: 'pronado', ancho: 'ancho' },
  cadera: { pos: 'cadera', imp: 'barra', manos: 'pronado', ancho: 'ancho' },
  caderaManc: { pos: 'cadera', imp: 'mancuernaH', manos: 'neutro', sep: 15 },
  hombrosCarga: { pos: 'hombrosC', imp: 'mancuernas', manos: 'neutro', sep: 22 },
  entrePiernas: { pos: 'colgando', imp: 'mancuerna1', manos: 'neutro', y: 150 },
  rodilla: { pos: 'cadera', imp: 'mancuernaH', manos: 'neutro', sep: 15, y: 140 },
  unaMano: { pos: 'colgando', imp: 'mancuernaUna', manos: 'neutro', sep: 33, pared: true },
  colgandoBarra: { pos: 'colgando', imp: 'barra', manos: 'pronado', ancho: 'hombros' },
};
const POLEA = ['barra-jalon', 'barra-recta', 'barra-z', 'triangulo', 'cuerda', 'manija', 'barra-remo'];
const UNA = ['manija', 'mancuernaUna', 'bandaUna'];

// Todo lo que hace falta para dibujar un ejercicio
function contexto(a) {
  if (esPierna(a)) return { ...CARGA_FIG[a.carga], polea: false };
  const manos = lista(a.manos).find(m => MANOS[m]) || 'pronado';
  const pos = POSES[a.pos] ? a.pos : 'colgando';
  return { pos, manos, imp: a.imp || 'barra', ancho: lista(a.ancho).find(x => ANCHOS[x]) || null, polea: lista(a.equipo).some(e => POLEA.includes(e)) };
}
function vistaDe(c) {
  if (c.imp === 'piso') return 'plana';
  if (c.imp === 'balon') return 'abierta';
  if (['cuerda', 'triangulo', 'mancuerna1', 'manijaJuntas', 'bandaUna'].includes(c.imp)) return 'canto';
  return POSES[c.pos].vista[c.manos] || 'canto';
}

// ── Dibujos ──────────────────────────────────────────────────
const ICONO_MANO = '<svg class="ag-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V13M17 9.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L3.3 14a1.6 1.6 0 0 1 2.7-1.7L8 15"/></svg>';
const ICONO_PESA = '<svg class="ag-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7v10M18 7v10M3 9.5v5M21 9.5v5M6 12h12"/></svg>';
// trazo(): forma redondeada con borde (dedos, pulgar, antebrazo, brazos)
const trazo = (d, w, cls = '') => `<path class="ag-borde-t ${cls}" d="${d}" stroke-width="${w + 5}"/><path class="ag-piel-t" d="${d}" stroke-width="${w}"/>`;
const r = n => Math.round(n * 10) / 10;

// Formas de la mano. La barra pasa horizontal por y = 0, el antebrazo sale hacia +y y el pulgar queda del lado -x.
const FORMAS = {
  // Se ve el dorso: nudillos arriba, la barra pasa por detrás de la mano
  dorso: () => `${trazo('M0 80 L0 46', 36)}
    <rect class="ag-piel" x="-28" y="-22" width="56" height="70" rx="20"/>
    ${[-19, -7, 5, 17].map(x => trazo(`M${x} -19 L${x} -16`, 12)).join('')}
    ${[-19, -7, 5].map(x => `<path class="ag-linea" d="M${x + 6} -6 v14"/>`).join('')}
    ${trazo('M-24 30 Q-42 24 -42 6 Q-42 -8 -32 -12', 13, 'ag-pulgar')}`,
  // Se ve la palma: los dedos pasan por delante de la barra y el pulgar los cruza
  palma: () => `${trazo('M0 80 L0 46', 36)}
    <rect class="ag-piel" x="-28" y="-26" width="56" height="76" rx="20"/>
    ${[-19, -7, 5, 17].map(x => trazo(`M${x} -14 L${x} 18`, 12)).join('')}
    ${[-19, -7, 5, 17].map(x => `<path class="ag-linea" d="M${x - 4} 4 h8"/>`).join('')}
    ${trazo('M-28 44 Q-26 22 18 20', 13, 'ag-pulgar')}`,
  // De canto (agarre neutro): se ve el lado del pulgar, el mango va vertical
  canto: () => `${trazo('M0 82 L0 34', 32)}
    <rect class="ag-piel" x="-22" y="-24" width="44" height="54" rx="16"/>
    <path class="ag-linea" d="M-14 -6 q14 7 28 0 M-14 8 q14 7 28 0"/>
    ${trazo('M-16 24 Q-24 -4 6 -18', 12, 'ag-pulgar')}`,
  // Mano abierta (a los lados del balón)
  abierta: () => `${trazo('M0 76 L0 24', 28)}
    ${[-12, -4, 4, 12].map(x => trazo(`M${x} -14 L${r(x * 1.25)} -42`, 8)).join('')}
    <rect class="ag-piel" x="-17" y="-20" width="34" height="46" rx="13"/>
    ${trazo('M-15 8 Q-30 -2 -30 -18', 9, 'ag-pulgar')}`,
  // Mano plana en el piso, vista desde arriba
  plana: () => `${[-15, -5, 5, 15].map(x => trazo(`M${x} -6 L${x} -40`, 9)).join('')}
    <rect class="ag-piel" x="-21" y="-12" width="42" height="46" rx="14"/>
    ${trazo('M-19 20 Q-34 14 -38 -2', 10, 'ag-pulgar')}`,
};
const mano = (forma, x, y, { espejo = false, voltear = false, giro = 0, esc = 0.8 } = {}) =>
  `<g transform="translate(${r(x)} ${r(y)}) rotate(${giro}) scale(${(espejo ? -1 : 1) * esc} ${(voltear ? -1 : 1) * esc})">${FORMAS[forma]()}</g>`;

// Las dos manos de cerca, tal como las ve alguien parado al frente
export function dibujoManos(a) {
  const c = contexto(a), P = POSES[c.pos], vista = vistaDe(c);
  const voltear = P.ante === 'arriba', B = voltear ? 94 : 52, s = voltear ? -1 : 1;
  // Pulgar hacia adentro cuando se ve la palma con el antebrazo abajo, o el dorso con el antebrazo arriba
  const dentro = (vista === 'palma') === (P.ante === 'abajo');
  const una = UNA.includes(c.imp);
  const sep = { barraZ: 37, cuerda: 32, triangulo: 22, mancuerna1: 19, manijaJuntas: 13, balon: 50, piso: 52 }[c.imp]
    ?? { cerrado: 34, hombros: 62, ancho: 86 }[c.ancho] ?? 62;
  const xs = una ? [120] : [120 - sep, 120 + sep];
  const ap = Math.max(6, B - 64); // punto de donde cuelga la polea
  let fondo = '', frente = '';
  const enMano = f => xs.map(f).join('');
  switch (c.imp) {
    case 'barra': case 'barraFija': case 'barraRemo': fondo = `<rect class="ag-barra" x="4" y="${B - 7}" width="232" height="14" rx="7"/>`; break;
    case 'barraCorta': fondo = `<rect class="ag-barra" x="26" y="${B - 7}" width="188" height="14" rx="7"/>`; break;
    case 'barraJalon': fondo = `<path class="ag-barra-l" d="M8 ${B + s * 30} Q12 ${B} 36 ${B} L204 ${B} Q228 ${B} 232 ${B + s * 30}"/>`; break;
    case 'barraZ': fondo = `<path class="ag-barra-l" d="M6 ${B} L70 ${B} L96 ${B + 16} L120 ${B} L144 ${B + 16} L170 ${B} L234 ${B}"/>`; break;
    case 'banda': fondo = vista === 'canto' ? enMano(x => `<path class="ag-banda-l" d="M${x} ${B - 50} L${x} ${B + 44}"/>`) : `<path class="ag-banda-l" d="M4 ${B} Q120 ${B + 8} 236 ${B}"/>`; break;
    case 'bandaUna': fondo = enMano(x => `<path class="ag-banda-l" d="M${x} ${B - 50} L${x} ${B + 44}"/>`); break;
    case 'mancuernas': case 'mancuernaUna':
      fondo = enMano(x => (vista === 'canto' ? `<circle class="ag-disco" cx="${x}" cy="${B}" r="34"/>`
        : `<rect class="ag-barra" x="${x - 46}" y="${B - 7}" width="92" height="14" rx="5"/><rect class="ag-disco" x="${x - 56}" y="${B - 32}" width="13" height="64" rx="4"/><rect class="ag-disco" x="${x + 43}" y="${B - 32}" width="13" height="64" rx="4"/>`)); break;
    case 'manijas': fondo = enMano(x => (vista === 'canto' ? `<rect class="ag-mango" x="${x - 8}" y="${B - 46}" width="16" height="92" rx="8"/>` : `<rect class="ag-mango" x="${x - 44}" y="${B - 8}" width="88" height="16" rx="8"/>`)); break;
    case 'manija': fondo = enMano(x => (vista === 'canto'
      ? `<path class="ag-marco" d="M${x} ${B - 44} L${x + 42} ${B - 26} L${x + 42} ${B + 26} L${x} ${B + 44}"/><rect class="ag-mango" x="${x - 8}" y="${B - 44}" width="16" height="88" rx="8"/>`
      : `<path class="ag-marco" d="M${x - 42} ${B} L${x} ${B - s * 50} L${x + 42} ${B}"/><rect class="ag-mango" x="${x - 42}" y="${B - 8}" width="84" height="16" rx="8"/>`)); break;
    case 'manijaJuntas': fondo = `<path class="ag-marco" d="M120 ${ap} L120 ${B - 40}"/><rect class="ag-mango" x="112" y="${B - 44}" width="16" height="88" rx="8"/>`; break;
    case 'cuerda': fondo = enMano(x => `<path class="ag-cuerda" d="M120 ${ap} L${x} ${B - 26} L${x} ${B + 30}"/><rect class="ag-tope" x="${x - 11}" y="${B + 30}" width="22" height="18" rx="7"/>`); break;
    case 'triangulo': fondo = `<path class="ag-marco" d="M120 ${ap} L${xs[0]} ${B - 40} M120 ${ap} L${xs[1]} ${B - 40} M${xs[0]} ${B + 40} L${xs[1]} ${B + 40}"/>` + enMano(x => `<rect class="ag-mango" x="${x - 8}" y="${B - 42}" width="16" height="84" rx="8"/>`); break;
    case 'mancuerna1': fondo = `<rect class="ag-barra" x="113" y="${B - 36}" width="14" height="90" rx="5"/><rect class="ag-disco" x="80" y="${B - 52}" width="80" height="18" rx="5"/><rect class="ag-disco" x="80" y="${B + 50}" width="80" height="18" rx="5"/>`; break;
    case 'balon': frente = `<circle class="ag-balon" cx="120" cy="${B + 8}" r="44"/><path class="ag-linea" d="M76 ${B + 8} Q120 ${B + 26} 164 ${B + 8}"/>`; break;
    case 'piso': fondo = `<rect class="ag-piso" x="0" y="${B + 30}" width="240" height="8" rx="4"/>`; break;
  }
  let manos;
  if (vista === 'abierta') manos = mano('abierta', 120 - sep, B + 4, { giro: -14 }) + mano('abierta', 120 + sep, B + 4, { giro: 14, espejo: true });
  else if (vista === 'plana') manos = mano('plana', 120 - sep, B, { espejo: true }) + mano('plana', 120 + sep, B);
  else if (una) manos = mano(vista, 120, B, { espejo: vista === 'canto' ? false : dentro, voltear });
  else {
    const z = c.imp === 'barraZ', y = z ? B + 8 : c.imp === 'mancuerna1' ? B - 22 : B;
    manos = mano(vista, xs[0], y, { espejo: vista === 'canto' ? false : dentro, voltear, giro: z ? 32 : 0 })
      + mano(vista, xs[1], y, { espejo: vista === 'canto' ? true : !dentro, voltear, giro: z ? -32 : 0 });
  }
  return `<svg class="ag-svg ag-manos" viewBox="0 0 240 150" role="img" aria-label="Tus manos vistas de frente: ${MANOS[c.manos]?.n || ''}">${fondo}${manos}${frente}</svg>`;
}

// La persona de frente con los brazos en la posición del ejercicio y el peso en las manos
// op.guias: marca el ancho de los hombros y resalta los antebrazos (para el ancho del agarre)
export function dibujoFigura(a, op = {}) {
  const c = a.pos && !a.manos ? a : contexto(a); // también acepta un contexto ya armado
  const P = POSES[c.pos], vista = vistaDe(c), y = c.y ?? P.y;
  const sep = c.sep ?? { cuerda: 12, triangulo: 8, mancuerna1: 6, manijaJuntas: 4, balon: 17, barraZ: 20 }[c.imp]
    ?? { cerrado: 12, hombros: 26, ancho: 50 }[c.ancho] ?? (c.imp === 'mancuernas' && c.pos === 'colgando' ? 33 : 28);
  const una = UNA.includes(c.imp), piso = c.pos === 'piso', sy = piso ? 128 : 60;
  const lados = una ? [-1] : [-1, 1];
  const H = lados.map(l => [100 + l * sep, y]);
  const brazo = (l, h, codo, extra = '') => trazo(`M${100 + l * 25} ${sy} L${r(codo[0])} ${r(codo[1])} L${r(h[0])} ${r(h[1])}`, 8, extra);
  let brazos = lados.map((l, i) => brazo(l, H[i], P.codo([100 + l * 25, sy], H[i], l, c))).join('');
  if (op.guias) brazos += lados.map((l, i) => { const e = P.codo([100 + l * 25, sy], H[i], l, c); return `<path class="ag-antebrazo" d="M${r(e[0])} ${r(e[1])} L${r(H[i][0])} ${r(H[i][1])}"/>`; }).join('');
  if (una) brazos += c.pared ? `${trazo('M125 60 L156 64 L184 64', 8)}<rect class="ag-pared" x="190" y="20" width="8" height="170" rx="3"/>` : trazo('M125 60 L131 96 L133 132', 8);
  // Peso o accesorio
  const L = c.ancho === 'ancho' ? 84 : 62, discos = ['espalda', 'colgando', 'cadera', 'empujeFrente', 'empujeArriba'].includes(c.pos);
  const mini = ([x, yy]) => (vista === 'canto' ? `<circle class="ag-fdisco" cx="${x}" cy="${yy}" r="9"/>` : `<path class="ag-fbar" d="M${x - 10} ${yy} H${x + 10}"/><rect class="ag-fdisco" x="${x - 14}" y="${yy - 7}" width="5" height="14" rx="1.5"/><rect class="ag-fdisco" x="${x + 9}" y="${yy - 7}" width="5" height="14" rx="1.5"/>`);
  const cable = dir => (c.polea ? `<path class="ag-cable" d="M100 ${y} V${dir < 0 ? 0 : 196}"/>` : '');
  let peso = '', detras = '';
  switch (c.imp) {
    case 'barra': { const b = `<path class="ag-fbar" d="M${100 - L} ${y} H${100 + L}"/>${discos ? `<rect class="ag-fdisco" x="${100 - L - 2}" y="${y - 15}" width="8" height="30" rx="2"/><rect class="ag-fdisco" x="${100 + L - 6}" y="${y - 15}" width="8" height="30" rx="2"/>` : ''}`; if (c.pos === 'espalda') detras = b; else peso = b; break; }
    case 'barraFija': peso = `<path class="ag-fbar" d="M4 ${y} H196"/>`; break;
    case 'barraCorta': peso = `${cable(c.pos === 'colgando' ? 1 : -1)}<path class="ag-fbar" d="M58 ${y} H142"/>`; break;
    case 'barraRemo': peso = `<path class="ag-fbar" d="M30 ${y + 8} Q30 ${y} 40 ${y} H160 Q170 ${y} 170 ${y + 8}"/>`; break;
    case 'barraJalon': peso = `${cable(-1)}<path class="ag-fbar" d="M24 ${y + 10} Q26 ${y} 38 ${y} H162 Q174 ${y} 176 ${y + 10}"/>`; break;
    case 'barraZ': peso = `${cable(c.pos === 'colgando' ? 1 : -1)}<path class="ag-fbar" d="M58 ${y} H74 L84 ${y + 5} L100 ${y} L116 ${y + 5} L126 ${y} H142"/>${c.polea ? '' : `<rect class="ag-fdisco" x="52" y="${y - 10}" width="6" height="20" rx="2"/><rect class="ag-fdisco" x="142" y="${y - 10}" width="6" height="20" rx="2"/>`}`; break;
    case 'mancuernas': case 'mancuernaUna': peso = H.map(mini).join(''); break;
    // Parada, con las manos justo debajo del disco de arriba
    case 'mancuerna1': peso = `<path class="ag-fbar" d="M100 ${y - 10} V${y + 24}"/><rect class="ag-fdisco" x="87" y="${y - 17}" width="26" height="8" rx="2"/><rect class="ag-fdisco" x="87" y="${y + 22}" width="26" height="8" rx="2"/>`; break;
    case 'mancuernaH': peso = `<path class="ag-fbar" d="M84 ${y} H116"/><rect class="ag-fdisco" x="78" y="${y - 9}" width="7" height="18" rx="2"/><rect class="ag-fdisco" x="115" y="${y - 9}" width="7" height="18" rx="2"/>`; break;
    case 'manijas': peso = H.map(([x, yy]) => `<rect class="ag-fmango" x="${x - 3}" y="${yy - 9}" width="6" height="18" rx="3"/>`).join(''); break;
    case 'manija': peso = H.map(([x, yy]) => `${c.polea ? `<path class="ag-cable" d="M${x} ${yy} V${c.pos === 'colgando' ? 196 : 0}"/>` : ''}<rect class="ag-fmango" x="${x - 8}" y="${yy - 3}" width="16" height="6" rx="3"/>`).join(''); break;
    case 'manijaJuntas': peso = `<path class="ag-cable" d="M100 ${y} H200"/><rect class="ag-fmango" x="97" y="${y - 9}" width="6" height="18" rx="3"/>`; break;
    case 'cuerda': { const d = c.pos === 'colgando' ? 26 : -26; peso = `<path class="ag-cable" d="M100 ${y + d} V${d > 0 ? 196 : 0}"/><path class="ag-cuerda" d="M${H[0][0]} ${y + 6} L100 ${y + d} L${H[1][0]} ${y + 6}"/>`; break; }
    case 'triangulo': peso = `${cable(-1)}<path class="ag-fbar" d="M100 ${y - 16} L${H[0][0] - 2} ${y + 4} H${H[1][0] + 2} Z"/>`; break;
    case 'balon': peso = `<circle class="ag-fbalon" cx="100" cy="${y}" r="16"/>`; break;
    case 'banda': peso = `<path class="ag-fbanda" d="M${H[0][0]} ${y} Q100 ${y + 6} ${H[1][0]} ${y}"/>`; break;
    case 'bandaUna': peso = `<path class="ag-fbanda" d="M${H[0][0]} ${y} H0"/>`; break;
    case 'piso': peso = '<rect class="ag-piso" x="0" y="188" width="200" height="6" rx="3"/>'; break;
  }
  const manos = H.map(([x, yy]) => `<circle class="ag-piel" cx="${r(x)}" cy="${r(yy)}" r="6"/>`).join('');
  const guias = op.guias ? '<path class="ag-raya" d="M75 62 V150 M125 62 V150"/>' : '';
  return `<svg class="ag-svg ag-figura" viewBox="0 0 200 196" role="img" aria-label="${CARGAS[a.carga]?.n || 'Posición de las manos en el ejercicio'}">
    ${guias}
    ${piso ? `<path class="ag-fig" d="M75 126 Q100 118 125 126 L118 156 L82 156 Z"/><circle class="ag-fig" cx="100" cy="104" r="14"/>`
    : `<path class="ag-fig-l" d="M91 122 L87 190 M109 122 L113 190"/><path class="ag-fig" d="M75 58 Q100 50 125 58 L117 126 L83 126 Z"/>${detras}<circle class="ag-fig" cx="100" cy="32" r="14"/>`}
    ${brazos}${peso}${manos}
  </svg>`;
}

// Ancho del agarre: posición baja del jalón, con los hombros marcados y los antebrazos resaltados
export const dibujoAncho = ancho => dibujoFigura({ pos: 'jalonAbajo', imp: 'barraFija', ancho, sep: { cerrado: 12, hombros: 25, ancho: 50 }[ancho] }, { guias: true });

// Ícono pequeño del accesorio (para los chips)
const MINI = {
  'barra-jalon': '<path d="M14 54 Q16 40 30 40 H90 Q104 40 106 54 M60 40 V14"/>',
  'barra-recta': '<path d="M26 46 H94 M60 46 V18"/>',
  'barra-z': '<path d="M22 46 H42 L50 38 L60 50 L70 38 L78 46 H98 M60 44 V18"/>',
  triangulo: '<path d="M60 12 L34 56 H86 Z"/>',
  cuerda: '<path d="M60 12 Q54 36 40 60 M60 12 Q66 36 80 60"/>',
  manija: '<path d="M38 20 L30 58 H90 L82 20 Z"/>',
  'barra-remo': '<path d="M14 58 V40 H106 V58 M60 40 V14"/>',
  tobillera: '<rect x="26" y="28" width="68" height="30" rx="15"/><path d="M52 28 Q60 12 68 28"/>',
  banda: '<ellipse cx="60" cy="40" rx="46" ry="20"/>',
  balon: '<circle cx="60" cy="40" r="28"/><path d="M32 40 Q60 52 88 40"/>',
  fitball: '<circle cx="60" cy="38" r="32"/>',
};
const iconoAccesorio = id => `<svg class="ag-ico ag-ico-eq" viewBox="0 0 120 76" aria-hidden="true">${MINI[id] || ''}</svg>`;

// Imagen de referencia del accesorio, tal como lo ves colgado en el gimnasio (cable, mosquetón, mangos de goma)
const DEFS = `<defs>
  <linearGradient id="agMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--ag-metal-c)"/><stop offset=".55" style="stop-color:var(--ag-metal)"/><stop offset="1" style="stop-color:var(--ag-metal-o)"/></linearGradient>
  <linearGradient id="agGoma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--ag-goma-c)"/><stop offset=".5" style="stop-color:var(--ag-goma)"/><stop offset="1" style="stop-color:var(--ag-goma-o)"/></linearGradient>
  <radialGradient id="agBalonG" cx=".35" cy=".3" r=".75"><stop offset="0" style="stop-color:var(--ag-goma-c)"/><stop offset=".6" style="stop-color:var(--ag-goma)"/><stop offset="1" style="stop-color:var(--ag-goma-o)"/></radialGradient>
  <radialGradient id="agFitG" cx=".35" cy=".3" r=".75"><stop offset="0" style="stop-color:var(--ag-fit-c)"/><stop offset=".6" style="stop-color:var(--ag-fit)"/><stop offset="1" style="stop-color:var(--ag-fit-o)"/></radialGradient>
</defs>`;
const GANCHO = '<path class="ag-cable" d="M120 0 V14"/><rect class="ag-mosq" x="112" y="12" width="16" height="28" rx="8"/><path class="ag-mosq" d="M124 17 V35"/>';
const GIRO = '<rect x="110" y="38" width="20" height="16" rx="4" fill="url(#agMetal)"/>';
const estrias = (x1, x2, y1, y2, paso = 5) => `<path class="ag-estria" d="${Array.from({ length: Math.floor((x2 - x1) / paso) }, (_, i) => `M${x1 + (i + 1) * paso} ${y1} V${y2}`).join(' ')}"/>`;
const FOTOS = {
  'barra-jalon': `${GANCHO}${GIRO}
    <rect x="44" y="54" width="152" height="11" rx="5" fill="url(#agMetal)"/>
    <path class="ag-metal-l" d="M48 59.5 Q32 59.5 24 74 L16 92 M192 59.5 Q208 59.5 216 74 L224 92"/>
    <path class="ag-goma-l" d="M23 76 L11 104 M217 76 L229 104"/><path class="ag-goma-tex" d="M23 76 L11 104 M217 76 L229 104"/>`,
  'barra-recta': `${GANCHO}${GIRO}
    <rect x="34" y="54" width="172" height="13" rx="6" fill="url(#agMetal)"/>${estrias(50, 108, 55, 66)}${estrias(132, 190, 55, 66)}
    <rect x="28" y="51" width="8" height="19" rx="3" fill="url(#agMetal)"/><rect x="204" y="51" width="8" height="19" rx="3" fill="url(#agMetal)"/>`,
  'barra-z': `${GANCHO}${GIRO}
    <path class="ag-metal-l" d="M26 64 H80 L96 78 L110 58 H130 L144 78 L160 64 H214"/>${estrias(36, 76, 59, 69)}${estrias(164, 204, 59, 69)}
    <rect x="20" y="56" width="8" height="17" rx="3" fill="url(#agMetal)"/><rect x="212" y="56" width="8" height="17" rx="3" fill="url(#agMetal)"/>`,
  triangulo: `${GANCHO}
    <path d="M114 40 L80 106 H92 L120 54 L148 106 H160 L126 40 Z" fill="url(#agMetal)"/>
    <rect x="70" y="102" width="46" height="18" rx="9" fill="url(#agGoma)"/><rect x="124" y="102" width="46" height="18" rx="9" fill="url(#agGoma)"/>${estrias(72, 114, 104, 118, 6)}${estrias(126, 168, 104, 118, 6)}`,
  cuerda: `${GANCHO}<rect x="112" y="38" width="16" height="20" rx="4" fill="url(#agMetal)"/>
    <path class="ag-cuerda-g" d="M116 56 Q102 92 80 128 M124 56 Q138 92 160 128"/><path class="ag-cuerda-t" d="M116 56 Q102 92 80 128 M124 56 Q138 92 160 128"/>
    <rect x="66" y="124" width="26" height="24" rx="9" fill="url(#agGoma)" transform="rotate(30 79 136)"/><rect x="148" y="124" width="26" height="24" rx="9" fill="url(#agGoma)" transform="rotate(-30 161 136)"/>`,
  manija: `${GANCHO}
    <path class="ag-metal-l" d="M112 42 L82 102 M128 42 L158 102 M112 42 H128"/>
    <rect x="72" y="98" width="96" height="22" rx="11" fill="url(#agGoma)"/>${estrias(78, 162, 101, 117, 6)}`,
  'barra-remo': `${GANCHO}${GIRO}
    <rect x="30" y="54" width="180" height="12" rx="6" fill="url(#agMetal)"/>
    <path class="ag-metal-l" d="M34 60 Q18 60 18 76 V86 M206 60 Q222 60 222 76 V86"/>
    <path class="ag-goma-l" d="M18 80 V116 M222 80 V116"/><path class="ag-goma-tex" d="M18 80 V116 M222 80 V116"/>`,
  tobillera: `${GANCHO}
    <path class="ag-metal-l ag-fino" d="M106 52 Q106 36 120 36 Q134 36 134 52"/>
    <rect x="104" y="46" width="32" height="18" rx="4" class="ag-tela-c"/>
    <rect x="46" y="58" width="148" height="66" rx="30" class="ag-tela"/>
    <rect x="58" y="68" width="124" height="46" rx="22" class="ag-costura"/>
    <rect x="150" y="66" width="52" height="50" rx="14" class="ag-tela-c"/>${estrias(156, 196, 72, 110, 4)}`,
  banda: `${[1, 2, 3, 4].map(k => `<ellipse cx="120" cy="${k * 34 - 6}" rx="92" ry="12" class="ag-banda-f" style="stroke:var(--ag-b${k})"/>`).join('')}
    <text class="ag-txt" x="120" y="32" text-anchor="middle">suave</text><text class="ag-txt" x="120" y="134" text-anchor="middle">dura</text>`,
  balon: `<ellipse class="ag-sombra" cx="120" cy="146" rx="50" ry="8"/>
    <circle cx="120" cy="80" r="60" fill="url(#agBalonG)"/>
    <path class="ag-costura-b" d="M60 80 Q120 104 180 80 M120 20 Q96 80 120 140"/>
    <rect x="96" y="58" width="48" height="22" rx="6" class="ag-etiqueta"/><text class="ag-txt-e" x="120" y="74" text-anchor="middle">4 kg</text>`,
  fitball: `<ellipse class="ag-sombra" cx="120" cy="148" rx="62" ry="8"/>
    <circle cx="120" cy="76" r="70" fill="url(#agFitG)"/>
    <ellipse class="ag-brillo" cx="92" cy="40" rx="24" ry="12" transform="rotate(-30 92 40)"/>`,
};
export const dibujoAccesorio = id => (FOTOS[id] ? `<svg class="ag-svg ag-acc" viewBox="0 0 240 160" role="img" aria-label="${ACCESORIOS[id].n}">${DEFS}${FOTOS[id]}</svg>` : '');

// ── Chips para la tarjeta y la lista de alternativas ─────────
// attr: atributo de toque de la pantalla (p. ej. 'data-a'); sin attr, los chips no son botones
export function chipsAgarre(a, attr) {
  if (!a) return '';
  const tag = attr ? 'button' : 'span', act = attr ? ` type="button" ${attr}="agarre"` : '';
  const chip = (ico, txt, aria, cls = '') => `<${tag} class="ag-chip ${cls}"${act} aria-label="${aria}">${ico}<span>${txt}</span></${tag}>`;
  const eq = lista(a.equipo).find(e => ACCESORIOS[e]);
  return (esPierna(a) ? chip(ICONO_PESA, CARGAS[a.carga].n, `Cómo llevar el peso: ${CARGAS[a.carga].n}`)
    : tieneAgarre(a) ? chip(ICONO_MANO, textoAgarre(a), `Agarre: ${textoAgarre(a)}`) : '')
    + (eq ? chip(iconoAccesorio(eq), textoEquipo(a), `Equipo: ${textoEquipo(a)}`, 'ag-chip-eq') : '');
}

// ── Hoja "Cómo agarrarlo" ────────────────────────────────────
export function hojaAgarre(nombre, a) {
  const manos = lista(a.manos).filter(m => MANOS[m]);
  const anchos = lista(a.ancho).filter(x => ANCHOS[x]);
  const eqs = lista(a.equipo).filter(e => ACCESORIOS[e]);
  const c = contexto(a), m0 = manos[0];
  const obj = { mancuernas: 'la mancuerna', mancuernaUna: 'la mancuerna', mancuerna1: 'la mancuerna', manijas: 'la manija', manija: 'la manija', manijaJuntas: 'la manija', cuerda: 'la cuerda', banda: 'la banda', bandaUna: 'la banda' }[c.imp] || 'la barra';
  let cuerpo;
  if (esPierna(a)) {
    const k = CARGAS[a.carga];
    cuerpo = `<section class="ag-sec">
      <h3 class="ag-h">${ICONO_PESA} ${k.n}</h3>
      <figure class="ag-solo">${dibujoFigura(a)}</figure>
      <p class="ag-palmas">${k.d}</p>
    </section>`;
  } else if (m0) {
    const palmas = PALMAS[c.pos]?.[m0] || MANOS[m0].d;
    const otras = manos.length > 1 ? ` También puedes usar agarre ${unir(manos.slice(1), x => MANOS[x].n.toLowerCase())}, según la manija que elijas.` : '';
    cuerpo = `<section class="ag-sec">
      <h3 class="ag-h">${ICONO_MANO} Manos: ${unir(manos, x => MANOS[x].n.toLowerCase())}</h3>
      <figure class="ag-cerca">${dibujoManos(a)}<figcaption>Tus manos, vistas de frente. <span class="ag-leyenda">En color: el pulgar</span></figcaption></figure>
      <div class="ag-fila">
        <figure class="ag-mini">${dibujoFigura(a)}<figcaption>En el ejercicio</figcaption></figure>
        <div><p class="ag-palmas">${palmas}</p><p class="ag-nota">${c.imp === 'piso' ? 'Apoya toda la palma, no solo los dedos.' : `El pulgar siempre rodea ${obj}.`}${otras}</p></div>
      </div>
    </section>
    ${anchos.length ? `<section class="ag-sec">
      <h3 class="ag-h">Ancho: ${unir(anchos, x => ANCHOS[x].n.toLowerCase())}</h3>
      <div class="ag-fila"><figure class="ag-mini">${dibujoAncho(anchos[0])}</figure><div><p>${ANCHOS[anchos[0]].d}</p><p class="ag-nota">${TRUCO_ANCHO}</p></div></div>
    </section>` : ''}`;
  } else cuerpo = `<section class="ag-sec"><p>Este ejercicio no lleva agarre: el apoyo es en el piso, el banco o las manijas de la máquina.</p></section>`;
  abrirHoja(`
    <p class="eyebrow">Cómo agarrarlo</p>
    <h3 class="hoja-t">${nombre}</h3>
    ${cuerpo}
    ${eqs.map(e => `<section class="ag-sec">
      <h3 class="ag-h">${iconoAccesorio(e)} ${ACCESORIOS[e].n}</h3>
      <figure class="ag-foto">${dibujoAccesorio(e)}<figcaption>Así se ve en el gimnasio</figcaption></figure>
      <p><b>Cómo la reconoces en el gimnasio:</b> ${ACCESORIOS[e].reconoce}</p>
      <p><b>Si no hay, usa:</b> ${ACCESORIOS[e].si}</p>
    </section>`).join('')}
    ${a.nota ? `<p class="ag-clave"><b>Clave:</b> ${a.nota}</p>` : ''}`);
}

// ── Guía de agarres y accesorios ─────────────────────────────
// ejercicios: [{ n, agarre }] para listar dónde se usa cada accesorio
export function guiaAgarresHTML(ejercicios = []) {
  const usos = id => [...new Set(ejercicios.filter(e => lista(e.agarre?.equipo).includes(id)).map(e => e.n))];
  const carrusel = (titulo, items) => `<h3 class="ag-gtit">${titulo}</h3><div class="ag-carrusel" tabindex="0">${items.join('')}</div>`;
  const ejemplo = { pronado: 'barraCorta', supino: 'barraCorta', neutro: 'mancuernas', diagonal: 'barraZ' };
  return `<section class="card ag-guia" id="agarres">
    <div class="card-cab"><h3>Guía de agarres y boquillas</h3></div>
    <p class="ag-sub">Desliza cada fila para ver las tarjetas. Las manos se ven como las vería alguien parado frente a ti, con los brazos colgando.</p>
    ${carrusel('Posición de las manos', Object.entries(MANOS).map(([k, m]) => `<article class="ag-t">${dibujoManos({ manos: k, ancho: 'hombros', pos: 'colgando', imp: ejemplo[k] })}<b>${m.n}</b><p>${m.d}</p><p class="ag-uso">${m.uso}</p></article>`))}
    ${carrusel('Ancho del agarre', [...Object.entries(ANCHOS).map(([k, x]) => `<article class="ag-t">${dibujoAncho(k)}<b>${x.n}</b><p>${x.d}</p><p class="ag-uso">${x.uso}</p></article>`), `<article class="ag-t ag-truco"><b>Truco</b><p>${TRUCO_ANCHO}</p></article>`])}
    ${carrusel('Boquillas de poleas y otros accesorios', Object.entries(ACCESORIOS).map(([k, x]) => { const u = usos(k); return `<article class="ag-t">${dibujoAccesorio(k)}<b>${x.n}</b><p class="ag-uso">También le dicen: ${x.otros}.</p><p>${x.reconoce}</p>${u.length ? `<p class="ag-uso"><b>Se usa en:</b> ${u.slice(0, 6).join(', ')}${u.length > 6 ? '…' : ''}.</p>` : ''}<p class="ag-uso"><b>Si no hay:</b> ${x.si}</p></article>`; }))}
    ${carrusel('Reglas de seguridad del agarre', REGLAS_AGARRE.map((r, i) => `<article class="ag-t"><span class="ag-num">${i + 1}</span><b>${r.t}</b><p>${r.d}</p></article>`))}
  </section>`;
}
