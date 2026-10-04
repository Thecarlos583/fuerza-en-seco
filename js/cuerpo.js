// Mapa del cuerpo en SVG, frente y espalda. Las zonas del ejercicio se iluminan con su color.
import { GRUPOS, ZONAS } from './data.js';

const FRENTE = [
  ['', '<circle cx="60" cy="16" r="11"/><rect x="55" y="25" width="10" height="9" rx="3"/>'],
  ['deltoides', '<ellipse cx="39" cy="45" rx="8" ry="9"/><ellipse cx="81" cy="45" rx="8" ry="9"/>'],
  ['pecho', '<path d="M59 38 L46 39 Q39 45 41.5 56 Q49 64 59 60 Z"/><path d="M61 38 L74 39 Q81 45 78.5 56 Q71 64 61 60 Z"/>'],
  ['biceps', '<ellipse cx="34.5" cy="63" rx="5.5" ry="11" transform="rotate(9 34.5 63)"/><ellipse cx="85.5" cy="63" rx="5.5" ry="11" transform="rotate(-9 85.5 63)"/>'],
  ['antebrazo', '<ellipse cx="29.5" cy="88" rx="5" ry="12.5" transform="rotate(12 29.5 88)"/><ellipse cx="90.5" cy="88" rx="5" ry="12.5" transform="rotate(-12 90.5 88)"/>'],
  ['', '<circle cx="25.5" cy="105" r="4.5"/><circle cx="94.5" cy="105" r="4.5"/>'],
  ['oblicuos', '<path d="M49.5 63 L43 60 Q39.5 82 46 102 L49.5 102 Z"/><path d="M70.5 63 L77 60 Q80.5 82 74 102 L70.5 102 Z"/>'],
  ['abdomen', '<rect x="51" y="63" width="18" height="39" rx="6"/>'],
  ['', '<path d="M45 104 H75 L77.5 116 Q60 123 42.5 116 Z"/>'],
  ['cuadriceps', '<ellipse cx="49" cy="141" rx="7.6" ry="22"/><ellipse cx="71" cy="141" rx="7.6" ry="22"/>'],
  ['aductor', '<path d="M56.5 122 Q59.5 124 59.5 128 L58.5 150 Q55 146 55.5 132 Z"/><path d="M63.5 122 Q60.5 124 60.5 128 L61.5 150 Q65 146 64.5 132 Z"/>'],
  ['', '<circle cx="50" cy="167" r="5"/><circle cx="70" cy="167" r="5"/>'],
  ['pantorrilla', '<ellipse cx="50" cy="190" rx="6" ry="16"/><ellipse cx="70" cy="190" rx="6" ry="16"/>'],
  ['', '<ellipse cx="49" cy="211" rx="6.5" ry="3.5"/><ellipse cx="71" cy="211" rx="6.5" ry="3.5"/>'],
];
const LINEAS_FRENTE = '<path d="M60 65v35M52 76h16M52 88h16M60 41v18"/>';

const ESPALDA = [
  ['', '<circle cx="60" cy="16" r="11"/><rect x="55" y="25" width="10" height="9" rx="3"/>'],
  ['dorsal', '<path d="M53 56 L45 43 Q38.5 60 45 82 L57 89 Z"/><path d="M67 56 L75 43 Q81.5 60 75 82 L63 89 Z"/>'],
  ['lumbar', '<path d="M53 86 H67 L70 103 H50 Z"/>'],
  ['trapecio', '<path d="M60 29 L76 40 L67 57 L60 63 L53 57 L44 40 Z"/>'],
  ['deltoidesPost', '<ellipse cx="39" cy="45" rx="8" ry="9"/><ellipse cx="81" cy="45" rx="8" ry="9"/>'],
  ['triceps', '<ellipse cx="34.5" cy="63" rx="5.5" ry="11" transform="rotate(9 34.5 63)"/><ellipse cx="85.5" cy="63" rx="5.5" ry="11" transform="rotate(-9 85.5 63)"/>'],
  ['antebrazo', '<ellipse cx="29.5" cy="88" rx="5" ry="12.5" transform="rotate(12 29.5 88)"/><ellipse cx="90.5" cy="88" rx="5" ry="12.5" transform="rotate(-12 90.5 88)"/>'],
  ['', '<circle cx="25.5" cy="105" r="4.5"/><circle cx="94.5" cy="105" r="4.5"/>'],
  ['gluteoMedio', '<ellipse cx="43.5" cy="109" rx="4" ry="7.5"/><ellipse cx="76.5" cy="109" rx="4" ry="7.5"/>'],
  ['gluteo', '<ellipse cx="52.5" cy="114" rx="8.5" ry="10"/><ellipse cx="67.5" cy="114" rx="8.5" ry="10"/>'],
  ['femoral', '<ellipse cx="51" cy="145" rx="8.2" ry="19"/><ellipse cx="69" cy="145" rx="8.2" ry="19"/>'],
  ['', '<circle cx="51" cy="167" r="5"/><circle cx="69" cy="167" r="5"/>'],
  ['pantorrilla', '<ellipse cx="51" cy="189" rx="7" ry="15"/><ellipse cx="69" cy="189" rx="7" ry="15"/>'],
  ['', '<ellipse cx="50" cy="211" rx="6.5" ry="3.5"/><ellipse cx="70" cy="211" rx="6.5" ry="3.5"/>'],
];
const LINEAS_ESPALDA = '<path d="M60 64v38"/>';

function figura(partes, lineas, prim, sec) {
  return partes.map(([z, forma]) => {
    if (!z) return `<g class="z neutro">${forma}</g>`;
    const c = GRUPOS[ZONAS[z]].c;
    const cls = prim.includes(z) ? 'on' : sec.includes(z) ? 'sec' : '';
    return `<g class="z ${cls}" style="--zc:${c}">${forma}</g>`;
  }).join('') + `<g class="lineas">${lineas}</g>`;
}

export function cuerpo(prim = [], sec = []) {
  return `<svg class="cuerpo" viewBox="0 0 240 228" role="img" aria-label="Músculos que trabaja">
    <g>${figura(FRENTE, LINEAS_FRENTE, prim, sec)}</g>
    <g transform="translate(120 0)">${figura(ESPALDA, LINEAS_ESPALDA, prim, sec)}</g>
    <text x="60" y="226" text-anchor="middle">Frente</text>
    <text x="180" y="226" text-anchor="middle">Espalda</text>
  </svg>`;
}
