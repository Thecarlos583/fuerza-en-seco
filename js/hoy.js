// Pantalla Hoy: cuenta regresiva, fases, sesión del día, Mover sesión y Plan B en casa.
import { FASES, RUTINAS, SESIONES, EJ } from './data.js';
import { S, C, guardar, dia, leerDia } from './store.js';
import { hoy, sumar, lunesDe, diasEntre, diaDe, fechaCorta, fechaDia, fechaLarga, NOMBRE_DIA, INICIAL, SEMANA } from './fechas.js';
import { deFecha, faseDe, semanaDe, tramos, sesionDe, opcionMover, sesionPerdida, racha, diasSalvados, faltasSemana, pendientesRevision, diasParaComp } from './plan.js';
import { progreso, leerRegistro, abrirSesion, hojaAyuda } from './sesion.js';
import { $, ico, esc, abrirHoja, cerrarHoja, aviso, vibrar, semilla } from './util.js';
import { instalable, instalar } from './app-instalar.js';

const FRASES = [
  'Cada salto de hoy es un metro menos de pared a pared.',
  'Calidad antes que cansancio.',
  'Explosivo y limpio. Así se nada rápido.',
  'La técnica de hoy es la velocidad de mañana.',
  'Rápido, fresco y sin prisa por cansarte.',
];

export function renderHoy(v) {
  const f = hoy(), c = C(), d = deFecha(f), l = leerDia(f);
  const fase = FASES[d.fase];
  const dc = diasParaComp(f);
  const corto = c.comp.corto || c.comp.nombre;

  v.innerHTML = `
    <header class="ola-cab">
      ${olaSVG()}
      <div class="ola-txt">
        <p class="saludo">${saludo()}, ${esc(c.nombre)}</p>
        <p class="fecha">${fechaLarga(f)}</p>
      </div>
    </header>

    ${instalable() ? `<button class="instalar" data-a="instalar">${ico('descargar')}<span><b>Instalar app</b><small>Para tenerla en tu pantalla y usarla sin internet</small></span></button>` : ''}

    ${cuenta(dc, corto)}
    ${avisoAyer(f)}
    ${faltasSemana(f) >= 2 ? `<div class="nota">${ico('corazon')}<span>Llevas una semana pesada. Prioriza dormir bien. ${dc > 0 ? `Faltan ${dc} días para ${esc(corto)} y cada día cuenta.` : ''}</span></div>` : ''}
    ${tarjetaFaseEspecial(f, d)}
    ${heroDia(f, d, l)}
    ${semana(f)}
    ${lineaTiempo(f)}
    ${pendientes()}
    ${stats(f)}
    <p class="pie">${esc(FRASES[semilla(f) % FRASES.length])}</p>`;

  v.onclick = ev => clic(ev, f);
}

const saludo = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; };

function olaSVG() {
  return `<svg class="ola-svg" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
    <g class="ola-1"><path d="M0 70 Q50 55 100 70 T200 70 T300 70 T400 70 T500 70 T600 70 T700 70 T800 70 V120 H0 Z" fill="#00D1FF" opacity=".12"/></g>
    <g class="ola-2"><path d="M0 82 Q50 70 100 82 T200 82 T300 82 T400 82 T500 82 T600 82 T700 82 T800 82 V120 H0 Z" fill="#00D1FF" opacity=".18"/></g>
  </svg>`;
}

function cuenta(dc, corto) {
  if (dc > 0) return `
    <section class="cuenta">
      <div class="cuenta-num"><b>${dc}</b><span>${dc === 1 ? 'día' : 'días'}</span></div>
      <div class="cuenta-txt"><p>Faltan para</p><h2>${esc(C().comp.nombre)}</h2><small>${fechaLarga(C().comp.ini)}${C().comp.lugar ? ' · ' + esc(C().comp.lugar) : ''} · piscina de ${C().comp.piscina} m</small></div>
    </section>`;
  if (faseDe(hoy()) === 'competencia') return `<section class="cuenta comp"><div class="cuenta-num">${ico('trofeo')}</div><div class="cuenta-txt"><p>Hoy es día de</p><h2>${esc(C().comp.nombre)}</h2><small>¡A nadar! Confía en todo lo que entrenaste.</small></div></section>`;
  return '';
}

// "¿Ayer no pudiste ir?"
function avisoAyer(f) {
  const ayer = sumar(f, -1);
  if (ayer < C().inicio || !sesionPerdida(ayer) || leerDia(f).planB || leerDia(f).ayerVisto) return '';
  const d = deFecha(f);
  if (['gym', 'precomp', 'competencia', 'descanso'].includes(d.tipo)) return '';
  return `<section class="card ayer">
    <p class="eyebrow">${ico('corazon')} Ayer</p>
    <h3>¿Ayer no pudiste ir? Tranquilo, hagamos algo corto hoy en casa.</h3>
    <div class="fila-2">
      <button class="btn-sec" data-a="ayer-no">Sí fui, se me olvidó marcar</button>
      <button class="btn-pri chico" data-a="ayer-si">Plan B en casa</button>
    </div>
  </section>`;
}

function tarjetaFaseEspecial(f, d) {
  if (!['descarga', 'puesta'].includes(d.fase) || S().vistos?.[`fase-${d.fase}-${C().comp.ini}`]) return '';
  const fa = FASES[d.fase];
  return `<section class="card especial" style="--c:${fa.c}">
    <p class="eyebrow">Empieza una fase nueva</p>
    <h3>${fa.n}</h3>
    <p>${fa.txt}</p>
    <p class="peq">Esta semana suma más movilidad y estiramientos: la movilidad corta todos los días te va a caer muy bien.</p>
    <button class="btn-sec" data-a="fase-ok">Entendido</button>
  </section>`;
}

// ── Lo que toca hoy ──────────────────────────────────────────
function heroDia(f, d, l) {
  const fa = FASES[d.fase];
  const sem = semanaDe(f);
  const chipsFase = d.fase && !['antes', 'despues', 'competencia'].includes(d.fase)
    ? `<span class="tag" style="--c:${fa.c}">${fa.n}</span><span class="tag neutro">Semana ${sem.n} de ${sem.total}</span>` : '';

  // Plan B del día
  if (l.planB) {
    const r = RUTINAS[l.planB.clave];
    const rec = leerRegistro(f, l.planB.clave);
    const hecho = rec?.completa;
    return `<section class="hero casa" style="--hc:${r.c}">
      <p class="eyebrow">${ico('casa')} Plan B en casa</p>
      <h2>${esc(r.n)}</h2>
      <p class="hero-sub">${esc(r.sub)}</p>
      ${hecho ? `<div class="hecho">${ico('check')}¡Día salvado!</div>` : `<button class="btn-pri" data-a="ir" data-c="${l.planB.clave}" data-p="${l.planB.para}">${ico('play')}${rec ? 'Seguir' : 'Empezar'} Plan B</button>`}
      ${!hecho ? '<button class="link" data-a="planb-quitar">Mejor no, hoy descanso</button>' : ''}
    </section>`;
  }
  if (l.descansoTotal) {
    return `<section class="hero reposo">
      <div class="reposo-ico">${ico('corazon')}</div>
      <h2>Hoy toca recuperarte</h2>
      <p class="hero-sub">Descanso total. Avísale a tu entrenador. Si el dolor no es fuerte, puedes hacer solo la respiración y la movilidad suave.</p>
      <button class="btn-sec" data-a="ir" data-c="recuperacion">${ico('luna')}Respiración y movilidad suave</button>
    </section>`;
  }

  if (d.tipo === 'gym') {
    const ses = sesionDe(d.letra, f, { ligera: !!l.ligera, dolor: l.chequeo?.dolor || [] });
    const rec = leerRegistro(f, d.letra);
    const p = progreso(ses, rec);
    const mover = !rec?.completa && opcionMover(f);
    const agua = C().agua.includes(diaDe(f));
    return `<section class="hero" style="--hc:${ses.c}">
      <div class="hero-fila">
        <div class="hero-txt">
          <p class="eyebrow">Sesión ${d.letra}${d.corta ? ' corta' : ''} · gimnasio</p>
          <h2>${esc(ses.n)}</h2>
          <p class="hero-sub">${esc(ses.sub)}</p>
        </div>
        <div class="hero-letra" style="--p:${p.frac}">${l.completa ? ico('check') : d.letra}</div>
      </div>
      <div class="chips">${chipsFase}<span class="tag neutro">${ico('reloj')}~${ses.min} min</span><span class="tag neutro">${ico('salto')}Tope ${ses.tope} saltos</span></div>
      <div class="bloques-mini">${ses.bloques.map(b => `<span style="--c:${b.c}">${b.n}</span>`).join('')}</div>
      ${rec && !l.completa ? `<div class="prog"><span style="transform:scaleX(${p.frac})"></span></div><p class="peq txt2">${p.ok} de ${p.tot} series</p>` : ''}
      ${l.completa
        ? `<div class="hecho">${ico('check')}¡Sesión hecha! RPE ${l.rpe}</div>`
        : `<button class="btn-pri" data-a="ir" data-c="${d.letra}">${ico('play')}${rec ? 'Seguir sesión' : 'Empezar sesión'}</button>
           <div class="fila-2">
             ${mover ? `<button class="btn-sec" data-a="mover">${ico('mover')}Mover sesión</button>` : ''}
             <button class="btn-sec ${mover ? '' : 'ancho'}" data-a="falto">Hoy no puedo ir</button>
           </div>`}
      ${agua ? `<p class="tip">${ico('piscina')}<span>Hoy también nadas: mejor haz el seco <b>después de nadar</b>, o con 4-6 horas de diferencia.</span></p>` : ''}
    </section>
    ${botonPiscina(f)}`;
  }

  if (d.tipo === 'descanso') return `<section class="hero reposo">
      <div class="reposo-ico">${ico('luna')}</div>
      <p class="eyebrow">Domingo</p>
      <h2>Descanso total</h2>
      <p class="hero-sub">Hoy no se entrena. Duerme bien, come rico y recarga para la semana.</p>
    </section>`;

  if (d.tipo === 'precomp') {
    const r = RUTINAS.precomp, rec = leerRegistro(f, 'precomp');
    const quien = d.otra ? d.otra.nombre : C().comp.nombre;
    return `<section class="hero" style="--hc:${r.c}">
      <p class="eyebrow">${ico('trofeo')} Se acerca ${esc(quien)}</p>
      <h2>${r.n}</h2>
      <p class="hero-sub">${r.sub}</p>
      ${rec?.completa ? `<div class="hecho">${ico('check')}¡Lista! Ahora a descansar.</div>` : `<button class="btn-pri" data-a="ir" data-c="precomp">${ico('play')}Empezar</button>`}
    </section>${botonPiscina(f)}`;
  }

  if (d.tipo === 'competencia') {
    const a = leerRegistro(f, 'competencia'), b = leerRegistro(f, 'noche');
    return `<section class="hero" style="--hc:#FFD166">
      <p class="eyebrow">${ico('trofeo')} Día de competencia</p>
      <h2>${RUTINAS.competencia.n}</h2>
      <p class="hero-sub">${RUTINAS.competencia.sub}</p>
      ${a?.completa ? `<div class="hecho">${ico('check')}Calentamiento hecho</div>` : `<button class="btn-pri" data-a="ir" data-c="competencia">${ico('play')}Calentar</button>`}
    </section>
    <section class="card">
      <div class="card-cab"><h3>${RUTINAS.noche.n}</h3>${b?.completa ? ico('check') : ''}</div>
      <p class="txt2 peq">${RUTINAS.noche.sub}</p>
      ${b?.completa ? '' : `<button class="btn-sec" data-a="ir" data-c="noche">${ico('luna')}Empezar en la noche</button>`}
    </section>`;
  }

  // Movilidad (días sin gimnasio)
  const r = RUTINAS.movilidad, rec = leerRegistro(f, 'movilidad');
  const movida = d.movida ? `<p class="tip">${ico('mover')}<span>Moviste la sesión de hoy al <b>${fechaDia(d.movida)}</b>.</span></p>` : '';
  return `<section class="hero" style="--hc:${r.c}">
    <p class="eyebrow">${d.fase === 'antes' ? 'Antes del plan' : 'Día sin gimnasio'} · opcional</p>
    <h2>${r.n}</h2>
    <p class="hero-sub">${r.sub}</p>
    ${chipsFase ? `<div class="chips">${chipsFase}</div>` : ''}
    ${d.nota ? `<p class="tip">${ico('info')}<span>${esc(d.nota)}</span></p>` : ''}
    ${movida}
    ${rec?.completa ? `<div class="hecho">${ico('check')}Movilidad hecha</div>` : `<button class="btn-pri" data-a="ir" data-c="movilidad">${ico('play')}${rec ? 'Seguir' : 'Empezar'} movilidad</button>`}
  </section>
  ${botonPiscina(f)}`;
}

function botonPiscina(f) {
  const l = leerDia(f);
  if (!C().agua.includes(diaDe(f)) || l.planB || l.faltoAgua) return '';
  return `<button class="btn-sec piscina" data-a="falto-agua">${ico('piscina')}Hoy no fui a la piscina</button>`;
}

// ── Semana ───────────────────────────────────────────────────
function semana(f) {
  const lun = lunesDe(f);
  const dias = Array.from({ length: 7 }, (_, i) => sumar(lun, i));
  return `<section class="card">
    <div class="card-cab"><h3>Esta semana</h3><span class="cont">${fechaCorta(lun)} – ${fechaCorta(sumar(lun, 6))}</span></div>
    <div class="semana">${dias.map(x => {
      const d = deFecha(x), l = leerDia(x);
      const hecho = l.completa || l.salvado || leerRegistro(x, 'movilidad')?.completa || leerRegistro(x, 'precomp')?.completa;
      const letra = d.tipo === 'gym' ? d.letra : d.tipo === 'descanso' ? '–' : d.tipo === 'precomp' ? '★' : d.tipo === 'competencia' ? '🏁' : '·';
      const col = d.tipo === 'gym' ? SESIONES[d.letra].c : 'var(--txt2)';
      const perdido = x < f && d.tipo === 'gym' && !l.completa;
      return `<div class="sd ${x === f ? 'hoy' : ''} ${hecho ? 'hecho' : ''} ${perdido ? (l.salvado ? "salvado" : "perdido") : ""} t-${d.tipo}" style="--c:${col}">
        <span>${INICIAL[diaDe(x)]}</span><b>${hecho && d.tipo === 'gym' ? '✓' : letra}</b>${C().agua.includes(diaDe(x)) ? '<i title="Agua"></i>' : ''}
      </div>`;
    }).join('')}</div>
    <div class="leyenda"><span><i style="background:#00D1FF"></i>A piernas</span><span><i style="background:#7C9CFF"></i>B tren superior</span><span><i style="background:#1DE9B6"></i>C total</span><span><i class="agua"></i>agua</span></div>
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

function pendientes() {
  const p = pendientesRevision();
  if (!p.length) return '';
  return `<section class="card revisar">
    <div class="card-cab"><h3>${ico('mano')} Técnica por revisar</h3><span class="cont">${p.length} pendientes</span></div>
    <p class="peq txt2">Estos ejercicios te los tiene que ver alguien la primera semana. Toca uno para pedir ayuda.</p>
    <div class="mini-chips">${p.map(e => `<button data-a="ayuda" data-e="${e}">${esc(EJ[e].n)}</button>`).join('')}</div>
    <button class="btn-sec" data-a="primer-dia">${ico('mano')}Primer día en el gimnasio</button>
  </section>`;
}

function stats(f) {
  return `<div class="stats">
    <div class="stat racha">${ico('fuego')}<b>${racha(f)}</b><span>sesiones seguidas</span></div>
    <div class="stat salvados">${ico('corazon')}<b>${diasSalvados()}</b><span>días salvados con el Plan B</span></div>
  </div>`;
}

// ── Acciones ─────────────────────────────────────────────────
function clic(ev, f) {
  const b = ev.target.closest('[data-a]');
  if (!b) return;
  const refrescar = () => dispatchEvent(new Event('fs:refrescar'));
  switch (b.dataset.a) {
    case 'ir': abrirSesion(b.dataset.c, f, b.dataset.p || ''); break;
    case 'instalar': instalar(); break;
    case 'mover': hojaMover(f); break;
    case 'falto': faltoGym(f); break;
    case 'falto-agua': motivo(f, 'agua', f); break;
    case 'ayer-si': dia(sumar(f, -1)).falto = true; guardar(); motivo(f, 'gym', sumar(f, -1)); break;
    case 'ayer-no': dia(f).ayerVisto = true; guardar(); refrescar(); break;
    case 'fase-ok': (S().vistos ||= {})[`fase-${faseDe(f)}-${C().comp.ini}`] = true; guardar(); refrescar(); break;
    case 'planb-quitar': { const d = dia(f); delete d.planB; guardar(); refrescar(); break; }
    case 'ayuda': hojaAyuda(b.dataset.e); break;
    case 'primer-dia': location.hash = 'guia/primer-dia'; break;
  }
}

function hojaMover(f, desdeFalto = false) {
  const op = opcionMover(f);
  if (!op) return false;
  const txt = op.movs.map(m => `<li><b>${NOMBRE_DIA[diaDe(m.de)]}</b> → <b>${NOMBRE_DIA[diaDe(m.a)]} ${fechaCorta(m.a)}</b> <span class="txt2">(sesión ${deFecha(m.de).letra})</span></li>`).join('');
  const h = abrirHoja(`
    <p class="eyebrow">${ico('mover')} Mover sesión</p>
    <h2 class="hoja-t">${desdeFalto ? 'Antes de saltártela: ¿la movemos?' : 'Mover sesión'}</h2>
    <p class="hoja-sub">${op.tipo === 'uno' ? 'Hay un día libre esta semana sin quedar pegada a otra sesión.' : 'Para no hacer dos sesiones seguidas, se corre un día todo lo que queda de la semana.'}</p>
    <ul class="movs">${txt}</ul>
    <p class="peq txt2">Nunca dos sesiones de gimnasio seguidas, ni más de 3 por semana.</p>
    <button class="btn-pri" data-m="si">${ico('check')}Mover</button>
    ${desdeFalto ? '<button class="btn-sec" data-m="no">No, igual no puedo esta semana</button>' : ''}`);
  h.onclick = e => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    if (b.dataset.m === 'si') {
      S().movs.push(...op.movs);
      dia(f).movida = op.movs[0].a;
      guardar(); cerrarHoja(); vibrar();
      aviso(`Sesión movida al ${fechaDia(op.movs[0].a)}`, 'mover');
      dispatchEvent(new Event('fs:refrescar'));
    } else { cerrarHoja(); setTimeout(() => motivo(f, 'gym', f, true), 320); }
  };
  return true;
}

function faltoGym(f) {
  if (!hojaMover(f, true)) motivo(f, 'gym', f);
}

// ¿Por qué faltaste? → rutina de Plan B. Sin regaños.
function motivo(f, que, para) {
  const h = abrirHoja(`
    <p class="eyebrow">${ico('corazon')} Plan B</p>
    <h2 class="hoja-t">Tranquilo, pasa. ¿Qué pasó?</h2>
    <p class="hoja-sub">Según la respuesta te propongo algo corto para no perder lo que llevas trabajado.</p>
    <div class="opciones">
      <button class="opcion" data-m="cansado"><b>😮‍💨 Muy cansado</b><span>Hoy no me da el cuerpo</span></button>
      <button class="opcion" data-m="tiempo"><b>⏰ Sin tiempo o sin ganas</b><span>Pero puedo hacer algo corto en casa</span></button>
      <button class="opcion" data-m="enfermo"><b>🤒 Enfermo o con dolor</b><span>Algo no está bien</span></button>
    </div>`);
  h.onclick = e => {
    const b = e.target.closest('[data-m]');
    if (!b) return;
    const m = b.dataset.m;
    const d = dia(f);
    if (que === 'gym') dia(para).falto = true; else d.faltoAgua = true;
    d.motivo = m; dia(para).motivo = m;
    if (m === 'enfermo') { d.descansoTotal = true; delete d.planB; }
    else {
      const enPuesta = faseDe(f) === 'puesta';
      const clave = m === 'cansado' || enPuesta ? 'recuperacion' : que === 'gym' ? 'forma' : 'agua';
      d.planB = { clave, para, que };
    }
    guardar(); cerrarHoja();
    dispatchEvent(new Event('fs:refrescar'));
  };
}
