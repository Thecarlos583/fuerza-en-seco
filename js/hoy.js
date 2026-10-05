// Pantalla Hoy: lo que toca entrenar con sus ejercicios (al estilo de Mi Rutina),
// cuenta regresiva, fases, Ver otro día, Mover sesión y Plan B en casa.
import { FASES, RUTINAS, SESIONES, EJ, SUGERIR, LIGAS_TXT } from './data.js';
import { S, C, guardar, dia, leerDia } from './store.js';
import { hoy, sumar, lunesDe, diasEntre, diaDe, fechaCorta, fechaDia, fechaLarga, NOMBRE_DIA, INICIAL } from './fechas.js';
import { deFecha, faseDe, semanaDe, tramos, opcionMover, sesionPerdida, racha, diasSalvados, faltasSemana, diasParaComp, ligasDeCompetencia, sesionLigas, RECUPERACION } from './plan.js';
import { progreso, leerRegistro, htmlSesion, activar, sesionDelDia, chequeo, hojaParar } from './sesion.js';
import { $, $$, ico, esc, abrirHoja, cerrarHoja, aviso, vibrar, semilla, pantallaEncendida, notificar } from './util.js';
import { instalable, instalar } from './app-instalar.js';
import { tarjetaPrincipal, nombrePrueba } from './marcas.js';
import { compFin } from './plan.js';

const FRASES = [
  'Cada salto de hoy es un metro menos de pared a pared.',
  'Calidad antes que cansancio.',
  'Explosivo y limpio. Así se nada rápido.',
  'La técnica de hoy es la velocidad de mañana.',
  'Rápido, fresco y sin prisa por cansarte.',
];
const esGym = c => c && c.length === 1 && 'ABC'.includes(c);
const NOMBRES = { movilidad: 'Movilidad corta', recuperacion: 'Recuperación activa', forma: 'Mantener la forma', agua: 'Mantener el agua en seco', precomp: 'Activación precompetencia', competencia: 'Calentamiento en seco', noche: 'Recuperación de la noche', recMar: 'Recuperación: caderas y tobillos', recJue: 'Recuperación: hombros y espalda', recSab: 'Recuperación: todo el cuerpo', ligas: 'Activación antes de nadar', ligas2: 'Activación antes de nadar (2.ª sesión)', ligasComp: 'Activación de competencia', ligasMini: 'Mini activación' };
const nombreClave = c => esGym(c) ? `Sesión ${c} · ${SESIONES[c].n}` : NOMBRES[c] || '';

// Qué rutina se muestra hoy: lo elegido a mano, el Plan B o lo del calendario
function queToca(f) {
  const d = deFecha(f), l = leerDia(f);
  if (l.plan) return { clave: l.plan === 'descanso' ? null : l.plan, para: '', manual: true, d };
  if (l.planB) return { clave: l.planB.clave, para: l.planB.para, planB: true, d };
  if (l.descansoTotal) return { clave: null, d, enfermo: true };
  const clave = d.tipo === 'gym' ? d.letra : d.tipo === 'descanso' ? null : d.tipo === 'competencia' ? 'ligasComp' : d.clave || d.tipo;
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
    ${comoTeFue(f)}
    ${instalable() ? `<button class="instalar" data-h="instalar">${ico('descargar')}<span><b>Instalar app</b><small>Para tenerla en la pantalla y usarla sin internet</small></span></button>` : ''}
    ${sugerencia(f)}
    ${faltasSemana(f) >= 2 ? `<div class="nota">${ico('corazon')}<span>Semana pesada. Prioriza dormir bien${dc > 0 ? `: faltan ${dc} días para ${esc(c.comp.corto || c.comp.nombre)}` : ''}.</span></div>` : ''}
    ${tarjetaFaseEspecial(f, t.d)}
    ${despuesComp(f)}
    ${hero(f, t, l)}
    ${antesDeNadar(f, t)}
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
  v.onchange = ev => cambioHora(ev, f);
  relojLigas(v, f);
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

// ── "¿Cómo te fue ayer?" (registrar el día en 2 toques) ─────
// Un día queda registrado si se entrenó, se marcó que no fue, que descansó o se salvó con el Plan B
export function registrado(f) {
  const l = leerDia(f);
  return !!(l.completa || l.registro || l.falto || l.descanso || l.salvado || l.recuperada || l.descansoTotal
    || Object.values(l.r || {}).some(r => r.completa));
}
function porRegistrar(f) {
  const ayer = sumar(f, -1), d = deFecha(ayer);
  if (ayer < C().inicio || d.tipo === 'descanso' || registrado(ayer)) return null;
  if (!['gym', 'recuperacion', 'movilidad', 'precomp', 'competencia'].includes(d.tipo)) return null;
  return { ayer, d };
}
function comoTeFue(f) {
  const p = porRegistrar(f);
  if (!p) return '';
  const que = p.d.tipo === 'gym' ? `Sesión ${p.d.letra} · ${SESIONES[p.d.letra].n}` : NOMBRES[p.d.clave || p.d.tipo] || 'Tu rutina';
  return `<section class="card ayer" id="ayer">
    <p class="eyebrow">${ico('cal')} Ayer, ${fechaDia(p.ayer)}</p>
    <h3>¿Cómo te fue ayer?</h3>
    <p class="txt2 peq">Te tocaba: ${esc(que)}. Regístralo en un toque.</p>
    <div class="ayer-btns">
      <button class="btn-sec" data-h="ayer-entreno">${ico('check')}Entrené ✅</button>
      <button class="btn-sec" data-h="ayer-nofui">No fui</button>
      <button class="btn-sec" data-h="ayer-descanso">${ico('luna')}Descansé (día libre)</button>
    </div>
  </section>`;
}
function registrarAyer(f, como) {
  const p = porRegistrar(f);
  if (!p) return;
  const d = dia(p.ayer);
  if (como === 'entreno') {
    d.registro = 'entreno';
    if (p.d.tipo === 'gym') d.completa = true;
    else { const k = p.d.clave || p.d.tipo; ((d.r ||= {})[k] ||= { hechas: {}, pesos: {}, saltos: 0 }).completa = true; }
    aviso('Listo, día registrado', 'check');
  }
  if (como === 'descanso') { d.descanso = true; d.registro = 'descanso'; aviso('Anotado como día libre', 'luna'); }
  guardar();
  if (como === 'nofui') return motivo(f, p.d.tipo === 'gym' ? 'gym' : 'otro', p.ayer);
  dispatchEvent(new Event('fs:refrescar'));
}

// ── Antes de nadar: activación con ligas ─────────────────────
// En cada día de agua (dos tarjetas si nada dos veces); en descarga, puesta a punto y competencia, la versión de competencia.
const hhmm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
const aMin = s => { if (!/^\d{1,2}:\d{2}/.test(s || '')) return null; const [h, m] = s.split(':').map(Number); return h * 60 + m; };
function horasDeHoy(f) {
  const h = S().horas?.[f] || {};
  return (S().marcas?.comp || []).map(id => ({ id, min: aMin(h[id]) })).filter(x => x.min != null).sort((a, b) => a.min - b.min);
}
// Activación 35 min antes de la primera prueba; mini activación 12 min antes de otra si hay 1 h o más desde la anterior
export function planDeHoras(f) {
  const ev = horasDeHoy(f), out = [];
  ev.forEach((x, i) => {
    if (i === 0) out.push({ tipo: 'ligasComp', id: x.id, prueba: x.min, act: x.min - 35 });
    else if (x.min - ev[i - 1].min >= 60) out.push({ tipo: 'ligasMini', id: x.id, prueba: x.min, act: x.min - 12 });
  });
  return out;
}
function antesDeNadar(f, t) {
  const c = C(), d = t.d, l = leerDia(f);
  const compDia = d.tipo === 'competencia';
  if (c.activacion === false && !compDia) return '';
  if (!compDia && !c.agua.includes(diaDe(f))) return '';
  const comp = ligasDeCompetencia(f) || compDia;
  const doble = !compDia && (c.aguaDoble || []).includes(diaDe(f));
  const claves = compDia ? ['ligasComp'] : doble ? ['ligas', 'ligas2'] : ['ligas'];
  if (t.clave && claves.includes(t.clave) && !compDia) return ''; // ya se muestra como sesión principal
  const ses = sesionLigas(claves[0], f);
  const hecha = k => !!l.r?.[k]?.completa;
  const intro = !S().vistos?.ligas ? `<div class="ligas-intro">
      <p><b>¿Para qué sirve?</b> Despierta hombros, caderas y core para que arranques más rápido. No es para cansarte.</p>
      <p><b>La banda:</b> ligera o mediana. Si tiembla o te cuesta mucho, es muy dura: usa una más suave o acércate a donde está atada.</p>
      <button class="link" data-h="ligas-ok">Entendido</button>
    </div>` : '';
  const etiqueta = k => claves.length > 1 ? (k === 'ligas' ? 'Sesión de la madrugada' : 'Sesión de la tarde') : '';
  const botones = k => hecha(k) ? `<div class="hecho">${ico('check')}¡Hecha!</div>` : compDia && t.clave === k ? '' : `<div class="fila-2">
        <button class="btn-sec" data-h="ligas-hacer" data-c="${k}">${ico('play')}Hacerla ahora</button>
        <button class="btn-sec" data-h="ligas-hecha" data-c="${k}">${ico('check')}Ya la hice ✅</button>
      </div>`;
  return `<section class="card ligas" id="ligas">
    <div class="card-cab"><h3>${ico('piscina')} Antes de nadar</h3><span class="cont">${ico('reloj')}~${ses.min} min</span></div>
    <p class="ligas-n"><b>${esc(ses.n)}</b> · ${esc(ses.sub)}</p>
    ${intro}
    <p class="txt2 peq">${comp ? LIGAS_TXT.comp : LIGAS_TXT.agua}</p>
    ${compDia ? horasHTML(f) : ''}
    ${claves.map(k => `<div class="ligas-fila">${etiqueta(k) ? `<span class="ligas-et">${etiqueta(k)}</span>` : ''}${botones(k)}</div>`).join('')}
    <ul class="ligas-notas">
      <li>${LIGAS_TXT.ligera}</li>
      <li>${LIGAS_TXT.dinamica}</li>
      ${comp ? `<li>${LIGAS_TXT.entrenador}</li>` : ''}
    </ul>
  </section>`;
}
function horasHTML(f) {
  const ev = S().marcas?.comp || [];
  if (!ev.length) return `<p class="nota">${ico('info')}<span>Marca con 🏁 en Mis marcas las pruebas que nadas para calcular la hora de tu activación.</span></p>`;
  const h = S().horas?.[f] || {};
  const plan = planDeHoras(f);
  const ahora = new Date(), mins = ahora.getHours() * 60 + ahora.getMinutes();
  const prox = f === hoy() ? plan.find(p => p.act > mins) : null;
  return `<div class="horas">
    <p class="sub-t">${ico('reloj')} ¿A qué hora nadas cada prueba?</p>
    ${ev.map(id => `<label class="hora-fila"><span>${nombrePrueba(id)}</span><input type="time" data-hora="${id}" value="${h[id] || ''}"></label>`).join('')}
    ${plan.length ? `<ul class="horas-plan">${plan.map(p => `<li class="${p.tipo === 'ligasMini' ? 'mini' : ''}"><span>Tu ${nombrePrueba(p.id)} es a las <b>${hhmm(p.prueba)}</b> → ${p.tipo === 'ligasMini' ? 'mini activación (2 min)' : 'activación'} a las <b>${hhmm(p.act)}</b></span>${p.tipo === 'ligasMini' ? `<button class="link" data-h="ligas-hacer" data-c="ligasMini">Hacer la mini</button>` : ''}</li>`).join('')}</ul>` : ''}
    ${prox ? `<p class="cuenta-ligas" id="cuenta-ligas" data-act="${prox.act}">${ico('reloj')}<span>${cuentaTxt(prox.act)}</span></p>` : ''}
    <p class="txt2 peq">Si activaste las notificaciones, te aviso 5 minutos antes. Con la app cerrada no se puede garantizar: pon también una alarma en el reloj del teléfono.</p>
  </div>`;
}
function cuentaTxt(act) {
  const d = new Date(), resta = act - (d.getHours() * 60 + d.getMinutes());
  return resta <= 0 ? '¡Ya es hora de tu activación!' : `Faltan ${resta >= 60 ? `${Math.floor(resta / 60)} h ` : ''}${resta % 60} min para tu activación`;
}
let relojId = null;
const avisados = new Set();
function relojLigas(v, f) {
  clearInterval(relojId);
  if (deFecha(f).tipo !== 'competencia' || f !== hoy()) return;
  const tic = () => {
    if (!v.isConnected) return clearInterval(relojId);
    const el = $('#cuenta-ligas', v);
    if (el) el.querySelector('span').textContent = cuentaTxt(Number(el.dataset.act));
    const d = new Date(), mins = d.getHours() * 60 + d.getMinutes();
    for (const p of planDeHoras(f)) {
      const k = `${f}-${p.id}-${p.act}`;
      if (mins >= p.act - 5 && mins < p.act && !avisados.has(k)) {
        avisados.add(k);
        notificar('Activación en 5 minutos', `Tu ${nombrePrueba(p.id)} es a las ${hhmm(p.prueba)}. Busca tu banda.`);
        aviso('Tu activación es en 5 minutos', 'reloj', 5000);
      }
    }
  };
  tic();
  relojId = setInterval(tic, 30000);
}
function cambioHora(ev, f) {
  const i = ev.target.closest('[data-hora]');
  if (!i) return;
  ((S().horas ||= {})[f] ||= {})[i.dataset.hora] = i.value;
  guardar();
  dispatchEvent(new Event('fs:refrescar'));
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
      <p class="hero-sub">Descanso total y avísale a tu entrenador de natación. Si te sientes mejor, puedes hacer la movilidad suave.</p>
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
  const eyebrow = t.planB ? `${ico('casa')} Plan B${ses.suave ? ' · versión suave' : ''}` : t.manual ? 'Elegido para hoy' : gym ? `Sesión ${t.clave}${d.corta ? ' corta' : ''} · gimnasio` : ses.luna ? `${ico('luna')} Recuperación de hoy` : d.tipo === 'movilidad' ? `${d.fase === 'antes' ? 'Antes del plan' : 'Día sin gimnasio'} · opcional` : ses.titulo;
  const hecha = rec?.completa;
  return `<section class="hero" style="--hc:${ses.c}">
      <div class="hero-fila">
        <div class="hero-txt">
          <p class="eyebrow">${eyebrow}</p>
          <h2>${esc(ses.n)}</h2>
          <p class="hero-sub">${esc(ses.sub)}</p>
        </div>
        <div class="hero-letra" id="hero-letra" style="--p:${p.frac}">${hecha ? ico('check') : gym ? t.clave : ico(ses.luna ? 'luna' : ses.casa ? 'casa' : 'ola')}</div>
      </div>
      <div class="chips">${chipsFase}<span class="tag neutro">${ico('reloj')}~${ses.min} min</span>${ses.tope ? `<span class="tag neutro saltos-tag" id="hero-saltos">${ico('salto')}Saltos ${rec?.saltos || 0}/${ses.tope}</span>` : ''}</div>
      <p class="peq txt2 hero-prog" id="hero-series">${p.ok} de ${p.tot} series</p>
      ${hecha ? `<div class="hecho">${ico('check')}${t.para ? '¡Día salvado!' : gym ? `¡Sesión hecha! RPE ${rec.rpe}` : '¡Hecho!'}</div>` : ''}
      ${ses.luna && !hecha && !t.planB ? `<p class="tip">${ico('luna')}<span>Hazla en la noche, antes de dormir, o entre tus dos entrenamientos.</span></p>` : ''}
      ${ses.suave && !hecha ? `<p class="tip">${ico('corazon')}<span>Versión suave: una serie de cada uno, sin forzar. Avísale a tu entrenador cómo te sientes.</span></p>` : ''}
      ${agendada && !hecha ? `<div class="fila-2">
          ${mover ? `<button class="btn-sec" data-h="mover">${ico('mover')}Mover sesión</button>` : ''}
          <button class="btn-sec ${mover ? '' : 'ancho'}" data-h="falto">Hoy no fui</button>
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
      const hecho = l.completa || l.salvado || l.recuperada || Object.values(l.r || {}).some(r => r.completa);
      const letra = d.tipo === 'gym' ? d.letra : d.tipo === 'descanso' ? '–' : d.tipo === 'precomp' ? '★' : d.tipo === 'competencia' ? '🏁' : d.tipo === 'recuperacion' ? '☾' : '·';
      const col = d.tipo === 'gym' ? SESIONES[d.letra].c : 'var(--txt2)';
      const perdido = x < f && d.tipo === 'gym' && !l.completa;
      return `<div class="sd ${x === f ? 'hoy' : ''} ${hecho ? 'hecho' : ''} ${perdido ? (l.salvado || l.recuperada ? 'salvado' : 'perdido') : ''} t-${d.tipo}" style="--c:${col}">
        <span>${INICIAL[diaDe(x)]}</span><b>${hecho && d.tipo === 'gym' ? '✓' : letra}</b>${C().agua.includes(diaDe(x)) ? '<i></i>' : ''}
      </div>`;
    }).join('')}</div>
    <div class="leyenda"><span><i style="background:var(--aqua)"></i>A piernas</span><span><i style="background:var(--azul)"></i>B tren superior</span><span><i style="background:var(--turq)"></i>C sin máquinas</span><span><i class="agua"></i>agua</span><span>☾ recuperación</span></div>
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
    case 'ayer-entreno': registrarAyer(f, 'entreno'); break;
    case 'ayer-nofui': registrarAyer(f, 'nofui'); break;
    case 'ayer-descanso': registrarAyer(f, 'descanso'); break;
    case 'ligas-ok': (S().vistos ||= {}).ligas = true; guardar(); refrescar(); break;
    case 'ligas-hacer': dia(f).plan = b.dataset.c; guardar(); refrescar(); scrollTo({ top: 0, behavior: 'smooth' }); break;
    case 'ligas-hecha': { const d = dia(f); ((d.r ||= {})[b.dataset.c] ||= { hechas: {}, pesos: {}, saltos: 0 }).completa = true; guardar(); vibrar([30, 40, 30]); aviso('Activación lista. ¡A nadar!', 'check'); refrescar(); break; }
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
      const clave = d.tipo === 'gym' ? d.letra : d.tipo === 'descanso' ? 'descanso' : d.tipo === 'competencia' ? 'ligasComp' : d.clave || d.tipo;
      const sub = clave === 'descanso' ? 'Descanso' : nombreClave(clave);
      return op(clave, `${NOMBRE_DIA[diaDe(x)]} ${fechaCorta(x).split(' ')[0]}`, sub, x === f ? '<span class="dia-hoy">Hoy</span>' : '');
    }).join('')}</div>`);
  h.onclick = e => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    const c = b.dataset.c;
    const d = dia(f);
    const deCalendario = (() => { const dd = deFecha(f); return dd.tipo === 'gym' ? dd.letra : dd.tipo === 'descanso' ? 'descanso' : dd.tipo === 'competencia' ? 'ligasComp' : dd.clave || dd.tipo; })();
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
  motivo(f, 'gym', f);
}

// Paso 1: ¿Por qué no pudiste?  (que: 'gym', 'agua' u 'otro'; para: el día que se salva)
function motivo(f, que, para) {
  const h = abrirHoja(`
    <p class="eyebrow">${ico('corazon')} Plan B</p>
    <h2 class="hoja-t">¿Por qué no pudiste?</h2>
    <div class="opciones">
      <button class="opcion grande" data-m="cansado"><b>Muy cansado</b><span>Hoy no me da el cuerpo</span></button>
      <button class="opcion grande" data-m="tiempo"><b>Sin tiempo o sin ganas</b><span>Pero puedo hacer algo en casa</span></button>
      <button class="opcion grande" data-m="enfermo"><b>Enfermo o con dolor</b><span>Algo no está bien</span></button>
    </div>`);
  h.onclick = e => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    const m = b.dataset.m, d = dia(f);
    if (que === 'agua') d.faltoAgua = true; else dia(para).falto = true;
    d.motivo = m; dia(para).motivo = m;
    delete d.plan;
    guardar(); vibrar(8);
    elegirPlanB(f, que, para, m, h);
  };
}

// Paso 2: Elige tu Plan B (4 tarjetas, una recomendada según el motivo)
const MOV_DE = { A: 'recMar', B: 'recJue', C: 'recSab' };
function elegirPlanB(f, que, para, m, h) {
  const letra = deFecha(para).letra;
  const mov = MOV_DE[letra] || RECUPERACION[diaDe(para)] || 'recSab';
  const corta = ['descarga', 'puesta'].includes(faseDe(f));
  const ops = m === 'enfermo'
    ? [{ k: mov, n: 'Movilidad suave', t: '10 min · una serie de cada uno', eq: 'Solo una banda', suave: true, rec: true }, { k: 'descanso', n: 'Descanso total', t: 'Hoy no entrenas', eq: 'Nada' }]
    : [
      { k: mov, n: 'Movilidad y estiramiento', t: '12 min', eq: RUTINAS[mov].n + ' · solo una banda', rec: false },
      { k: 'recuperacion', n: 'Recuperación activa', t: '12-15 min', eq: 'Piso, pared y marco de puerta' },
      ...(corta ? [] : [{ k: 'forma', n: 'Mantener la forma en casa', t: '20-25 min', eq: 'Piso, sofá y una banda' }]),
      ...(corta || que !== 'agua' ? [] : [{ k: 'agua', n: 'Mantener el agua en seco', t: '25-30 min', eq: 'Banda, cama y pared' }]),
    ];
  if (m !== 'enfermo') {
    const recomendada = m === 'cansado' ? 'recuperacion' : corta ? mov : que === 'agua' ? 'agua' : 'forma';
    ops.forEach(o => { o.rec = o.k === recomendada; });
  }
  h.innerHTML = `
    <div class="hoja-asa"></div>
    <p class="eyebrow">${ico('corazon')} Plan B</p>
    <h2 class="hoja-t">Elige tu Plan B</h2>
    ${m === 'enfermo' ? `<p class="nota coral">${ico('info')}<span>Si estás enfermo o con dolor, descansa y avísale a tu entrenador de natación.</span></p>` : `<p class="hoja-sub">Al terminarlo cuenta como día salvado.${corta ? ' En esta fase solo van opciones suaves.' : ''}</p>`}
    <div class="planb-ops">${ops.map(o => `<button class="planb-op ${o.rec ? 'rec' : ''}" data-k="${o.k}" ${o.suave ? 'data-suave="1"' : ''}>
      ${o.rec ? `<span class="rec-tag">${ico('trofeo')}Recomendado para ti</span>` : ''}
      <b>${o.n}</b>
      <span class="planb-meta">${ico('reloj')}${o.t}</span>
      <span class="planb-meta">${ico('casa')}${esc(o.eq)}</span>
    </button>`).join('')}</div>`;
  h.onclick = e => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const d = dia(f);
    if (b.dataset.k === 'descanso') { d.descansoTotal = true; delete d.planB; }
    else { delete d.descansoTotal; d.planB = { clave: b.dataset.k, para, que, suave: !!b.dataset.suave }; }
    guardar(); cerrarHoja();
    dispatchEvent(new Event('fs:refrescar'));
    scrollTo({ top: 0, behavior: 'smooth' });
  };
}
