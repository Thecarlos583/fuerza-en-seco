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
  pesoLog: [],   // peso corporal semanal: { f, v } en kg
  vistos: {},
});

// Migración: completa los campos nuevos sin tocar lo que ya estaba guardado
function fusionar(d) {
  const b = base(), e = { ...b, ...d };
  e.marcas = { ...b.marcas, ...(d.marcas || {}) };
  delete e.pruebas; // las pruebas físicas ya no existen (versión 15)
  if (!d.pesoLog) e.pesoLog = e.config?.pesoCorp?.v ? [{ f: e.config.inicio, v: e.config.pesoCorp.u === 'lb' ? Math.round(e.config.pesoCorp.v / 2.20462 * 2) / 2 : e.config.pesoCorp.v }] : [];
  e.vistos = { ...(d.vistos || {}) };
  if (e.config && e.config.ligero === undefined) e.config.ligero = true;
  if (e.config && !e.config.tema) e.config.tema = 'auto';
  // Unidades fijas por equipo (versión 13): peso corporal en kg, barra Z en lb, switch kg ⇄ lb solo para mostrar
  if (e.config) {
    const c = e.config;
    if (c.pesoCorp?.u === 'lb') c.pesoCorp = { v: Math.round(c.pesoCorp.v / 2.20462 * 2) / 2, u: 'kg' };
    if (Array.isArray(c.barraZ)) c.barraZ = c.barraZ[1] || 20;
    c.barraZ ||= 20;
    c.unidades ||= {}; // ejercicio → unidad de sus discos, si Juan la cambió (versión 17)
    delete c.verEn;
    // Versión 16: días de doble sesión de agua (recuperación fija y dos activaciones) y activación con ligas
    if (!Array.isArray(c.aguaDoble)) { c.aguaDoble = ['mar', 'jue', 'sab']; c.agua = [...new Set([...(c.agua || []), ...c.aguaDoble])]; }
    if (c.activacion === undefined) c.activacion = true;
    delete c.pieplano;
    delete c.uManc; delete c.uDisco;
  }
  return e;
}

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
