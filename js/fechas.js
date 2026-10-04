// Fechas locales (sin zona horaria) en formato AAAA-MM-DD
export const DIAS = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
export const SEMANA = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];
export const NOMBRE_DIA = { lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes', sab: 'Sábado', dom: 'Domingo' };
export const INICIAL = { lun: 'L', mar: 'M', mie: 'M', jue: 'J', vie: 'V', sab: 'S', dom: 'D' };
export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const pad = n => String(n).padStart(2, '0');
export const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export function aFecha(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }

// ?fecha=AAAA-MM-DD permite simular otro día (para probar)
export function hoy() {
  const q = new URLSearchParams(location.search).get('fecha');
  return q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? q : iso(new Date());
}

export function sumar(f, n) { const d = aFecha(f); d.setDate(d.getDate() + n); return iso(d); }
export function lunesDe(f) { const d = aFecha(f); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return iso(d); }
export const diasEntre = (a, b) => Math.round((aFecha(b) - aFecha(a)) / 86400000);
export const diaDe = f => DIAS[aFecha(f).getDay()];
export const valida = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !isNaN(aFecha(s));

export function fechaLarga(f) {
  const d = aFecha(f);
  return `${NOMBRE_DIA[DIAS[d.getDay()]]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}
export const fechaCorta = f => { const d = aFecha(f); return `${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`; };
export const fechaDia = f => { const d = aFecha(f); return `${NOMBRE_DIA[DIAS[d.getDay()]].toLowerCase()} ${d.getDate()}`; };
