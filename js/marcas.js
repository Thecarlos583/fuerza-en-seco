// Mis marcas y metas: tiempos de cada prueba de natación, separados por piscina (25 m / 50 m).
import { ESTILOS } from './data.js';
import { S, C, guardar } from './store.js';
import { hoy, fechaCorta, diasEntre } from './fechas.js';
import { faseDe, compFin } from './plan.js';
import { $, $$, ico, esc, abrirHoja, cerrarHoja, aviso, vibrar, sonar, confeti } from './util.js';
import { lineaTiempos, tocarGrafica } from './graficas.js';

const M = () => S().marcas;
let piscina = null;
const abiertos = new Set();

// ── Utilidades ───────────────────────────────────────────────
const pad = n => String(n).padStart(2, '0');
export function fmtT(cs) {
  if (cs == null) return '–';
  const m = Math.floor(cs / 6000), s = Math.floor((cs % 6000) / 100), c = cs % 100;
  return m ? `${m}:${pad(s)}.${pad(c)}` : `${s}.${pad(c)}`;
}
const dif = cs => `${(cs / 100).toFixed(2)} s`;
const ESTILO = Object.fromEntries(ESTILOS.map(([k, n]) => [k, n]));
export const nombrePrueba = id => { const [d, e] = id.split('-'); return `${d} ${ESTILO[e].toLowerCase()}`; };
const existe = (id, p) => !(id === '100-combinado' && p === 50);
const tiempos = (id, p) => M().tiempos.filter(t => t.id === id && t.p === p).sort((a, b) => a.f.localeCompare(b.f) || a.cs - b.cs);
export const mejor = (id, p) => { const t = tiempos(id, p); return t.length ? Math.min(...t.map(x => x.cs)) : null; };
export const meta = (id, p) => M().metas[`${id}|${p}`] ?? null;
const BASE = { 50: 3500, 100: 7600, 200: 16500, 400: 34000, 800: 70000, 1500: 135000 };
const inicial = (id, p) => mejor(id, p) ?? BASE[id.split('-')[0]];

// ── Selector de tiempo (botones grandes, sin teclado) ────────
function selectorHTML(cs, nombre = 'cs') {
  const col = (u, et) => `<div class="sel-col" data-u="${u}"><button type="button" data-d="1" aria-label="Más ${et}">${ico('abajo', 'girar')}</button><b></b><small>${et}</small><button type="button" data-d="-1" aria-label="Menos ${et}">${ico('abajo')}</button></div>`;
  return `<div class="selector-t" data-sel="${nombre}" data-cs="${cs}">${col('m', 'min')}<span class="sep">:</span>${col('s', 'seg')}<span class="sep">.</span>${col('c', 'cent')}</div>`;
}
function montarSelector(el) {
  const paso = { m: 6000, s: 100, c: 1 };
  const pintar = () => {
    const cs = Number(el.dataset.cs);
    const v = { m: Math.floor(cs / 6000), s: Math.floor((cs % 6000) / 100), c: cs % 100 };
    $$('.sel-col', el).forEach(c => { c.querySelector('b').textContent = c.dataset.u === 'm' ? v.m : pad(v[c.dataset.u]); });
  };
  let t1, t2;
  const parar = () => { clearTimeout(t1); clearInterval(t2); };
  const mover = (u, d) => { el.dataset.cs = Math.max(0, Number(el.dataset.cs) + paso[u] * d); pintar(); vibrar(5); };
  el.addEventListener('pointerdown', e => {
    const b = e.target.closest('button[data-d]');
    if (!b) return;
    e.preventDefault();
    const u = b.closest('.sel-col').dataset.u, d = Number(b.dataset.d);
    mover(u, d);
    t1 = setTimeout(() => { t2 = setInterval(() => mover(u, d), 70); }, 380);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(x => el.addEventListener(x, parar));
  pintar();
}

// ── Pantalla ─────────────────────────────────────────────────
export function renderMarcas(v, sub) {
  piscina ??= C().comp.piscina || 50;
  const c = C(), f = hoy();
  const comp = M().comp.filter(id => M().seguidas.includes(id) && existe(id, piscina));
  const otras = M().seguidas.filter(id => !comp.includes(id) && existe(id, piscina));
  const esCompPool = piscina === Number(c.comp.piscina);
  const fa = faseDe(f);
  const anotarComp = (fa === 'competencia' || (fa === 'despues' && diasEntre(compFin(), f) <= 5)) && esCompPool;
  v.innerHTML = `
    <div class="top"><p class="saludo">Tus tiempos en el agua</p><h1>Mis marcas</h1></div>
    <div class="seg" data-pool>
      <button class="${piscina === 25 ? 'act' : ''}" data-p="25">Piscina corta (25 m)</button>
      <button class="${piscina === 50 ? 'act' : ''}" data-p="50">Piscina larga (50 m)</button>
    </div>
    ${anotarComp ? `<div class="nota agua">${ico('trofeo')}<span>¿Cómo te fue en ${esc(c.comp.corto || c.comp.nombre)}? Anota los tiempos de cada prueba con "Agregar tiempo".</span></div>` : ''}
    ${esCompPool && comp.length ? `<h2 class="seccion">${ico('trofeo')} Mis metas para ${esc(c.comp.corto || c.comp.nombre)}</h2>${comp.map(id => tarjeta(id, true)).join('')}` : ''}
    ${otras.length ? `<h2 class="seccion">${esCompPool && comp.length ? 'Otras pruebas' : 'Mis pruebas'}</h2>${otras.map(id => tarjeta(id, false)).join('')}` : ''}
    ${!comp.length && !otras.length ? `<p class="vacio">${ico('piscina')}No sigues ninguna prueba en esta piscina todavía.</p>` : ''}
    <button class="btn-sec" data-m="elegir">${ico('ajustes')}Elegir pruebas</button>
    <p class="pie">Los tiempos de 25 m y 50 m se guardan y se grafican por separado.</p>`;
  v.onclick = clic;
}

function tarjeta(id, enComp) {
  const p = piscina, ts = tiempos(id, p), b = mejor(id, p), m = meta(id, p);
  const principal = M().principal === id;
  const falta = b != null && m != null ? b - m : null;
  const primero = ts[0]?.cs;
  const frac = b == null || m == null ? 0 : falta <= 0 ? 1 : primero > m && primero !== b ? Math.min(1, Math.max(0, (primero - b) / (primero - m))) : 0.04;
  const abierto = abiertos.has(id);
  const hist = [...ts].reverse();
  return `<article class="marca-card ${falta != null && falta <= 0 ? 'lograda' : ''}" data-id="${id}">
    <div class="mc-cab">
      <h3>${nombrePrueba(id)}</h3>
      ${principal ? '<span class="tag exp">Principal</span>' : ''}${enComp ? `<span class="tag">${ico('trofeo')}Nacionales</span>` : ''}
    </div>
    <div class="mc-nums">
      <div><span>Mejor marca</span><b class="mejor">${fmtT(b)}</b></div>
      <div><span>Meta</span><b>${fmtT(m)}</b></div>
      <div><span>${falta == null ? 'Te falta' : falta <= 0 ? '¡Meta!' : 'Te faltan'}</span><b class="falta">${falta == null ? '–' : falta <= 0 ? ico('check') : dif(falta)}</b></div>
    </div>
    ${m != null && b != null ? `<div class="carril-prog" aria-label="Progreso hacia la meta"><div class="cp-agua"><i style="width:${frac * 100}%"></i><span class="cp-nadador" style="left:${frac * 100}%"></span></div><div class="cp-ley"><span>Primer tiempo</span><span>Meta</span></div></div>` : ''}
    ${ts.length >= 2 ? lineaTiempos(ts, { meta: m, fmt: fmtT, id }) : ''}
    ${hist.length ? `<ul class="historial">${(abierto ? hist : hist.slice(0, 3)).map(t => `<li>
        <b>${fmtT(t.cs)}</b><span>${fechaCorta(t.f)} · ${t.tipo === 'comp' ? 'Competencia' : 'Control'}${t.parcial ? ` · parcial 50: ${fmtT(t.parcial)}` : ''}${t.nota ? ` · ${esc(t.nota)}` : ''}</span>
        ${t.cs === b ? `<i class="pb">${ico('trofeo')}</i>` : ''}
        <button class="borrar" data-m="borrar" data-t="${M().tiempos.indexOf(t)}" aria-label="Borrar tiempo">${ico('cerrar')}</button></li>`).join('')}</ul>
      ${hist.length > 3 ? `<button class="link" data-m="todo">${abierto ? 'Ver menos' : `Ver los ${hist.length} tiempos`}</button>` : ''}` : '<p class="txt2 peq">Todavía no hay tiempos en esta piscina.</p>'}
    <div class="fila-2">
      <button class="btn-pri chico" data-m="agregar">${ico('mas')}Agregar tiempo</button>
      <button class="btn-sec" data-m="meta">${ico('bandera')}${m == null ? 'Poner meta' : 'Cambiar meta'}</button>
    </div>
  </article>`;
}

function clic(ev) {
  if (tocarGrafica(ev)) return;
  const pb = ev.target.closest('[data-p]');
  if (pb) { piscina = Number(pb.dataset.p); vibrar(8); refrescar(); return; }
  const b = ev.target.closest('[data-m]');
  if (!b) return;
  const id = b.closest('.marca-card')?.dataset.id;
  switch (b.dataset.m) {
    case 'agregar': hojaTiempo(id); break;
    case 'meta': hojaMeta(id); break;
    case 'elegir': hojaElegir(); break;
    case 'todo': abiertos.has(id) ? abiertos.delete(id) : abiertos.add(id); refrescar(); break;
    case 'borrar':
      if (confirm('¿Borrar este tiempo?')) { M().tiempos.splice(Number(b.dataset.t), 1); guardar(); refrescar(); }
      break;
  }
}
const refrescar = () => dispatchEvent(new Event('fs:refrescar'));

// ── Agregar tiempo ───────────────────────────────────────────
function hojaTiempo(id) {
  const dist = Number(id.split('-')[0]);
  const fa = faseDe(hoy());
  let tipo = fa === 'competencia' || fa === 'despues' ? 'comp' : 'control', p = piscina;
  const h = abrirHoja(`
    <p class="eyebrow">${ico('piscina')} Agregar tiempo</p>
    <h2 class="hoja-t">${nombrePrueba(id)}</h2>
    ${selectorHTML(inicial(id, piscina))}
    <div class="seg" data-tipo>
      <button type="button" class="${tipo === 'control' ? 'act' : ''}" data-v="control">Control en entrenamiento</button>
      <button type="button" class="${tipo === 'comp' ? 'act' : ''}" data-v="comp">Competencia</button>
    </div>
    <div class="seg" data-piscina>
      <button type="button" class="${p === 25 ? 'act' : ''}" data-v="25">25 m</button>
      <button type="button" class="${p === 50 ? 'act' : ''}" data-v="50">50 m</button>
    </div>
    <label class="campo"><span>Fecha</span><input type="date" name="fecha" value="${hoy()}"></label>
    ${dist >= 100 ? `<details class="parcial"><summary>Parcial del primer 50 (opcional)</summary>${selectorHTML(Math.round(inicial(id, piscina) * 0.47), 'parcial')}</details>` : ''}
    <label class="campo"><span>Nota (opcional)</span><input name="nota" maxlength="80" placeholder="Ej. buena salida, viraje lento"></label>
    <button class="btn-pri" data-g="guardar">${ico('check')}Guardar tiempo</button>`);
  $$('.selector-t', h).forEach(montarSelector);
  h.onclick = ev => {
    const s = ev.target.closest('[data-tipo] [data-v]');
    if (s) { tipo = s.dataset.v; $$('[data-tipo] button', h).forEach(x => x.classList.toggle('act', x === s)); return; }
    const q = ev.target.closest('[data-piscina] [data-v]');
    if (q) { p = Number(q.dataset.v); $$('[data-piscina] button', h).forEach(x => x.classList.toggle('act', x === q)); return; }
    if (!ev.target.closest('[data-g=guardar]')) return;
    const cs = Number($('[data-sel=cs]', h).dataset.cs);
    if (!cs) return aviso('Pon el tiempo', 'info');
    if (!existe(id, p)) return aviso('El 100 combinado solo existe en piscina de 25 m', 'info');
    const det = $('details.parcial', h);
    const parcial = det?.open ? Number($('[data-sel=parcial]', h).dataset.cs) : null;
    const antes = mejor(id, p), m = meta(id, p);
    M().tiempos.push({ id, p, cs, f: $('[name=fecha]', h).value || hoy(), tipo, nota: $('[name=nota]', h).value.trim(), parcial });
    guardar(); cerrarHoja();
    piscina = p;
    refrescar();
    // ¿Nueva mejor marca? ¿Meta lograda?
    setTimeout(() => {
      const card = $(`.marca-card[data-id="${id}"]`);
      if (antes == null || cs < antes) {
        card?.classList.add('record');
        if (antes != null) { aviso(`¡Nueva mejor marca! ${fmtT(cs)} en ${nombrePrueba(id)}`, 'trofeo', 3500); sonar.logro(); confeti(false); }
      }
      if (m != null && cs <= m && (antes == null || antes > m)) metaLograda(id, p, cs);
    }, 350);
  };
}

function metaLograda(id, p, cs) {
  confeti(true); sonar.logro(); vibrar([80, 60, 80, 60, 200]);
  const h = abrirHoja(`<div class="candado-grande logro">${ico('trofeo')}</div>
    <h2 class="hoja-t centro">¡Lograste tu meta!</h2>
    <p class="hoja-sub centro">${fmtT(cs)} en ${nombrePrueba(id)} (piscina de ${p} m). ¿Te pones una nueva?</p>
    <button class="btn-pri" data-x="nueva">${ico('bandera')}Poner nueva meta</button>
    <button class="btn-sec" data-x="no">Ahora no</button>`);
  h.onclick = e => {
    const b = e.target.closest('[data-x]');
    if (!b) return;
    cerrarHoja();
    if (b.dataset.x === 'nueva') setTimeout(() => hojaMeta(id, p), 320);
  };
}

// ── Meta ─────────────────────────────────────────────────────
function hojaMeta(id, p = piscina) {
  const b = mejor(id, p), m = meta(id, p);
  const sugerida = m ?? (b ? Math.round(b * 0.98) : BASE[id.split('-')[0]]);
  const h = abrirHoja(`
    <p class="eyebrow">${ico('bandera')} Meta · piscina de ${p} m</p>
    <h2 class="hoja-t">${nombrePrueba(id)}</h2>
    ${b ? `<p class="hoja-sub">Tu mejor marca: <b>${fmtT(b)}</b></p>` : ''}
    ${selectorHTML(sugerida)}
    <button class="btn-pri" data-g="ok">${ico('check')}Guardar meta</button>
    ${m != null ? '<button class="btn-sec" data-g="quitar">Quitar meta</button>' : ''}`);
  montarSelector($('.selector-t', h));
  h.onclick = e => {
    const g = e.target.closest('[data-g]');
    if (!g) return;
    if (g.dataset.g === 'ok') M().metas[`${id}|${p}`] = Number($('.selector-t', h).dataset.cs);
    else delete M().metas[`${id}|${p}`];
    guardar(); cerrarHoja(); refrescar();
  };
}

// ── Elegir pruebas, principal y las de la competencia ────────
function hojaElegir() {
  const pinta = () => `
    <h3 class="hoja-t">Mis pruebas</h3>
    <p class="hoja-sub">Toca para seguir una prueba. ★ = tu prueba principal (sale en Hoy). 🏁 = la nadas en ${esc(C().comp.corto || C().comp.nombre)}.</p>
    ${ESTILOS.map(([k, n, ds]) => `<h4 class="sub-t">${n}</h4><div class="pruebas-sel">${ds.map(d => {
      const id = `${d}-${k}`, on = M().seguidas.includes(id);
      return `<div class="pr-op ${on ? 'on' : ''}"><button class="pr-n" data-s="${id}">${d} m</button>${on ? `<button class="pr-x ${M().principal === id ? 'act' : ''}" data-pr="${id}" aria-label="Principal">★</button><button class="pr-x ${M().comp.includes(id) ? 'act' : ''}" data-c="${id}" aria-label="Competencia">🏁</button>` : ''}</div>`;
    }).join('')}</div>`).join('')}
    <button class="btn-pri" data-cerrar-hoja>Listo</button>`;
  const h = abrirHoja(pinta(), { alCerrar: refrescar });
  h.onclick = e => {
    const s = e.target.closest('[data-s]'), pr = e.target.closest('[data-pr]'), c = e.target.closest('[data-c]');
    if (e.target.closest('[data-cerrar-hoja]')) return cerrarHoja();
    if (s) { const id = s.dataset.s, l = M().seguidas; l.includes(id) ? l.splice(l.indexOf(id), 1) : l.push(id); }
    else if (pr) M().principal = pr.dataset.pr;
    else if (c) { const id = c.dataset.c, l = M().comp; l.includes(id) ? l.splice(l.indexOf(id), 1) : l.push(id); }
    else return;
    guardar(); vibrar(8);
    const y = h.scrollTop; h.innerHTML = '<div class="hoja-asa"></div>' + pinta(); h.scrollTop = y;
  };
}

// Tarjeta pequeña para Hoy: la prueba principal en la piscina de la competencia
export function tarjetaPrincipal() {
  const id = M().principal, p = Number(C().comp.piscina) || 50;
  if (!id) return '';
  const b = mejor(id, p), m = meta(id, p);
  const falta = b != null && m != null ? b - m : null;
  return `<a class="card principal" href="#marcas">
    <div><p class="eyebrow">${ico('piscina')} ${nombrePrueba(id)} · ${p} m</p>
      ${b == null ? '<p class="txt2">Anota tu mejor marca y tu meta</p>' : `<p class="pp-nums"><span>Mejor <b>${fmtT(b)}</b></span><span>Meta <b>${fmtT(m)}</b></span></p>`}</div>
    <b class="pp-falta">${falta == null ? ico('mas') : falta <= 0 ? '¡Meta!' : `−${(falta / 100).toFixed(2)} s`}</b>
  </a>`;
}
