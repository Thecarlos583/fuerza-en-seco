// Progreso: pruebas físicas (inicial y final), esfuerzo (RPE) de cada sesión, calendario y pesos.
import { PRUEBAS_FIS, EJ, SESIONES, FASES } from './data.js';
import { S, C, guardar, leerDia } from './store.js';
import { hoy, aFecha, iso, sumar, diaDe, fechaCorta, MESES } from './fechas.js';
import { deFecha, faseDe, racha, diasSalvados, tramos } from './plan.js';
import * as W from './pesos.js';
import { $, $$, ico, esc, num, abrirHoja, cerrarHoja, aviso, vibrar, sonar, confeti } from './util.js';
import { barrasRPE, antesDespues, tocarGrafica } from './graficas.js';

let mes = 0;

// ── Datos que también usa la pestaña del entrenador ──────────
export function sesionesHechas() {
  return Object.keys(S().log).sort().filter(f => leerDia(f).completa && leerDia(f).rpe)
    .map(f => { const l = leerDia(f); const letra = Object.keys(l.r || {}).find(k => k.length === 1 && 'ABC'.includes(k) && l.r[k].completa) || deFecha(f).letra; return { f, rpe: l.rpe, letra }; });
}

export function asistencia(hasta = hoy()) {
  let prog = 0, ok = 0;
  for (let f = C().inicio; f < hasta; f = sumar(f, 1)) {
    if (deFecha(f).tipo !== 'gym') continue;
    prog++;
    const l = leerDia(f);
    if (l.completa || l.salvado || l.recuperada) ok++;
  }
  return { prog, ok, pct: prog ? Math.round((ok / prog) * 100) : null };
}

export const momentoPrueba = f => (['descarga', 'puesta', 'competencia', 'despues'].includes(faseDe(f)) ? 'final' : 'inicial');

// ── Pantalla ─────────────────────────────────────────────────
export function renderProgreso(v) {
  const f = hoy();
  v.innerHTML = `
    <div class="top"><p class="saludo">Tu evolución</p><h1>Progreso</h1></div>
    ${stats(f)}
    ${pruebas(f)}
    ${rpe()}
    ${calendario(f)}
    ${pesos()}`;
  v.onclick = clic;
}

function stats(f) {
  const a = asistencia(f);
  return `<div class="stats tres">
    <div class="stat racha">${ico('fuego')}<b>${racha(f)}</b><span>sesiones seguidas</span></div>
    <div class="stat">${ico('check')}<b>${a.pct == null ? '–' : a.pct + '%'}</b><span>asistencia (${a.ok} de ${a.prog})</span></div>
    <div class="stat salvados">${ico('corazon')}<b>${diasSalvados()}</b><span>días salvados</span></div>
  </div>`;
}

function pruebas(f) {
  const P = S().pruebas, mom = momentoPrueba(f);
  const fd = tramos().find(t => t.fase === 'descarga');
  return `<section class="card">
    <div class="card-cab"><h3>${ico('salto')} Pruebas físicas</h3></div>
    <p class="txt2 peq">Inicial: semana 1. Final: semana de descarga${fd ? ` (${fechaCorta(fd.ini)} – ${fechaCorta(fd.fin)})` : ''}. Nunca en la puesta a punto.</p>
    <div class="leyenda ad-ley"><span><i style="background:var(--serie-ini)"></i>Inicial${P.inicial.f ? ` · ${fechaCorta(P.inicial.f)}` : ''}</span><span><i style="background:var(--serie-fin)"></i>Final${P.final.f ? ` · ${fechaCorta(P.final.f)}` : ''}</span></div>
    ${PRUEBAS_FIS.map(t => {
      const a = P.inicial[t.k], b = P.final[t.k];
      const mejora = a != null && b != null ? Math.round((b - a) * 10) / 10 : null;
      return `<div class="prueba-f">
        <div class="pf-cab"><b>${t.n}</b>${mejora != null ? (mejora > 0 ? `<span class="tag exp">${ico('trofeo')}Récord +${num(mejora)} ${t.u}</span>` : `<span class="tag neutro">${mejora === 0 ? 'Igual' : num(mejora) + ' ' + t.u}</span>`) : ''}</div>
        <p class="txt2 peq">${t.para}</p>
        ${antesDespues(a, b, { u: t.u, fmt: num })}
      </div>`;
    }).join('')}
    ${faseDe(f) === 'puesta' ? `<div class="nota">${ico('info')}<span>Estás en la puesta a punto: no hagas pruebas físicas ahora.</span></div>` : ''}
    <button class="btn-pri" data-p="anotar" data-mom="${mom}">${ico('mas')}Anotar pruebas ${mom === 'inicial' ? 'iniciales' : 'finales'}</button>
    <button class="link" data-p="anotar" data-mom="${mom === 'inicial' ? 'final' : 'inicial'}">Anotar las ${mom === 'inicial' ? 'finales' : 'iniciales'}</button>
  </section>`;
}

function rpe() {
  const h = sesionesHechas().slice(-12);
  return `<section class="card">
    <div class="card-cab"><h3>${ico('fuego')} Esfuerzo por sesión (RPE)</h3><span class="cont">últimas ${h.length}</span></div>
    ${h.length ? barrasRPE(h) : `<p class="vacio">${ico('info')}Cuando termines sesiones, aquí ves si te estás pasando de carga.</p>`}
    ${h.length >= 3 && h.slice(-3).every(x => x.rpe >= 9) ? `<div class="nota coral">${ico('alto')}<span>Tres sesiones seguidas muy duras. Baja un escalón de peso y prioriza dormir.</span></div>` : ''}
  </section>`;
}

function calendario(f) {
  const base = aFecha(f);
  const m = new Date(base.getFullYear(), base.getMonth() + mes, 1);
  const primero = iso(m);
  const diasMes = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  let celdas = '<span></span>'.repeat((m.getDay() + 6) % 7);
  for (let k = 0; k < diasMes; k++) {
    const d = sumar(primero, k), l = leerDia(d), dd = deFecha(d);
    const letra = Object.keys(l.r || {}).find(x => x.length === 1 && 'ABC'.includes(x) && l.r[x].completa);
    const casa = l.planbHecho || l.r?.movilidad?.completa;
    const col = letra ? SESIONES[letra].c : '';
    const cls = [letra ? 'gym' : '', casa && !letra ? 'casa' : '', d === f ? 'hoy' : '', d > f ? 'futuro' : '', dd.tipo === 'gym' && d < f && !l.completa && !l.salvado && !l.recuperada ? 'falta' : ''].join(' ');
    celdas += `<span class="cal-d ${cls}" style="${col ? `--c:${col}` : ''}">${k + 1}${letra ? `<small>${letra}</small>` : ''}</span>`;
  }
  return `<section class="card">
    <div class="card-cab">
      <button class="cal-nav" data-p="mes" data-d="-1" aria-label="Mes anterior">${ico('atras')}</button>
      <h3>${MESES[m.getMonth()][0].toUpperCase() + MESES[m.getMonth()].slice(1)} ${m.getFullYear()}</h3>
      <button class="cal-nav" data-p="mes" data-d="1" aria-label="Mes siguiente">${ico('atras', 'girar180')}</button>
    </div>
    <div class="cal">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(x => `<span class="cal-h">${x}</span>`).join('')}${celdas}</div>
    <div class="leyenda"><span><i style="background:var(--aqua)"></i>Sesión hecha</span><span><i class="casa-l"></i>En casa</span><span><i class="falta-l"></i>Sesión perdida</span></div>
  </section>`;
}

function pesos() {
  const ids = Object.keys(S().pesos).filter(e => EJ[e] && W.conPeso(e));
  if (!ids.length) return '';
  return `<section class="card">
    <div class="card-cab"><h3>${ico('trofeo')} Pesos de trabajo</h3></div>
    <ul class="pesos-lista">${ids.map(e => `<li><span>${esc(EJ[e].n)}</span><b>${W.texto(e, W.trabajo(e))}</b><small>empezó con ${W.texto(e, W.inicial(e), { mano: false })} · tope ${W.texto(e, W.tope(e), { mano: false })}</small></li>`).join('')}</ul>
  </section>`;
}

function clic(ev) {
  if (tocarGrafica(ev)) return;
  const b = ev.target.closest('[data-p]');
  if (!b) return;
  if (b.dataset.p === 'mes') { mes = Math.min(0, mes + Number(b.dataset.d)); vibrar(8); dispatchEvent(new Event('fs:refrescar')); }
  if (b.dataset.p === 'anotar') hojaPruebas(b.dataset.mom);
}

function hojaPruebas(mom) {
  const P = S().pruebas, actual = P[mom], otro = P[mom === 'inicial' ? 'final' : 'inicial'];
  const val = t => actual[t.k] ?? otro[t.k] ?? t.ini;
  const h = abrirHoja(`
    <p class="eyebrow">${ico('salto')} Pruebas físicas</p>
    <h2 class="hoja-t">${mom === 'inicial' ? 'Iniciales' : 'Finales'}</h2>
    <p class="hoja-sub">Hazlas frescas, después de calentar. Mejor intento de 2-3.</p>
    ${PRUEBAS_FIS.map(t => `<div class="pf-in" data-k="${t.k}" data-paso="${t.paso}">
      <span>${t.n}</span>
      <div class="peso">
        <button class="peso-btn" data-d="-1" aria-label="Menos">${ico('menos')}</button>
        <div class="peso-val"><b>${num(val(t))}</b><span>${t.u}</span></div>
        <button class="peso-btn" data-d="1" aria-label="Más">${ico('mas')}</button>
      </div></div>`).join('')}
    <button class="btn-pri" data-g="ok">${ico('check')}Guardar</button>`);
  const v = Object.fromEntries(PRUEBAS_FIS.map(t => [t.k, val(t)]));
  let t1, t2;
  const parar = () => { clearTimeout(t1); clearInterval(t2); };
  const mover = (fila, d) => {
    const k = fila.dataset.k, paso = Number(fila.dataset.paso);
    v[k] = Math.max(0, Math.round((v[k] + paso * d) * 10) / 10);
    fila.querySelector('b').textContent = num(v[k]); vibrar(5);
  };
  h.addEventListener('pointerdown', e => {
    const bt = e.target.closest('[data-d]');
    if (!bt) return;
    e.preventDefault();
    const fila = bt.closest('.pf-in'), d = Number(bt.dataset.d);
    mover(fila, d);
    t1 = setTimeout(() => { t2 = setInterval(() => mover(fila, d), 60); }, 380);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(x => h.addEventListener(x, parar));
  h.onclick = e => {
    if (!e.target.closest('[data-g=ok]')) return;
    const antes = { ...P[mom] };
    P[mom] = { ...v, f: hoy() };
    guardar(); cerrarHoja();
    const records = mom === 'final' && PRUEBAS_FIS.filter(t => P.inicial[t.k] != null && v[t.k] > P.inicial[t.k]).length;
    if (records) { aviso(`¡Mejoraste en ${records} de ${PRUEBAS_FIS.length} pruebas!`, 'trofeo', 3500); sonar.logro(); confeti(true); }
    else aviso('Pruebas guardadas', 'check');
    dispatchEvent(new Event('fs:refrescar'));
  };
}
