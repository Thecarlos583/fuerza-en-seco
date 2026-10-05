// Progreso: constancia, evolución de los pesos de cada ejercicio, peso corporal, esfuerzo (RPE) y calendario.
import { EJ, SESIONES } from './data.js';
import { S, C, guardar, leerDia } from './store.js';
import { hoy, aFecha, iso, sumar, lunesDe, fechaCorta, MESES } from './fechas.js';
import { deFecha, racha, diasSalvados } from './plan.js';
import * as W from './pesos.js';
import { ico, esc, num, abrirHoja, cerrarHoja, aviso, vibrar } from './util.js';
import { barrasRPE, linea, mini, tocarGrafica } from './graficas.js';

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

// Rutinas terminadas ese día (gimnasio, recuperación, Plan B…)
const terminadas = f => Object.values(leerDia(f).r || {}).filter(r => r.completa).length;
export function constancia(f = hoy()) {
  const lun = lunesDe(f), m = f.slice(0, 7);
  let semana = 0, gymSemana = 0, mesN = 0;
  for (const [d, l] of Object.entries(S().log)) {
    const n = terminadas(d);
    if (!n) continue;
    if (d >= lun && d <= f) { semana += n; if (l.completa) gymSemana++; }
    if (d.startsWith(m) && d <= f) mesN += n;
  }
  return { semana, gymSemana, mes: mesN, salvados: diasSalvados(), racha: racha(f) };
}

// Historial de cada ejercicio: pesos (en la unidad de su equipo) o series de peso corporal
export function historial(e) {
  return Object.keys(S().log).sort().map(f => ({ f, r: leerDia(f).res?.[e] })).filter(x => x.r)
    .map(({ f, r }) => (r.v != null ? { f, v: W.aSuUnidad(e, r.v, r.u) } : { f, s: r.s, r: r.r, seg: r.seg }));
}

export function progresoPesos() {
  const ids = new Set([...Object.keys(S().pesos), ...Object.values(S().log).flatMap(l => Object.keys(l.res || {}))]);
  const conPeso = [], corporal = [];
  for (const e of ids) {
    if (!EJ[e]) continue;
    const h = historial(e);
    if (W.conPeso(e) && W.tope(e) !== 0) {
      const pts = h.filter(x => x.v != null);
      const ini = pts[0]?.v ?? W.inicial(e), hoyV = W.trabajo(e) ?? pts.at(-1)?.v;
      if (hoyV == null || !pts.length) continue;
      conPeso.push({ e, ini, hoy: hoyV, dif: hoyV - ini, pct: ini ? (hoyV - ini) / ini : 0, pts });
    } else if (h.length) corporal.push({ e, h });
  }
  conPeso.sort((a, b) => b.pct - a.pct || b.dif - a.dif);
  return { conPeso, corporal };
}

// ── Pantalla ─────────────────────────────────────────────────
export function renderProgreso(v) {
  const f = hoy();
  v.innerHTML = `
    <div class="top"><p class="saludo">Tu evolución</p><h1>Progreso</h1></div>
    ${constanciaHTML(f)}
    ${pesosHTML()}
    ${pesoCorporalHTML(f)}
    ${rpeHTML()}
    ${calendario(f)}`;
  v.onclick = clic;
}

function constanciaHTML(f) {
  const c = constancia(f);
  return `<section class="card">
    <div class="card-cab"><h3>${ico('check')} Constancia</h3></div>
    <div class="stats dos-dos">
      <div class="stat">${ico('cal')}<b>${c.semana}</b><span>sesiones esta semana (${c.gymSemana} de 3 de gimnasio)</span></div>
      <div class="stat">${ico('check')}<b>${c.mes}</b><span>sesiones en ${MESES[aFecha(f).getMonth()]}</span></div>
      <div class="stat racha">${ico('fuego')}<b>${c.racha}</b><span>sesiones de gimnasio seguidas</span></div>
      <div class="stat salvados">${ico('corazon')}<b>${c.salvados}</b><span>días salvados con el Plan B</span></div>
    </div>
  </section>`;
}

const signo = (e, d) => { const m = W.mostrar(Math.abs(d), W.unidad(e)); return `${d > 0 ? '+' : d < 0 ? '−' : ''}${m.aprox ? '≈' : ''}${m.n} ${m.u}`; };
const presc = x => `${x.s} × ${x.seg ? `${x.seg} s` : x.r ?? ''}`;

function pesosHTML() {
  const { conPeso, corporal } = progresoPesos();
  const top = conPeso.filter(x => x.dif > 0).slice(0, 3);
  return `<section class="card">
    <div class="card-cab"><h3>${ico('trofeo')} Tus pesos</h3></div>
    ${conPeso.length || corporal.length ? `
      ${top.length ? `<p class="sub-t">Los que más subieron</p><ol class="podio">${top.map(x => `<li><span>${esc(EJ[x.e].n)}</span><b class="sube-txt">${signo(x.e, x.dif)}</b></li>`).join('')}</ol>` : ''}
      ${conPeso.length ? `<ul class="prog-ej">${conPeso.map(x => `<li>
        <div><b>${esc(EJ[x.e].n)}</b><span>Empezó con ${W.cifra(x.e, x.ini)} → hoy ${W.cifra(x.e, x.hoy)}${x.dif ? ` <em class="${x.dif > 0 ? 'sube-txt' : ''}">(${signo(x.e, x.dif)})</em>` : ''}</span></div>
        ${mini(x.pts.map(p => p.v))}</li>`).join('')}</ul>` : ''}
      ${corporal.length ? `<p class="sub-t">Con tu peso corporal</p><ul class="prog-ej">${corporal.map(x => `<li><div><b>${esc(EJ[x.e].n)}</b><span>${x.h.length} ${x.h.length === 1 ? 'vez' : 'veces'} · empezó con ${presc(x.h[0])} → última ${presc(x.h.at(-1))}</span></div></li>`).join('')}</ul>` : ''}`
      : `<p class="vacio">${ico('info')}Cuando termines tu primera sesión de gimnasio, aquí ves cuánto sube cada ejercicio.</p>`}
  </section>`;
}

function pesoCorporalHTML(f) {
  const h = S().pesoLog || [];
  const estaSemana = h.find(x => x.f >= lunesDe(f));
  return `<section class="card">
    <div class="card-cab"><h3>${ico('progreso')} Peso corporal</h3>${h.length ? `<span class="cont">${num(h.at(-1).v)} kg</span>` : ''}</div>
    ${h.length >= 2 ? linea(h, { fmt: x => `${num(x)} kg`, desc: 'Evolución de tu peso corporal' }) : h.length ? `<p class="txt2 peq">Registrado: ${num(h[0].v)} kg el ${fechaCorta(h[0].f)}. Con dos semanas ya ves la gráfica.</p>` : ''}
    <p class="txt2 peq">Una vez por semana, en la mañana. Solo para ver cómo cambia mientras creces y entrenas.</p>
    <button class="btn-sec" data-p="peso">${ico('mas')}${estaSemana ? 'Cambiar el peso de esta semana' : 'Anotar mi peso de esta semana'}</button>
  </section>`;
}

function rpeHTML() {
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
    const casa = !letra && terminadas(d) > 0;
    const col = letra ? SESIONES[letra].c : '';
    const pendiente = d < f && d >= C().inicio && !l.registro && !terminadas(d) && !l.falto && !l.descanso && !l.salvado && !l.recuperada;
    const cls = [letra ? 'gym' : '', casa ? 'casa' : '', d === f ? 'hoy' : '', d > f ? 'futuro' : '',
      dd.tipo === 'gym' && d < f && !l.completa && !l.salvado && !l.recuperada ? 'falta' : '', pendiente && dd.tipo !== 'gym' ? 'pendiente' : ''].join(' ');
    celdas += `<span class="cal-d ${cls}" style="${col ? `--c:${col}` : ''}">${k + 1}${letra ? `<small>${letra}</small>` : ''}</span>`;
  }
  return `<section class="card">
    <div class="card-cab">
      <button class="cal-nav" data-p="mes" data-d="-1" aria-label="Mes anterior">${ico('atras')}</button>
      <h3>${MESES[m.getMonth()][0].toUpperCase() + MESES[m.getMonth()].slice(1)} ${m.getFullYear()}</h3>
      <button class="cal-nav" data-p="mes" data-d="1" aria-label="Mes siguiente">${ico('atras', 'girar180')}</button>
    </div>
    <div class="cal">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(x => `<span class="cal-h">${x}</span>`).join('')}${celdas}</div>
    <div class="leyenda"><span><i style="background:var(--aqua)"></i>Gimnasio</span><span><i class="casa-l"></i>Recuperación o Plan B</span><span><i class="falta-l"></i>Sesión perdida</span><span><i class="pend-l"></i>Sin registrar</span></div>
  </section>`;
}

function clic(ev) {
  if (tocarGrafica(ev)) return;
  const b = ev.target.closest('[data-p]');
  if (!b) return;
  if (b.dataset.p === 'mes') { mes = Math.min(0, mes + Number(b.dataset.d)); vibrar(8); dispatchEvent(new Event('fs:refrescar')); }
  if (b.dataset.p === 'peso') hojaPeso();
}

// Anotar el peso corporal de la semana (uno por semana: si ya hay, se reemplaza)
function hojaPeso() {
  const f = hoy(), log = (S().pesoLog ||= []);
  const previo = log.at(-1)?.v ?? C().pesoCorp?.v ?? 58;
  let v = Math.round(previo * 10) / 10;
  const h = abrirHoja(`
    <p class="eyebrow">${ico('progreso')} Peso corporal</p>
    <h2 class="hoja-t">¿Cuánto pesas esta semana?</h2>
    <p class="hoja-sub">En la mañana, antes de desayunar. Sin metas: solo para ver cómo cambia.</p>
    <div class="peso">
      <button class="peso-btn" data-d="-1" aria-label="Menos">${ico('menos')}</button>
      <div class="peso-val"><b id="pc-v">${num(v)}</b><span>kg</span></div>
      <button class="peso-btn" data-d="1" aria-label="Más">${ico('mas')}</button>
    </div>
    <button class="btn-pri" data-g="ok">${ico('check')}Guardar</button>`);
  let t1, t2;
  const parar = () => { clearTimeout(t1); clearInterval(t2); };
  const mover = d => { v = Math.max(25, Math.min(150, Math.round((v + d * 0.1) * 10) / 10)); h.querySelector('#pc-v').textContent = num(v); vibrar(5); };
  h.addEventListener('pointerdown', e => {
    const bt = e.target.closest('[data-d]');
    if (!bt) return;
    e.preventDefault();
    const d = Number(bt.dataset.d);
    mover(d);
    t1 = setTimeout(() => { t2 = setInterval(() => mover(d), 60); }, 380);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(x => h.addEventListener(x, parar));
  h.onclick = e => {
    if (!e.target.closest('[data-g=ok]')) return;
    const lun = lunesDe(f), i = log.findIndex(x => x.f >= lun);
    if (i >= 0) log[i] = { f, v }; else log.push({ f, v });
    log.sort((a, b) => a.f.localeCompare(b.f));
    C().pesoCorp = { v, u: 'kg' };
    guardar(); cerrarHoja();
    aviso('Peso guardado', 'check');
    dispatchEvent(new Event('fs:refrescar'));
  };
}
