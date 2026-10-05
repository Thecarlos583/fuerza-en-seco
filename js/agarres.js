// Agarres y accesorios: cómo agarrar cada ejercicio y qué accesorio (boquilla de polea, banda, balón…) usar.
// Dibujos SVG propios, sin internet. Mismo archivo en "Mi Rutina" y en "Fuerza en Seco".
// Cada ejercicio trae en data.js su agarre: { manos, ancho, equipo, nota, deducido }
//   manos: pronado · supino · neutro · diagonal · ninguno (o una lista: ['neutro', 'pronado'])
//   ancho: cerrado · hombros · ancho · n/a · equipo: id del catálogo de abajo (o lista) · deducido: no estaba en la tabla
import { abrirHoja } from './util.js';

export const MANOS = {
  pronado: { n: 'Pronado', d: 'Palmas hacia abajo o hacia adelante.', uso: 'Jalones, remos con barra, press y laterales: trabaja fuerte la espalda alta y el hombro.', vista: 'Desde el frente ves el dorso de la mano.' },
  supino: { n: 'Supino', d: 'Palmas hacia ti o hacia arriba.', uso: 'Curls y jalones o remos supinos: el bíceps trabaja más.', vista: 'Desde el frente ves la palma.' },
  neutro: { n: 'Neutro', d: 'Palmas enfrentadas, como si dieras la mano.', uso: 'Martillos, remos con triángulo y press con mancuernas: el más amable con hombros y muñecas.', vista: 'Ves el borde de la mano, del lado del pulgar.' },
  diagonal: { n: 'Diagonal', d: 'A medio camino entre neutro y pronado o supino.', uso: 'Barra Z y press con mancuernas: alivia muñecas y codos.', vista: 'La mano queda inclinada, como en las curvas de la barra Z.' },
};
export const ANCHOS = {
  cerrado: { n: 'Cerrado', d: 'Manos casi juntas, más adentro que los hombros.', uso: 'Triángulo, remos y jalones cerrados.' },
  hombros: { n: 'A los hombros', d: 'Cada mano frente a su hombro.', uso: 'Curls, press militar y peso muerto.' },
  ancho: { n: 'Ancho', d: 'Más abierto que los hombros.', uso: 'Jalón ancho, dominadas, press plano y remo con barra.' },
};
export const TRUCO_ANCHO = 'Para encontrar tu ancho: en la posición baja del movimiento, los antebrazos deben quedar verticales.';

export const ACCESORIOS = {
  'barra-jalon': { n: 'Barra de jalón ancha', otros: 'barra lat, barra de dorsales', reconoce: 'Barra larga con curvas en las puntas; cuelga de la polea alta.', si: 'Barra recta larga, con las manos en la parte recta.' },
  'barra-recta': { n: 'Barra recta corta', otros: 'barra de tríceps, barra corta', reconoce: 'Barra recta de unos 50-60 cm, con un gancho en el centro.', si: 'Barra Z o dos manijas individuales.' },
  'barra-z': { n: 'Barra Z de polea', otros: 'barra EZ, barra W', reconoce: 'Barra corta con dos curvas suaves en el centro.', si: 'Barra recta corta.' },
  triangulo: { n: 'Agarre en V (triángulo)', otros: 'triángulo, V, agarre de remo', reconoce: 'Manija cerrada en forma de triángulo, con dos agarres juntos.', si: 'Dos manijas individuales juntas, o los extremos de la cuerda.' },
  cuerda: { n: 'Cuerda', otros: 'cuerda de tríceps, soga', reconoce: 'Soga gruesa con bolas o topes en las puntas.', si: 'Dos manijas individuales (en face pull, a la altura de la cara).' },
  manija: { n: 'Manija individual (estribo)', otros: 'estribo, agarre D, manija', reconoce: 'Manija sencilla en forma de D, para una mano.', si: 'Una de las manijas del triángulo o el extremo de la cuerda.' },
  'barra-remo': { n: 'Barra de remo larga', otros: 'barra de remo, barra con agarres', reconoce: 'Barra larga con dos agarres separados, para remo en polea baja.', si: 'Barra recta larga.' },
  tobillera: { n: 'Tobillera', otros: 'tobillera de polea, correa de tobillo', reconoce: 'Correa acolchada con velcro y una argolla; se ata al tobillo.', si: 'Hacer el ejercicio con banda elástica.' },
  banda: { n: 'Banda elástica', otros: 'liga, banda de resistencia, mini band', reconoce: 'Liga de goma; el color indica la dureza.', si: 'Una toalla (para pull-apart) o hacerlo sin banda, más lento.' },
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
export const textoAgarre = a => {
  const m = unir(lista(a.manos).filter(x => MANOS[x]), x => MANOS[x].n.toLowerCase());
  const an = unir(lista(a.ancho).filter(x => ANCHOS[x]), x => ANCHOS[x].n.toLowerCase());
  return (m.charAt(0).toUpperCase() + m.slice(1)) + (an ? ` · ${an}` : '');
};
export const textoEquipo = a => unir(lista(a.equipo).filter(e => ACCESORIOS[e]), e => ACCESORIOS[e].n);

// ── Dibujos ──────────────────────────────────────────────────
const ICONO_MANO = '<svg class="ag-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V13M17 9.5a1.5 1.5 0 0 1 3 0V15a7 7 0 0 1-7 7h-1a7 7 0 0 1-6-3.4L3.3 14a1.6 1.6 0 0 1 2.7-1.7L8 15"/></svg>';
const ICONO_EQUIPO = '<svg class="ag-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4" r="2"/><path d="M12 6v4M5 14l7-4 7 4M5 14v3M19 14v3"/></svg>';
const ANGULO = { pronado: 0, supino: 0, neutro: 90, diagonal: 35 };

// Mano agarrando la barra, vista del dorso o de la palma (el antebrazo sale por abajo)
// trazo(): una forma redondeada con borde (dedos, pulgar, antebrazo)
const trazo = (d, w, cls = '') => `<path class="ag-borde-t ${cls}" d="${d}" stroke-width="${w + 5}"/><path class="ag-piel-t" d="${d}" stroke-width="${w}"/>`;
export function dibujoMano(tipo, vista) {
  const ang = ANGULO[tipo] ?? 0;
  const dedos = [53, 65, 77, 89];
  const barra = '<rect class="ag-barra" x="-4" y="44" width="148" height="16" rx="8"/>';
  const mano = vista === 'dorso'
    // Dorso: la barra queda detrás de la mano; se ven los nudillos arriba y el pulgar dando la vuelta por la izquierda
    ? `${barra}
       ${trazo('M71 128 L71 96', 38)}
       <rect class="ag-piel" x="44" y="30" width="56" height="70" rx="20"/>
       ${dedos.map(x => trazo(`M${x} 33 L${x} 36`, 12)).join('')}
       ${dedos.slice(0, 3).map(x => `<path class="ag-linea" d="M${x + 6} 46 v14"/>`).join('')}
       ${trazo('M48 82 Q30 76 30 58 Q30 46 38 42', 13, 'ag-pulgar')}
       <path class="ag-flecha" d="M18 74 Q10 56 20 40"/><path class="ag-flecha-p" d="M20 34 l-7 9 l9 1 z"/>`
    // Palma: los dedos pasan por delante de la barra y el pulgar los cruza para cerrar el agarre
    : `${trazo('M71 128 L71 96', 38)}
       <rect class="ag-piel" x="44" y="26" width="56" height="76" rx="20"/>
       ${barra}
       ${dedos.map(x => trazo(`M${x} 38 L${x} 70`, 12)).join('')}
       ${dedos.map(x => `<path class="ag-linea" d="M${x - 4} 56 h8"/>`).join('')}
       ${trazo('M44 96 Q46 74 90 72', 13, 'ag-pulgar')}
       <path class="ag-flecha" d="M40 112 Q70 120 96 92"/><path class="ag-flecha-p" d="M100 86 l-10 4 l7 7 z"/>`;
  return `<svg class="ag-svg" viewBox="-14 -6 172 136" role="img" aria-label="Mano en agarre ${MANOS[tipo]?.n || ''}, vista ${vista === 'dorso' ? 'del dorso' : 'de la palma'}">
    <g transform="rotate(${ang} 72 62)">${mano}</g>
  </svg>`;
}

// Ancho de las manos respecto a los hombros, visto desde arriba
export function dibujoAncho(ancho) {
  const off = { cerrado: 14, hombros: 34, ancho: 56 }[ancho] ?? 34;
  return `<svg class="ag-svg ag-ancho" viewBox="0 0 200 104" role="img" aria-label="Agarre ${ANCHOS[ancho]?.n || ''}">
    <circle class="ag-cuerpo" cx="100" cy="22" r="12"/>
    <path class="ag-cuerpo-l" d="M66 44 q34 -12 68 0"/>
    <line class="ag-raya" x1="66" y1="44" x2="66" y2="86"/><line class="ag-raya" x1="134" y1="44" x2="134" y2="86"/>
    <rect class="ag-barra" x="12" y="80" width="176" height="10" rx="5"/>
    <rect class="ag-piel" x="${100 - off - 7}" y="74" width="14" height="22" rx="6"/>
    <rect class="ag-piel" x="${100 + off - 7}" y="74" width="14" height="22" rx="6"/>
    <text class="ag-txt" x="100" y="58" text-anchor="middle">hombros</text>
  </svg>`;
}

// Accesorios: dibujos simples y reconocibles
export function dibujoAccesorio(id) {
  const g = {
    'barra-jalon': '<path class="ag-eq" d="M12 46 q4 -10 16 -8 H92 q12 -2 16 8"/><line class="ag-eq" x1="60" y1="38" x2="60" y2="14"/><circle class="ag-gancho" cx="60" cy="10" r="5"/>',
    'barra-recta': '<line class="ag-eq" x1="28" y1="46" x2="92" y2="46"/><line class="ag-eq" x1="60" y1="46" x2="60" y2="22"/><circle class="ag-gancho" cx="60" cy="18" r="5"/>',
    'barra-z': '<path class="ag-eq" d="M24 46 L44 46 L52 38 L60 50 L68 38 L76 46 L96 46"/><line class="ag-eq" x1="60" y1="46" x2="60" y2="22"/><circle class="ag-gancho" cx="60" cy="18" r="5"/>',
    triangulo: '<path class="ag-eq" d="M60 14 L36 54 L84 54 Z"/><line class="ag-eq ag-grueso" x1="44" y1="54" x2="76" y2="54"/><circle class="ag-gancho" cx="60" cy="10" r="5"/>',
    cuerda: '<path class="ag-cuerda" d="M60 14 Q56 34 40 56 M60 14 Q64 34 80 56"/><circle class="ag-tope" cx="40" cy="60" r="6"/><circle class="ag-tope" cx="80" cy="60" r="6"/><circle class="ag-gancho" cx="60" cy="10" r="5"/>',
    manija: '<path class="ag-eq" d="M40 22 Q40 58 60 58 Q80 58 80 22 Z"/><line class="ag-eq ag-grueso" x1="46" y1="52" x2="74" y2="52"/><circle class="ag-gancho" cx="60" cy="16" r="5"/>',
    'barra-remo': '<line class="ag-eq" x1="14" y1="34" x2="106" y2="34"/><line class="ag-eq" x1="30" y1="34" x2="30" y2="58"/><line class="ag-eq" x1="90" y1="34" x2="90" y2="58"/><line class="ag-eq" x1="60" y1="34" x2="60" y2="16"/><circle class="ag-gancho" cx="60" cy="12" r="5"/>',
    tobillera: '<rect class="ag-acol" x="30" y="30" width="60" height="26" rx="13"/><circle class="ag-gancho" cx="60" cy="22" r="6"/><line class="ag-linea" x1="44" y1="43" x2="76" y2="43"/>',
    banda: '<ellipse class="ag-banda" cx="60" cy="40" rx="44" ry="18"/>',
    balon: '<circle class="ag-acol" cx="60" cy="40" r="26"/><path class="ag-linea" d="M34 40 h52 M60 14 q-12 26 0 52 M60 14 q12 26 0 52"/>',
    fitball: '<circle class="ag-acol" cx="60" cy="38" r="32"/><path class="ag-linea" d="M36 22 q24 -10 48 0"/>',
  }[id];
  if (!g) return '';
  return `<svg class="ag-svg ag-acc" viewBox="0 0 120 76" role="img" aria-label="${ACCESORIOS[id].n}">${g}</svg>`;
}

// ── Chips para la tarjeta y la lista de alternativas ─────────
// attr: atributo de toque de la pantalla (p. ej. 'data-a'); sin attr, los chips no son botones
export function chipsAgarre(a, attr) {
  if (!a) return '';
  const tag = attr ? 'button' : 'span', act = attr ? ` type="button" ${attr}="agarre"` : '';
  return (tieneAgarre(a) ? `<${tag} class="ag-chip"${act} aria-label="Agarre: ${textoAgarre(a)}">${ICONO_MANO}<span>${textoAgarre(a)}</span></${tag}>` : '')
    + (tieneEquipo(a) ? `<${tag} class="ag-chip ag-chip-eq"${act} aria-label="Equipo: ${textoEquipo(a)}">${ICONO_EQUIPO}<span>${textoEquipo(a)}</span></${tag}>` : '');
}

// ── Hoja "Cómo agarrarlo" ────────────────────────────────────
export function hojaAgarre(nombre, a) {
  const manos = lista(a.manos).filter(m => MANOS[m]);
  const anchos = lista(a.ancho).filter(x => ANCHOS[x]);
  const eqs = lista(a.equipo).filter(e => ACCESORIOS[e]);
  const m0 = manos[0];
  abrirHoja(`
    <p class="eyebrow">Cómo agarrarlo</p>
    <h3 class="hoja-t">${nombre}</h3>
    ${m0 ? `<section class="ag-sec">
      <h3 class="ag-h">${ICONO_MANO} Manos: ${unir(manos, x => MANOS[x].n.toLowerCase())}</h3>
      <div class="ag-par"><figure>${dibujoMano(m0, 'dorso')}<figcaption>Dorso</figcaption></figure><figure>${dibujoMano(m0, 'palma')}<figcaption>Palma</figcaption></figure></div>
      <p>${MANOS[m0].d} ${MANOS[m0].vista}${manos.length > 1 ? ` También puedes ${unir(manos.slice(1), x => MANOS[x].n.toLowerCase())}, si te queda más cómodo.` : ''}</p>
      <p class="ag-nota">El pulgar siempre rodea la barra.</p>
    </section>` : `<section class="ag-sec"><p>Este ejercicio no lleva agarre: el apoyo es en el piso, el banco o las manijas de la máquina.</p></section>`}
    ${anchos.length ? `<section class="ag-sec">
      <h3 class="ag-h">Ancho: ${unir(anchos, x => ANCHOS[x].n.toLowerCase())}</h3>
      ${dibujoAncho(anchos[0])}
      <p>${ANCHOS[anchos[0]].d}</p>
    </section>` : ''}
    ${eqs.map(e => `<section class="ag-sec">
      <h3 class="ag-h">${ICONO_EQUIPO} ${ACCESORIOS[e].n}</h3>
      ${dibujoAccesorio(e)}
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
  return `<section class="card ag-guia" id="agarres">
    <div class="card-cab"><h3>Guía de agarres y boquillas</h3></div>
    <p class="ag-sub">Desliza cada fila para ver las tarjetas.</p>
    ${carrusel('Posición de las manos', Object.entries(MANOS).map(([k, m]) => `<article class="ag-t">${dibujoMano(k, k === 'supino' ? 'palma' : 'dorso')}<b>${m.n}</b><p>${m.d}</p><p class="ag-uso">${m.uso}</p></article>`))}
    ${carrusel('Ancho del agarre', [...Object.entries(ANCHOS).map(([k, x]) => `<article class="ag-t">${dibujoAncho(k)}<b>${x.n}</b><p>${x.d}</p><p class="ag-uso">${x.uso}</p></article>`), `<article class="ag-t ag-truco"><b>Truco</b><p>${TRUCO_ANCHO}</p></article>`])}
    ${carrusel('Boquillas de poleas y otros accesorios', Object.entries(ACCESORIOS).map(([k, x]) => { const u = usos(k); return `<article class="ag-t">${dibujoAccesorio(k)}<b>${x.n}</b><p class="ag-uso">También le dicen: ${x.otros}.</p><p>${x.reconoce}</p>${u.length ? `<p class="ag-uso"><b>Se usa en:</b> ${u.slice(0, 6).join(', ')}${u.length > 6 ? '…' : ''}.</p>` : ''}<p class="ag-uso"><b>Si no hay:</b> ${x.si}</p></article>`; }))}
    ${carrusel('Reglas de seguridad del agarre', REGLAS_AGARRE.map((r, i) => `<article class="ag-t"><span class="ag-num">${i + 1}</span><b>${r.t}</b><p>${r.d}</p></article>`))}
  </section>`;
}
