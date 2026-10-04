// Estado de la app guardado en localStorage. Nada sale del teléfono.
import { MARCAS_INICIO } from './data.js';
const KEY = 'fuerza-en-seco:v1';

const base = () => ({
  v: 1,
  config: null,  // se llena en la bienvenida
  log: {},       // 'AAAA-MM-DD' → lo que pasó ese día
  movs: [],      // sesiones movidas: { de, a }
  siempre: {},   // ejercicio original → alternativa elegida con "Siempre"
  pesos: {},     // ejercicio → { v, u, sube } peso de trabajo
  revisado: {},  // ejercicio → fecha en que le revisaron la técnica
  timer: null,   // descanso en curso
  marcas: { ...MARCAS_INICIO, tiempos: [], metas: {} }, // tiempos de natación: { id, p, cs, f, tipo, nota, parcial }
  pruebas: { inicial: {}, final: {} },                    // pruebas físicas
  vistos: {},
});

const fusionar = d => ({ ...base(), ...d });

function cargar() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return fusionar(JSON.parse(raw));
  } catch (e) { console.warn('No se pudo leer el estado', e); }
  return base();
}

let estado = cargar();

export const S = () => estado;
export const C = () => estado.config;

export function guardar() {
  try { localStorage.setItem(KEY, JSON.stringify(estado)); }
  catch (e) { console.warn('No se pudo guardar', e); }
}

// Registro de un día (lo crea si no existe) y lectura sin crear
export const dia = f => (estado.log[f] ||= {});
export const leerDia = f => estado.log[f] || {};

export const exportar = () => JSON.stringify({ ...estado, timer: null }, null, 2);

export function importar(texto) {
  const d = JSON.parse(texto);
  if (!d || typeof d !== 'object' || typeof d.log !== 'object' || !d.config) throw new Error('Ese archivo no parece un respaldo de Fuerza en Seco.');
  estado = fusionar(d);
  guardar();
}

export function reiniciar() {
  estado = base();
  guardar();
}
