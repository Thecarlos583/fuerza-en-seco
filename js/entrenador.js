// Para el entrenador de natación: el plan, cada ejercicio con por qué ayuda en el agua, y el progreso.
import { EJ, SESIONES, ACTIVACION, FASES } from './data.js';
import { S, C } from './store.js';
import { hoy, fechaCorta, fechaLarga } from './fechas.js';
import { faseDe, semanaDe, tramos, diasParaComp, diasSalvados, gymOrden } from './plan.js';
import { sesionesHechas, asistencia, progresoPesos } from './progreso.js';
import { mejor, meta, fmtT, nombrePrueba } from './marcas.js';
import { prescripcion } from './sesion.js';
import { hojaAnimacion } from './sesion.js';
import { tieneAnimacion } from './anim.js';
import * as W from './pesos.js';
import { ico, esc, num, chipTransfer, aviso } from './util.js';
import { NOMBRE_DIA } from './fechas.js';

const BLOQ = { potencia: 'Potencia', fuerza: 'Fuerza', core: 'Core y prevención' };

export function renderEntrenador(v) {
  const c = C(), f = hoy();
  const fa = FASES[faseDe(f)], sem = semanaDe(f), dc = diasParaComp(f);
  const a = asistencia(f);
  const h = sesionesHechas();
  const ult = h.slice(-4);
  const rpeProm = ult.length ? Math.round((ult.reduce((s, x) => s + x.rpe, 0) / ult.length) * 10) / 10 : null;
  const pool = Number(c.comp.piscina) || 50;
  const orden = gymOrden();
  const { conPeso } = progresoPesos();
  const pc = S().pesoLog || [];

  v.innerHTML = `
    <div class="top"><p class="saludo">Resumen para su entrenador de natación</p><h1>Entrenador</h1></div>

    <section class="card coach">
      <p class="eyebrow">${esc(c.nombre)} · plan de fuerza en seco</p>
      <h2>${esc(c.comp.nombre)}</h2>
      <p class="txt2">${fechaLarga(c.comp.ini)}${c.comp.lugar ? ' · ' + esc(c.comp.lugar) : ''} · piscina de ${c.comp.piscina} m${dc > 0 ? ` · faltan <b>${dc} días</b>` : ''}</p>
      <div class="coach-fase" style="--c:${fa.c}"><b>Fase actual: ${fa.n}</b>${sem.n >= 1 && dc > 0 ? ` · semana ${sem.n} de ${sem.total}` : ''}<br>${fa.txt}</div>
    </section>

    <div class="stats tres">
      <div class="stat">${ico('check')}<b>${a.pct == null ? '–' : a.pct + '%'}</b><span>asistencia al gimnasio (${a.ok}/${a.prog})</span></div>
      <div class="stat">${ico('fuego')}<b>${rpeProm ?? '–'}</b><span>RPE promedio últimas sesiones (meta 6-8)</span></div>
      <div class="stat salvados">${ico('corazon')}<b>${diasSalvados()}</b><span>días salvados con trabajo en casa</span></div>
    </div>

    <section class="card">
      <div class="card-cab"><h3>${ico('guia')} Cómo está armado</h3></div>
      <ul class="coach-lista">
        <li><b>3 días de gimnasio</b> (${orden.map(d => NOMBRE_DIA[d]).join(', ')}), siempre con un día libre en medio. Los demás días, movilidad corta opcional.</li>
        <li><b>Primero potencia, después fuerza.</b> Saltos y lanzamientos frescos, con descanso completo y un tope de saltos por sesión.</li>
        <li><b>Fuerza explosiva:</b> baja controlado en 2 s y sube lo más rápido posible. Nunca al fallo (RPE 6-8, le sobran 2-3 repeticiones).</li>
        <li><b>Máquinas para entrenar solo con seguridad</b>, con peso inicial y tope por ejercicio, y un máximo de un escalón por semana.</li>
        <li><b>Hacia atrás desde la competencia:</b> construcción, pico, descarga (−40% de volumen) y puesta a punto (2 sesiones cortas). La descarga del agua la decide usted; la app solo ajusta el seco.</li>
        ${c.pieplano !== false ? '<li><b>Pie plano:</b> los ejercicios de equilibrio en un pie se cambian por versiones en máquina cuando le cuestan.</li>' : ''}
        <li><b>Si marca dolor de rodilla, hombro o espalda</b> en el chequeo, la app quita lo que carga esa zona y deja movilidad y core.</li>
      </ul>
      <div class="fases">${tramos().filter(t => !['antes', 'despues'].includes(t.fase)).map(t => `<div class="fase-f" style="--c:${FASES[t.fase].c}"><div><b>${FASES[t.fase].n}</b><span>${fechaCorta(t.ini)}${t.fin !== t.ini ? ' – ' + fechaCorta(t.fin) : ''}</span></div></div>`).join('')}</div>
    </section>

    <section class="card">
      <div class="card-cab"><h3>${ico('trofeo')} Marcas (piscina de ${pool} m)</h3></div>
      ${S().marcas.seguidas.length ? `<ul class="pesos-lista">${S().marcas.seguidas.map(id => { const b = mejor(id, pool), m = meta(id, pool); return `<li><span>${nombrePrueba(id)}</span><b>${fmtT(b)}</b><small>meta ${fmtT(m)}${b != null && m != null ? ` · ${b - m <= 0 ? 'meta lograda' : `le faltan ${((b - m) / 100).toFixed(2)} s`}` : ''}</small></li>`; }).join('')}</ul>` : '<p class="txt2">Sin marcas todavía.</p>'}
    </section>

    <section class="card">
      <div class="card-cab"><h3>${ico('trofeo')} Progreso de pesos</h3></div>
      ${conPeso.length ? `<ul class="pesos-lista">${conPeso.map(x => `<li><span>${esc(EJ[x.e].n)}</span><b>${W.cifra(x.e, x.ini)} → ${W.cifra(x.e, x.hoy)}</b></li>`).join('')}</ul>` : '<p class="txt2">Todavía no hay sesiones de gimnasio registradas.</p>'}
      ${pc.length ? `<p class="txt2 peq">Peso corporal: ${num(pc.at(-1).v)} kg (${fechaCorta(pc.at(-1).f)})${pc.length > 1 ? `; empezó con ${num(pc[0].v)} kg` : ''}.</p>` : ''}
    </section>

    <section class="card">
      <div class="card-cab"><h3>${ico('hoy')} Los ejercicios y por qué ayudan en el agua</h3></div>
      <p class="txt2 peq">Toca ▶ para ver cómo se hace cada uno.</p>
      ${['A', 'B', 'C'].map(l => { const s = SESIONES[l]; return `<details class="plan-dia coach-ses" data-ses="${l}"><summary><span class="dia-n">${NOMBRE_DIA[orden['ABC'.indexOf(l)]] || ''}</span><span class="dia-t">Sesión ${l} · ${s.n}<small>${s.sub}</small></span>${ico('abajo')}</summary></details>`; }).join('')}
      <details class="plan-dia coach-ses" data-ses="act"><summary><span class="dia-n">Siempre</span><span class="dia-t">Activación<small>~10 min antes de cada sesión</small></span>${ico('abajo')}</summary></details>
    </section>

    <button class="btn-pri" data-e="compartir">${ico('copiar')}Compartir este resumen</button>
    <p class="pie">Este plan complementa el entrenamiento de natación y no lo reemplaza.</p>`;

  // El contenido de cada sesión se arma al abrirla
  v.querySelectorAll('details[data-ses]').forEach(d => d.addEventListener('toggle', () => {
    if (!d.open || d.dataset.listo) return;
    d.dataset.listo = 1;
    const l = d.dataset.ses, ses = SESIONES[l];
    d.insertAdjacentHTML('beforeend', l === 'act' ? ACTIVACION.map(it => ejercicio(it)).join('')
      : ['potencia', 'fuerza', 'core'].map(b => `<p class="plan-b">${BLOQ[b]}</p>${ses[b].map(it => ejercicio(it)).join('')}`).join(''));
  }));

  v.onclick = async ev => {
    const ver = ev.target.closest('[data-ver]');
    if (ver) { ev.preventDefault(); hojaAnimacion(ver.dataset.ver); return; }
    if (!ev.target.closest('[data-e=compartir]')) return;
    const texto = resumenTexto();
    try {
      if (navigator.share) await navigator.share({ title: `Plan de seco de ${c.nombre}`, text: texto });
      else { await navigator.clipboard.writeText(texto); aviso('Resumen copiado', 'copiar'); }
    } catch { }
  };
}

function ejercicio(it) {
  const e = EJ[it.e];
  const peso = W.conPeso(it.e) && S().pesos[it.e] ? W.texto(it.e, W.trabajo(it.e)) : null;
  return `<div class="coach-ej">
    <div class="ce-cab"><b>${esc(e.n)}</b><span>${prescripcion(it)}</span>${tieneAnimacion(it.e) ? `<button class="ver-mini" data-ver="${it.e}" aria-label="Ver cómo se hace">${ico('play')}</button>` : ''}</div>
    <div class="ej-tags">${e.tr.map(chipTransfer).join('')}</div>
    <p>${esc(e.para)}</p>
    ${peso ? `<p class="peq txt2">Peso de trabajo actual: <b>${peso}</b></p>` : ''}
  </div>`;
}

function resumenTexto() {
  const c = C(), f = hoy(), fa = FASES[faseDe(f)], a = asistencia(f), pool = Number(c.comp.piscina) || 50;
  const h = sesionesHechas().slice(-4);
  const rpe = h.length ? (h.reduce((s, x) => s + x.rpe, 0) / h.length).toFixed(1) : '–';
  const lin = [];
  lin.push(`Plan de fuerza en seco de ${c.nombre} — objetivo: ${c.comp.nombre} (${fechaCorta(c.comp.ini)})`);
  lin.push(`Fase: ${fa.n}. Asistencia: ${a.pct ?? '–'}% (${a.ok}/${a.prog}). RPE promedio últimas sesiones: ${rpe}.`);
  lin.push('');
  lin.push('Marcas:');
  for (const id of S().marcas.seguidas) lin.push(`- ${nombrePrueba(id)} (${pool} m): ${fmtT(mejor(id, pool))} · meta ${fmtT(meta(id, pool))}`);
  lin.push('');
  lin.push('Progreso de pesos (empezó → hoy):');
  const { conPeso } = progresoPesos();
  if (!conPeso.length) lin.push('- Todavía sin sesiones registradas');
  for (const x of conPeso) lin.push(`- ${EJ[x.e].n}: ${W.cifra(x.e, x.ini)} → ${W.cifra(x.e, x.hoy)}`);
  lin.push('');
  for (const l of ['A', 'B', 'C']) {
    const s = SESIONES[l];
    lin.push(`Sesión ${l} · ${s.n}: ${[...s.potencia, ...s.fuerza].map(it => `${EJ[it.e].n} ${prescripcion(it)}`).join('; ')}`);
  }
  lin.push('');
  lin.push('Fuerza explosiva: baja en 2 s y sube rápido; nunca al fallo. Primero potencia, luego fuerza.');
  return lin.join('\n');
}
