// Pantalla Hoy: lo que toca entrenar con sus ejercicios (al estilo de Mi Rutina),
// cuenta regresiva, fases, Ver otro día, Mover sesión y Plan B en casa.
import { FASES, RUTINAS, SESIONES, EJ, SUGERIR } from './data.js';
import { S, C, guardar, dia, leerDia } from './store.js';
import { hoy, sumar, lunesDe, diasEntre, diaDe, fechaCorta, fechaDia, fechaLarga, NOMBRE_DIA, INICIAL } from './fechas.js';
import { deFecha, faseDe, semanaDe, tramos, opcionMover, sesionPerdida, racha, diasSalvados, faltasSemana, diasParaComp } from './plan.js';
import { progreso, leerRegistro, htmlSesion, activar, sesionDelDia, chequeo, hojaParar } from './sesion.js';
import { $, ico, esc, abrirHoja, cerrarHoja, aviso, vibrar, semilla, pantallaEncendida } from './util.js';
import { instalable, instalar } from './app-instalar.js';
import { tarjetaPrincipal } from './marcas.js';
import { compFin } from './plan.js';

const FRASES = [
  'Cada salto de hoy es un metro menos de pared a pared.',
  'Calidad antes que cansancio.',
  'Explosivo y limpio. Así se nada rápido.',
  'La técnica de hoy es la velocidad de mañana.',
  'Rápido, fresco y sin prisa por cansarte.',
];
const esGym = c => c && c.length === 1 && 'ABC'.includes(c);
const NOMBRES = { movilidad: 'Movilidad corta', recuperacion: 'Recuperación activa', forma: 'Mantener la forma', agua: 'Mantener el agua en seco', precomp: 'Activación precompetencia', competencia: 'Calentamiento en seco', noche: 'Recuperación de la noche' };
const nombreClave = c => esGym(c) ? `Sesión ${c} · ${SESIONES[c].n}` : NOMBRES[c] || '';

// Qué rutina se muestra hoy: lo elegido a mano, el Plan B o lo del calendario
function queToca(f) {
  const d = deFecha(f), l = leerDia(f);
  if (l.plan) return { clave: l.plan === 'descanso' ? null : l.plan, para: '', manual: true, d };
  if (l.planB) return { clave: l.planB.clave, para: l.planB.para, planB: true, d };
  if (l.descansoTotal) return { clave: null, d, enfermo: true };
  const clave = d.tipo === 'gym' ? d.letra : d.tipo === 'descanso' ? null : d.tipo;
  return { clave, para: '', d };
}

export function renderHoy(v) {
  const f = hoy(), c = C(), l = leerDia(f);
  const t = queToca(f);
  const dc = diasParaComp(f);

  v.innerHTML = `
    <header class="ola-cab">
      ${olaSVG()}
      <div class="ola-txt">
        <p class="saludo">${saludo()}, ${esc(c.nombre)}</p>
        <p class="fecha">${fechaLarga(f)}</p>
        ${cuentaPill(dc)}
      </div>
    </header>
    <div class="fila-acc">
      <button class="btn-chip" data-h="otro-dia">${ico('cal')}Ver otro día</button>
      ${t.manual ? `<button class="btn-chip acento" data-h="volver">${ico('cambiar')}Volver a lo de hoy</button>` : ''}
      <button class="btn-chip" data-h="parar">${ico('alto')}Cuándo parar</button>
      <a class="btn-chip solo-ico" href="#ajustes" aria-label="Ajustes">${ico('ajustes')}</a>
    </div>
    ${instalable() ? `<button class="instalar" data-h="instalar">${ico('descargar')}<span><b>Instalar app</b><small>Para tenerla en la pantalla y usarla sin internet</small></span></button>` : ''}
    ${sugerencia(f)}
    ${avisoAyer(f, t)}
    ${faltasSemana(f) >= 2 ? `<div class="nota">${ico('corazon')}<span>Semana pesada. Prioriza dormir bien${dc > 0 ? `: faltan ${dc} días para ${esc(c.comp.corto || c.comp.nombre)}` : ''}.</span></div>` : ''}
    ${tarjetaFaseEspecial(f, t.d)}
    ${despuesComp(f)}
    ${hero(f, t, l)}
    ${t.clave ? '<div id="ses" class="ses-cargando"></div>' : manana(f)}
    ${t.d.tipo === 'competencia' && t.clave === 'competencia' ? noche(f) : ''}
    <div id="hoy-resto" class="ses-cargando"></div>`;
  // Lo que queda bajo el borde de la pantalla se pinta en el siguiente cuadro
  const resto = () => `${tarjetaPrincipal()}${semana(f)}${lineaTiempo(f)}${stats(f)}<p class="pie">${esc(FRASES[semilla(f) % FRASES.length])}</p>`;

  // La lista de ejercicios se pinta en el siguiente cuadro: la pantalla responde antes
  requestAnimationFrame(() => setTimeout(() => {
    const r = $('#hoy-resto', v);
    if (r) { r.innerHTML = resto(); r.classList.remove('ses-cargando'); }
    const ses = $('#ses', v);
    if (!ses || !ses.isConnected) return;
    if (!t.clave) return;
    ses.innerHTML = htmlSesion(t.clave, f, t.para);
    ses.classList.remove('ses-cargando');
    activar(ses);
  }));
  const enCurso = t.clave && esGym(t.clave) && !leerRegistro(f, t.clave)?.completa;
  pantallaEncendida(!!enCurso);
  v.onclick = ev => clic(ev, f, t);
}

const saludo = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; };

function olaSVG() {
  return `<svg class="ola-svg" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
    <g class="ola-1"><path d="M0 70 Q50 55 100 70 T200 70 T300 70 T400 70 T500 70 T600 70 T700 70 T800 70 V120 H0 Z" style="fill:var(--aqua)" opacity=".12"/></g>
    <g class="ola-2"><path d="M0 82 Q50 70 100 82 T200 82 T300 82 T400 82 T500 82 T600 82 T700 82 T800 82 V120 H0 Z" style="fill:var(--aqua)" opacity=".18"/></g>
  </svg>`;
}

function cuentaPill(dc) {
  const c = C();
  if (dc > 0) return `<p class="cuenta-pill">${ico('bandera')}<b>${dc}</b> ${dc === 1 ? 'día' : 'días'} para ${esc(c.comp.corto || c.comp.nombre)}</p>`;
  if (faseDe(hoy()) === 'competencia') return `<p class="cuenta-pill">${ico('trofeo')}Hoy: ${esc(c.comp.nombre)}</p>`;
  return '';
}

// Sugerencia suave la primera semana: que alguien lo guíe
function sugerencia(f) {
  if (semanaDe(f).n > 1 || f < C().inicio || S().vistos?.sugerencia) return '';
  return `<section class="card sugerencia-card">
    <p>${ico('mano')}<span><b>Sugerencia:</b> esta semana, si hay un instructor libre, pídele que te vea un par de series de los ejercicios nuevos, sobre todo los saltos y el peso muerto rumano. En la Guía tienes una idea de qué decirle.</span></p>
    <button class="link" data-h="sug-ok">Entendido</button>
  </section>`;
}

// "¿Ayer no pudiste ir?"
function avisoAyer(f, t) {
  const ayer = sumar(f, -1);
  if (ayer < C().inicio || !sesionPerdida(ayer) || leerDia(f).planB || leerDia(f).ayerVisto || t.manual) return '';
  if (['gym', 'precomp', 'competencia', 'descanso'].includes(t.d.tipo)) return '';
  return `<section class="card ayer">
    <p class="eyebrow">${ico('corazon')} Ayer</p>
    <h3>¿Ayer no pudiste ir? Hagamos algo corto hoy en casa.</h3>
    <div class="fila-2">
      <button class="btn-sec" data-h="ayer-no">Sí fui, no lo marqué</button>
      <button class="btn-pri chico" data-h="ayer-si">Plan B en casa</button>
    </div>
  </section>`;
}

function tarjetaFaseEspecial(f, d) {
  const k = `fase-${d.fase}-${C().comp.ini}`;
  if (!['descarga', 'puesta'].includes(d.fase) || S().vistos?.[k]) return '';
  const fa = FASES[d.fase];
  return `<section class="card especial" style="--c:${fa.c}">
    <p class="eyebrow">Empieza una fase nueva</p>
    <h3>${fa.n}</h3>
    <p>${fa.txt}</p>
    <p class="peq">Esta semana suma más movilidad: la movilidad corta todos los días.</p>
    <button class="btn-sec" data-h="fase-ok" data-k="${k}">Entendido</button>
  </section>`;
}

// Durante y justo después de la competencia: anotar tiempos
function despuesComp(f) {
  const fa = faseDe(f);
  if (fa !== 'competencia' && !(fa === 'despues' && diasEntre(compFin(), f) <= 5)) return '';
  return `<a class="card aviso-card" href="#marcas">${ico('trofeo')}<span><b>Anota tus tiempos de ${esc(C().comp.corto || C().comp.nombre)}</b><small>Se guardan directo en Mis marcas.</small></span>${ico('abajo', 'rev-chev')}</a>`;
}

// ── Hero del día ─────────────────────────────────────────────
function hero(f, t, l) {
  const d = t.d, fa = FASES[d.fase], sem = semanaDe(f);
  const chipsFase = d.fase && !['antes', 'despues', 'competencia'].includes(d.fase)
    ? `<span class="tag" style="--c:${fa.c}">${fa.n}</span><span class="tag neutro">Semana ${sem.n} de ${sem.total}</span>` : '';

  if (t.enfermo) return `<section class="hero reposo">
      <div class="reposo-ico">${ico('corazon')}</div>
      <h2>Hoy toca recuperarte</h2>
      <p class="hero-sub">Descanso total y avísale a tu entrenador. Si el dolor no es fuerte, puedes hacer la recuperación activa.</p>
      <button class="btn-sec" data-h="elegir" data-c="recuperacion">${ico('luna')}Recuperación activa</button>
    </section>`;

  if (!t.clave) return `<section class="hero reposo">
      <div class="reposo-ico">${ico('luna')}</div>
      <p class="eyebrow">${NOMBRE_DIA[diaDe(f)]}</p>
      <h2>Descanso total</h2>
      <p class="hero-sub">Hoy no se entrena. Duerme bien y recarga para la semana.</p>
    </section>`;

  const ses = sesionDelDia(t.clave, f);
  const rec = leerRegistro(f, t.clave);
  const p = progreso(ses, rec);
  const gym = esGym(t.clave);
  const agendada = gym && !t.manual && d.tipo === 'gym';
  const mover = agendada && !rec?.completa && !p.ok && opcionMover(f);
  const eyebrow = t.planB ? `${ico('casa')} Plan B en casa` : t.manual ? 'Elegido para hoy' : gym ? `Sesión ${t.clave}${d.corta ? ' corta' : ''} · gimnasio` : d.tipo === 'movilidad' ? `${d.fase === 'antes' ? 'Antes del plan' : 'Día sin gimnasio'} · opcional` : ses.titulo;
  const hecha = rec?.completa;
  return `<section class="hero" style="--hc:${ses.c}">
      <div class="hero-fila">
        <div class="hero-txt">
          <p class="eyebrow">${eyebrow}</p>
          <h2>${esc(ses.n)}</h2>
          <p class="hero-sub">${esc(ses.sub)}</p>
        </div>
        <div class="hero-letra" id="hero-letra" style="--p:${p.frac}">${hecha ? ico('check') : gym ? t.clave : ico(ses.casa ? 'casa' : 'ola')}</div>
      </div>
      <div class="chips">${chipsFase}<span class="tag neutro">${ico('reloj')}~${ses.min} min</span>${ses.tope ? `<span class="tag neutro saltos-tag" id="hero-saltos">${ico('salto')}Saltos ${rec?.saltos || 0}/${ses.tope}</span>` : ''}</div>
      <p class="peq txt2 hero-prog" id="hero-series">${p.ok} de ${p.tot} series</p>
      ${hecha ? `<div class="hecho">${ico('check')}${t.para ? '¡Día salvado!' : gym ? `¡Sesión hecha! RPE ${rec.rpe}` : '¡Hecho!'}</div>` : ''}
      ${agendada && !hecha ? `<div class="fila-2">
          ${mover ? `<button class="btn-sec" data-h="mover">${ico('mover')}Mover sesión</button>` : ''}
          <button class="btn-sec ${mover ? '' : 'ancho'}" data-h="falto">Hoy no puedo ir</button>
        </div>` : ''}
      ${t.planB && !hecha ? '<button class="link" data-h="planb-quitar">Mejor no, hoy descanso</button>' : ''}
      ${gym && C().agua.includes(diaDe(f)) && !hecha ? `<p class="tip">${ico('piscina')}<span>Hoy también nadas: mejor el seco después de nadar, o con 4-6 horas de diferencia.</span></p>` : ''}
    </section>
    ${gym && !hecha ? chequeoCard(l) : ''}
    ${botonPiscina(f, t)}`;
}

function chequeoCard(l) {
  if (!l.chequeo) return `<button class="chequeo-btn" data-h="chequeo">${ico('corazon')}<span><b>¿Cómo vienes hoy?</b><small>Chequeo de 10 segundos: sueño, cansancio y dolor</small></span>${ico('abajo', 'rev-chev')}</button>`;
  const txt = l.chequeo.dolor?.length ? `Con dolor de ${l.chequeo.dolor.join(' y ')}` : l.ligera ? 'Versión ligera' : 'Todo bien';
  return `<button class="chequeo-btn hecho-cq" data-h="chequeo">${ico('check')}<span><b>Chequeo: ${txt}</b><small>Toca para repetirlo</small></span></button>`;
}

function botonPiscina(f, t) {
  const l = leerDia(f);
  if (!C().agua.includes(diaDe(f)) || l.planB || l.faltoAgua || t.manual) return '';
  return `<button class="btn-sec piscina" data-h="falto-agua">${ico('piscina')}Hoy no fui a la piscina</button>`;
}

// Domingo o día sin rutina: qué viene mañana
function manana(f) {
  const m = sumar(f, 1), dm = deFecha(m);
  const clave = dm.tipo === 'gym' ? dm.letra : dm.tipo === 'descanso' ? null : dm.tipo;
  if (!clave) return '';
  return `<section class="card manana">
    <p class="eyebrow">Mañana te toca</p>
    <h3>${nombreClave(clave)}</h3>
    <p class="txt2">${esGym(clave) ? esc(SESIONES[clave].sub) : esc(RUTINAS[clave]?.sub || '')}</p>
  </section>`;
}

function noche(f) {
  const b = leerRegistro(f, 'noche');
  return `<section class="card">
    <div class="card-cab"><h3>${RUTINAS.noche.n}</h3>${b?.completa ? ico('check') : ''}</div>
    <p class="txt2 peq">${RUTINAS.noche.sub}</p>
    ${b?.completa ? '' : `<button class="btn-sec" data-h="elegir" data-c="noche">${ico('luna')}Hacerla ahora</button>`}
  </section>`;
}

// ── Semana ───────────────────────────────────────────────────
// Los domingos (y antes de que arranque el plan) se muestra la semana que viene
function lunesVisible(f) {
  if (f < C().inicio) return lunesDe(C().inicio);
  return diaDe(f) === 'dom' ? lunesDe(sumar(f, 1)) : lunesDe(f);
}

function semana(f) {
  const lun = lunesVisible(f);
  const proxima = lun > f;
  const dias = Array.from({ length: 7 }, (_, i) => sumar(lun, i));
  return `<section class="card">
    <div class="card-cab"><h3>${proxima ? 'Semana que viene' : 'Esta semana'}</h3><span class="cont">${fechaCorta(lun)} – ${fechaCorta(sumar(lun, 6))}</span></div>
    <div class="semana">${dias.map(x => {
      const d = deFecha(x), l = leerDia(x);
      const hecho = l.completa || l.salvado || l.recuperada || leerRegistro(x, 'movilidad')?.completa || leerRegistro(x, 'precomp')?.completa;
      const letra = d.tipo === 'gym' ? d.letra : d.tipo === 'descanso' ? '–' : d.tipo === 'precomp' ? '★' : d.tipo === 'competencia' ? '🏁' : '·';
      const col = d.tipo === 'gym' ? SESIONES[d.letra].c : 'var(--txt2)';
      const perdido = x < f && d.tipo === 'gym' && !l.completa;
      return `<div class="sd ${x === f ? 'hoy' : ''} ${hecho ? 'hecho' : ''} ${perdido ? (l.salvado || l.recuperada ? 'salvado' : 'perdido') : ''} t-${d.tipo}" style="--c:${col}">
        <span>${INICIAL[diaDe(x)]}</span><b>${hecho && d.tipo === 'gym' ? '✓' : letra}</b>${C().agua.includes(diaDe(x)) ? '<i></i>' : ''}
      </div>`;
    }).join('')}</div>
    <div class="leyenda"><span><i style="background:var(--aqua)"></i>A piernas</span><span><i style="background:var(--azul)"></i>B tren superior</span><span><i style="background:var(--turq)"></i>C sin máquinas</span><span><i class="agua"></i>agua</span></div>
  </section>`;
}

// ── Línea de tiempo del plan ─────────────────────────────────
function lineaTiempo(f) {
  const ts = tramos();
  const ini = ts[0].ini, fin = ts[ts.length - 1].fin;
  const total = diasEntre(ini, fin) + 1;
  const pos = Math.min(100, Math.max(0, (diasEntre(ini, f) + 0.5) / total * 100));
  const fa = FASES[faseDe(f)];
  return `<section class="card">
    <div class="card-cab"><h3>Tu plan</h3><span class="cont">${fechaCorta(ini)} → ${fechaCorta(C().comp.ini)}</span></div>
    <div class="fase-banner" style="--c:${fa.c}"><b>Fase: ${fa.n}.</b> ${fa.txt}</div>
    <div class="linea">
      ${ts.map(t => `<span style="flex:${diasEntre(t.ini, t.fin) + 1};--c:${FASES[t.fase].c}" title="${FASES[t.fase].n}"></span>`).join('')}
      ${f >= ini && f <= fin ? `<i class="aqui ${pos < 15 ? 'izq' : pos > 85 ? 'der' : ''}" style="left:${pos}%"><em>Estás aquí</em></i>` : ''}
    </div>
    <div class="leyenda">${[...new Set(ts.map(t => t.fase))].map(k => `<span><i style="background:${FASES[k].c}"></i>${FASES[k].n}</span>`).join('')}</div>
  </section>`;
}

function stats(f) {
  return `<div class="stats">
    <div class="stat racha">${ico('fuego')}<b>${racha(f)}</b><span>sesiones seguidas</span></div>
    <div class="stat salvados">${ico('corazon')}<b>${diasSalvados()}</b><span>días salvados con el Plan B</span></div>
  </div>`;
}

// ── Acciones ─────────────────────────────────────────────────
function clic(ev, f, t) {
  const b = ev.target.closest('[data-h]');
  if (!b) return;
  const refrescar = () => dispatchEvent(new Event('fs:refrescar'));
  switch (b.dataset.h) {
    case 'otro-dia': hojaDia(f, t); break;
    case 'volver': delete dia(f).plan; guardar(); refrescar(); break;
    case 'elegir': dia(f).plan = b.dataset.c; guardar(); refrescar(); scrollTo({ top: 0, behavior: 'smooth' }); break;
    case 'parar': hojaParar(); break;
    case 'instalar': instalar(); break;
    case 'chequeo': chequeo(f); break;
    case 'mover': hojaMover(f); break;
    case 'falto': faltoGym(f); break;
    case 'falto-agua': motivo(f, 'agua', f); break;
    case 'ayer-si': dia(sumar(f, -1)).falto = true; guardar(); motivo(f, 'gym', sumar(f, -1)); break;
    case 'ayer-no': dia(f).ayerVisto = true; guardar(); refrescar(); break;
    case 'sug-ok': (S().vistos ||= {}).sugerencia = true; guardar(); refrescar(); break;
    case 'fase-ok': (S().vistos ||= {})[b.dataset.k] = true; guardar(); refrescar(); break;
    case 'planb-quitar': { const d = dia(f); delete d.planB; guardar(); refrescar(); break; }
  }
}

// ── Ver otro día (como en Mi Rutina) ─────────────────────────
function hojaDia(f, t) {
  const lun = lunesVisible(f);
  const dias = Array.from({ length: 7 }, (_, i) => sumar(lun, i));
  const actual = t.clave;
  const op = (clave, n, sub, extra = '') => `<button class="dia-op ${clave === actual ? 'act' : ''}" data-c="${clave}"><span class="dia-n">${n}</span><span class="dia-t">${sub}</span>${extra}</button>`;
  const h = abrirHoja(`<h3 class="hoja-t">¿Qué entrenas hoy?</h3>
    <p class="hoja-sub">Si te saltaste un día o quieres cambiar. Lo que marques queda en la fecha de hoy.</p>
    <div class="dias">${dias.map(x => {
      const d = deFecha(x);
      const clave = d.tipo === 'gym' ? d.letra : d.tipo === 'descanso' ? 'descanso' : d.tipo;
      const sub = clave === 'descanso' ? 'Descanso' : nombreClave(clave);
      return op(clave, `${NOMBRE_DIA[diaDe(x)]} ${fechaCorta(x).split(' ')[0]}`, sub, x === f ? '<span class="dia-hoy">Hoy</span>' : '');
    }).join('')}</div>
    <h4 class="sub-t">${ico('casa')} En casa</h4>
    <div class="dias">${['movilidad', 'recuperacion', 'forma', 'agua'].map(k => op(k, NOMBRES[k], RUTINAS[k].sub.split(' · ')[0])).join('')}</div>`);
  h.onclick = e => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    const c = b.dataset.c;
    const d = dia(f);
    const deCalendario = (() => { const dd = deFecha(f); return dd.tipo === 'gym' ? dd.letra : dd.tipo === 'descanso' ? 'descanso' : dd.tipo; })();
    if (c === deCalendario && !d.planB) delete d.plan; else d.plan = c;
    guardar(); vibrar(); cerrarHoja();
    dispatchEvent(new Event('fs:refrescar'));
    scrollTo({ top: 0, behavior: 'smooth' });
  };
}

function hojaMover(f, desdeFalto = false) {
  const op = opcionMover(f);
  if (!op) return false;
  const txt = op.movs.map(m => `<li><b>${NOMBRE_DIA[diaDe(m.de)]}</b> → <b>${NOMBRE_DIA[diaDe(m.a)]} ${fechaCorta(m.a)}</b> <span class="txt2">(sesión ${deFecha(m.de).letra})</span></li>`).join('');
  const h = abrirHoja(`
    <p class="eyebrow">${ico('mover')} Mover sesión</p>
    <h2 class="hoja-t">${desdeFalto ? '¿La movemos?' : 'Mover sesión'}</h2>
    <p class="hoja-sub">${op.tipo === 'uno' ? 'Hay un día libre esta semana sin quedar pegada a otra sesión.' : 'Para no hacer dos sesiones seguidas, se corre un día lo que queda de la semana.'}</p>
    <ul class="movs">${txt}</ul>
    <button class="btn-pri" data-m="si">${ico('check')}Mover</button>
    ${desdeFalto ? '<button class="btn-sec" data-m="no">No, esta semana no puedo</button>' : ''}`);
  h.onclick = e => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    if (b.dataset.m === 'si') {
      S().movs.push(...op.movs);
      dia(f).movida = op.movs[0].a;
      guardar(); cerrarHoja(); vibrar();
      aviso(`Sesión movida al ${fechaDia(op.movs[0].a)}`, 'mover');
      dispatchEvent(new Event('fs:refrescar'));
    } else { cerrarHoja(); setTimeout(() => motivo(f, 'gym', f), 320); }
  };
  return true;
}

function faltoGym(f) {
  if (!hojaMover(f, true)) motivo(f, 'gym', f);
}

// ¿Por qué faltaste? → rutina de Plan B
function motivo(f, que, para) {
  const h = abrirHoja(`
    <p class="eyebrow">${ico('corazon')} Plan B</p>
    <h2 class="hoja-t">¿Qué pasó?</h2>
    <div class="opciones">
      <button class="opcion" data-m="cansado"><b>Muy cansado</b><span>Hoy no me da el cuerpo</span></button>
      <button class="opcion" data-m="tiempo"><b>Sin tiempo o sin ganas</b><span>Pero puedo hacer algo corto en casa</span></button>
      <button class="opcion" data-m="enfermo"><b>Enfermo o con dolor</b><span>Algo no está bien</span></button>
    </div>`);
  h.onclick = e => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    const m = b.dataset.m;
    const d = dia(f);
    if (que === 'gym') dia(para).falto = true; else d.faltoAgua = true;
    d.motivo = m; dia(para).motivo = m;
    delete d.plan;
    if (m === 'enfermo') { d.descansoTotal = true; delete d.planB; }
    else {
      const clave = m === 'cansado' || faseDe(f) === 'puesta' ? 'recuperacion' : que === 'gym' ? 'forma' : 'agua';
      d.planB = { clave, para, que };
    }
    guardar(); cerrarHoja();
    dispatchEvent(new Event('fs:refrescar'));
  };
}
