// Sesión por bloques: tarjetas de ejercicio, burbujas por serie, descansos, saltos,
// pesos guiados, cambiar ejercicio, pedir ayuda, chequeo previo y RPE al final.
import { EJ, FASES, RPE, REGLAS_PARAR } from './data.js';
import { S, C, guardar, dia, leerDia } from './store.js';
import { sesionDe, deFecha, contactos } from './plan.js';
import * as W from './pesos.js';
import { cuerpo } from './cuerpo.js';
import { iniciarDescanso, iniciarTrabajo, cerrarDescanso } from './timer.js';
import { $, $$, ico, esc, num, chipTransfer, abrirHoja, cerrarHoja, aviso, vibrar, sonar, burbujas, confeti, pantallaEncendida } from './util.js';
import { fechaLarga, hoy } from './fechas.js';

let ctx = null; // { clave, f, para, ses, rec, vista }

const LADO = { lado: 'por lado', pierna: 'por pierna', brazo: 'por brazo', pie: 'por pie' };
const segTxt = it => Array.isArray(it.seg) ? `${it.seg[0]}-${it.seg[1]} s` : it.seg >= 120 ? `${it.seg / 60} min` : `${it.seg} s`;
export const prescripcion = it => `${it.s} × ${it.seg ? segTxt(it) : (it.rTxt || it.r)}${it.lado ? ' ' + LADO[it.lado] : ''}`;
const segDe = it => Array.isArray(it.seg) ? it.seg[0] : it.seg;

// Registro de la rutina dentro del día
const registro = (f, clave) => ((dia(f).r ||= {})[clave] ||= { hechas: {}, pesos: {}, saltos: 0 });
export const leerRegistro = (f, clave) => leerDia(f).r?.[clave] || null;

export function progreso(ses, rec) {
  let tot = 0, ok = 0;
  for (const bl of ses.bloques) for (const it of bl.items) {
    tot += it.s;
    ok += (rec?.hechas[it.slot] || []).slice(0, it.s).filter(Boolean).length;
  }
  return { tot, ok, frac: tot ? ok / tot : 0 };
}

// ── Pantalla ─────────────────────────────────────────────────
export function renderSesion(vista, clave, f, para) {
  const l = leerDia(f);
  const ses = sesionDe(clave, f, { ligera: !!l.ligera, dolor: l.chequeo?.dolor || [] });
  const rec = registro(f, clave);
  if (!rec.inicio) { rec.inicio = Date.now(); guardar(); }
  ctx = { clave, f, para, ses, rec, vista };
  document.body.classList.add('sin-tabs');
  pantallaEncendida(true);

  const fase = FASES[ses.fase] || {};
  let n = 0;
  vista.innerHTML = `
    <header class="ses-cab" style="--c:${ses.c}">
      <div class="ses-top">
        <button class="redondo" data-a="salir" aria-label="Volver a Hoy">${ico('atras')}</button>
        <div class="ses-tit">
          <p class="eyebrow">${esc(ses.titulo)}${ses.casa ? ` · ${ico('casa', 'mini-ico')} en casa` : ''}</p>
          <h1>${esc(ses.n)}</h1>
        </div>
        <button class="redondo alto" data-a="parar" aria-label="Reglas para parar">${ico('alto')}</button>
      </div>
      <div class="ses-chips">
        ${ses.fase && fase.n ? `<span class="tag" style="--c:${fase.c}">${fase.n}</span>` : ''}
        <span class="tag neutro">${ico('reloj')}~${ses.min} min</span>
        ${ses.rpe ? `<span class="tag neutro">RPE ${ses.rpe}</span>` : ''}
        ${ses.ligera ? '<span class="tag" style="--c:#FFD166">Versión ligera</span>' : ''}
      </div>
      <div class="ses-prog"><span id="ses-barra"></span></div>
      <div class="ses-cont"><span id="ses-series"></span>${ses.tope ? `<span id="ses-saltos" class="saltos">${ico('salto')}<b></b></span>` : ''}</div>
    </header>

    <button class="parar-tira" data-a="parar">${ico('alto')}<span><b>Para si:</b> dolor agudo en rodilla, hombro o espalda baja, mareo o técnica rota.</span></button>
    ${ses.aviso ? `<div class="nota coral">${ico('info')}<span>${esc(ses.aviso)}</span></div>` : ''}
    ${ses.ligera ? `<div class="nota">${ico('luna')}<span>Versión ligera: una serie menos en todo y sin saltos al cajón. El peso va un escalón más abajo.</span></div>` : ''}

    ${ses.bloques.map(bl => `
      <section class="bloque" style="--c:${bl.c}">
        <div class="carril"><span>${esc(bl.n)}</span>${bl.rondas ? `<small>${bl.rondas} rondas · ${bl.descansoRonda} s entre rondas</small>` : ''}</div>
        ${bl.b === 'potencia' ? `<p class="bloque-nota">${ico('reloj')}Descanso completo: la velocidad importa más que el cansancio.</p>` : ''}
        <div class="lista-ej">${bl.items.map(it => tarjeta(it, bl, ++n)).join('')}</div>
      </section>`).join('')}

    ${ses.final ? `<div class="nota agua">${ico('luna')}<span>${esc(ses.final)}</span></div>` : ''}
    <button class="btn-pri" data-a="terminar">${ico('bandera')}Terminar sesión</button>
    <p class="pie">${fechaLarga(f)}</p>`;

  vista.onclick = clic;
  pintarCab();
}

function tarjeta(it, bl, n) {
  const e = EJ[it.e];
  const hechas = ctx.rec.hechas[it.slot] || [];
  const completa = hechas.slice(0, it.s).filter(Boolean).length >= it.s;
  const revisar = e.tec && !S().revisado[it.e];
  const descanso = bl.rondas ? '' : it.d ? ` · descanso ${it.d >= 60 && it.d % 60 === 0 ? it.d / 60 + ' min' : it.d + ' s'}` : '';
  return `
  <article class="ej ${completa ? 'completa' : ''}" data-slot="${it.slot}" data-n="${n}" style="--c:${bl.c}">
    <button class="ej-cab" data-a="abrir" aria-expanded="false">
      <span class="ej-num">${completa ? ico('check') : n}</span>
      <span class="ej-tit">
        <span class="ej-n">${esc(e.n)}</span>
        <span class="ej-meta"><b>${prescripcion(it)}</b>${descanso}</span>
      </span>
      <span class="ej-chev">${ico('abajo')}</span>
    </button>
    <div class="ej-tags">
      ${e.tr.map(chipTransfer).join('')}
      ${revisar ? `<span class="tag coral">${ico('mano')}Primera vez: pide que te revisen</span>` : ''}
      ${ctx.ses.casa && e.casa ? `<span class="tag neutro">${ico('casa')}${esc(e.casa)}</span>` : ''}
      ${it.cambiado ? `<span class="tag neutro">${ico('cambiar')}En vez de ${esc(EJ[it.orig.e].n)}</span>` : ''}
    </div>
    <p class="ej-para">${esc(e.para)}</p>
    ${bloquePeso(it)}
    <div class="series">${Array.from({ length: it.s }, (_, k) => burbuja(it, k, hechas[k])).join('')}</div>
    <div class="ej-acc">
      ${it.alts.length ? `<button class="btn-chip" data-a="cambiar">${ico('cambiar')}Cambiar ejercicio</button>` : ''}
      ${e.check ? `<button class="btn-chip" data-a="ayuda">${ico('mano')}Pedir ayuda</button>` : ''}
    </div>
    <div class="mas"><div class="mas-in">
      <h4>Cómo hacerlo</h4>
      <ol class="pasos">${e.como.map(p => `<li>${esc(p)}</li>`).join('')}</ol>
      <div class="error"><span>${ico('cerrar')}</span><p><b>Error común:</b> ${esc(e.error)}</p></div>
      ${e.z.length ? `<div class="mapa">${cuerpo(e.z, e.s)}</div>` : ''}
    </div></div>
  </article>`;
}

function burbuja(it, k, hecha) {
  const etiqueta = it.seg ? `${segDe(it)}″` : (it.rTxt || it.r);
  const nombre = ctx.ses.bloques.find(b => b.items.includes(it))?.rondas ? `Ronda ${k + 1}` : `Serie ${k + 1}`;
  return `<button class="serie ${hecha ? 'hecha' : ''}" data-a="serie" data-k="${k}" aria-pressed="${!!hecha}" aria-label="${nombre}">
    <span class="serie-n">${etiqueta}</span>${ico('check', 'serie-ok')}
  </button>`;
}

// ── Pesos guiados en la tarjeta ──────────────────────────────
function bloquePeso(it) {
  const e = it.e, p = W.info(e);
  if (!p) return EJ[e].salto ? `<div class="pesos-chips"><span class="chip-p">${ico('salto')}Siempre sin peso este ciclo</span></div>` : '';
  if (!W.conPeso(e)) {
    const t = W.textoFijo(e);
    return t ? `<div class="pesos-chips"><span class="chip-p">Empieza con: <b>${esc(t.ini)}</b></span><span class="chip-p tope">${ico('candado')}Tope: <b>${esc(t.tope)}</b></span></div>` : '';
  }
  const f = ctx.f;
  const tope = W.tope(e, f);
  if (tope === 0) return `<div class="pesos-chips"><span class="chip-p">Peso corporal</span>${p.nota ? `<span class="chip-p tope">${ico('candado')}${esc(p.nota)}</span>` : ''}</div>`;
  const ini = W.inicial(e);
  const v = ctx.rec.pesos[it.slot] ?? W.sugerido(e, f, { ligera: ctx.ses.ligera });
  const primera = !S().pesos[e] && v > 0;
  const sube = !primera && W.subida(e, f);
  const prueba = ctx.rec.prueba?.[e] || 0;
  return `
  <div class="peso-caja" data-e="${e}">
    <div class="pesos-chips">
      <span class="chip-p">Empieza con: <b>${W.texto(e, ini)}</b></span>
      <span class="chip-p tope">${ico('candado')}Tope: <b>${W.texto(e, tope)}</b></span>
    </div>
    ${p.nota ? `<p class="peq txt2">${esc(p.nota)}</p>` : ''}
    ${primera ? `
      <div class="prueba">
        <p class="prueba-t">${ico('info')}Primera vez: serie de prueba</p>
        <button class="prueba-paso ${prueba >= 1 ? 'on' : ''}" data-a="calentar"><span class="hab-c">${ico('check')}</span>
          <span>Calentamiento con <b>${W.texto(e, W.paso(e, v / 2 + 0.01, -1) || W.lista(e)[0])}</b>: 8 repeticiones lentas</span></button>
        <p class="peq txt2">Después haz tu primera serie con el peso de abajo. Al marcarla te pregunto cómo se sintió.</p>
      </div>` : ''}
    ${sube ? `<button class="sube" data-a="subir" data-v="${sube}">${ico('trofeo')}<span>La sesión pasada te salió perfecta. Hoy puedes probar <b>${W.texto(e, sube)}</b></span></button>` : ''}
    <div class="peso">
      <button class="peso-btn" data-a="peso" data-d="-1" aria-label="Menos peso">${ico('menos')}</button>
      <div class="peso-val ${v >= tope ? 'en-tope' : ''}"><b>${v ? num(v) : '0'}</b><span>${v ? W.unidad(e) : 'corporal'}${p.eq === 'mano' && v ? ' c/mano' : ''}</span>${v >= tope ? ico('candado') : ''}</div>
      <button class="peso-btn" data-a="peso" data-d="1" aria-label="Más peso">${ico('mas')}</button>
    </div>
    <p class="peso-otro">${v ? W.texto(e, v) : 'Sin peso'}</p>
    ${p.eq === 'barra' && v ? discosSVG(e, v) : ''}
  </div>`;
}

function discosSVG(e, total) {
  const d = W.discos(e, total);
  const col = { 20: '#FF6B6B', 45: '#FF6B6B', 10: '#7C9CFF', 25: '#7C9CFF', 5: '#1DE9B6', 2.5: '#FFD166', 1.25: '#8FB3D9' };
  const alto = x => ({ 20: 72, 45: 72, 25: 62, 10: 56, 5: 44, 2.5: 34, 1.25: 28 }[x] || 30);
  const placa = (x, p) => { const h = alto(p); return `<rect x="${x}" y="${50 - h / 2}" width="12" height="${h}" rx="3" fill="${col[p]}"/>`; };
  const der = d.lado.map((p, i) => placa(196 + i * 14, p)).join('');
  const izq = d.lado.map((p, i) => placa(92 - i * 14, p)).join('');
  const txt = d.lado.length ? `${d.lado.map(num).join(' + ')} ${d.u} por lado` : 'sin discos';
  return `<div class="discos">
    <svg viewBox="0 0 300 100" aria-hidden="true">
      <rect x="16" y="46" width="268" height="8" rx="4" fill="#8FB3D9"/>
      <rect x="104" y="40" width="6" height="20" rx="2" fill="#F2F8FF"/><rect x="190" y="40" width="6" height="20" rx="2" fill="#F2F8FF"/>
      ${izq}${der}
    </svg>
    <p><b>${d.tipo} (${num(d.barra)} ${d.u})</b> + ${txt} = <b>${num(total)} ${d.u}</b></p>
  </div>`;
}

function cambiarPeso(slot, dir) {
  const it = item(slot), e = it.e;
  const tope = W.tope(e, ctx.f);
  const v = ctx.rec.pesos[slot] ?? W.sugerido(e, ctx.f, { ligera: ctx.ses.ligera });
  let n = W.paso(e, v, dir);
  // Máximo un escalón por semana: sobre el peso de trabajo solo se sube si la app lo sugiere
  const base = W.trabajo(e) ?? W.inicial(e);
  const permitido = Math.min(tope, ctx.rec.subio?.[e] || W.subida(e, ctx.f) ? W.paso(e, base, 1) : base);
  if (dir > 0 && n > permitido && n <= tope) {
    vibrar([40, 60, 40]);
    abrirHoja(`<div class="candado-grande">${ico('candado')}</div>
      <h2 class="hoja-t centro">Máximo un escalón por semana</h2>
      <p class="hoja-sub centro">Se sube solo si la sesión pasada te salió completa, con técnica limpia y RPE de 7 o menos. Cuando toque, te aviso aquí mismo.</p>
      <button class="btn-pri" data-cerrar-hoja>Entendido</button>`).querySelector('[data-cerrar-hoja]').onclick = cerrarHoja;
    return;
  }
  if (dir > 0 && n > tope) {
    vibrar([40, 60, 40]);
    abrirHoja(`<div class="candado-grande">${ico('candado')}</div>
      <h2 class="hoja-t centro">Este es tu tope de este ciclo</h2>
      <p class="hoja-sub centro">Más peso no te va a hacer nadar más rápido; la velocidad y la técnica sí.</p>
      <button class="btn-pri" data-cerrar-hoja>Entendido</button>`).querySelector('[data-cerrar-hoja]').onclick = cerrarHoja;
    return;
  }
  ctx.rec.pesos[slot] = n; guardar();
  vibrar();
  repintarTarjeta(slot);
}

// ── Clics ────────────────────────────────────────────────────
const item = slot => ctx.ses.bloques.flatMap(b => b.items).find(i => i.slot === slot);
const bloqueDe = slot => ctx.ses.bloques.find(b => b.items.some(i => i.slot === slot));

function clic(ev) {
  const b = ev.target.closest('[data-a]');
  if (!b) return;
  const card = b.closest('.ej');
  const slot = card?.dataset.slot;
  switch (b.dataset.a) {
    case 'salir': location.hash = 'hoy'; break;
    case 'parar': hojaParar(); break;
    case 'abrir': {
      const ab = card.classList.toggle('abierta');
      b.setAttribute('aria-expanded', ab);
      break;
    }
    case 'serie': tocarSerie(slot, Number(b.dataset.k), b); break;
    case 'peso': cambiarPeso(slot, Number(b.dataset.d)); break;
    case 'subir': ctx.rec.pesos[slot] = Number(b.dataset.v); ctx.rec.subio = { ...(ctx.rec.subio || {}), [item(slot).e]: true }; guardar(); repintarTarjeta(slot); aviso('¡Vamos con ese escalón!', 'trofeo'); break;
    case 'calentar': {
      const e = item(slot).e;
      ctx.rec.prueba = { ...(ctx.rec.prueba || {}), [e]: ctx.rec.prueba?.[e] >= 1 ? 0 : 1 };
      guardar(); vibrar(); repintarTarjeta(slot);
      break;
    }
    case 'cambiar': hojaCambiar(slot); break;
    case 'ayuda': hojaAyuda(item(slot).e); break;
    case 'terminar': terminar(); break;
  }
}

function tocarSerie(slot, k, btn) {
  const it = item(slot), bl = bloqueDe(slot), e = EJ[it.e];
  const h = (ctx.rec.hechas[slot] ||= []);
  if (h[k]) { // deshacer
    h[k] = false;
    ctx.rec.saltos = Math.max(0, ctx.rec.saltos - contactos(it));
    guardar(); repintarTarjeta(slot); pintarCab();
    return;
  }
  const c = contactos(it);
  if (c && ctx.ses.tope && ctx.rec.saltos + c > ctx.ses.tope) {
    vibrar([40, 60, 40]);
    aviso(`Tope de saltos de hoy (${ctx.ses.tope}). Así se cuidan las rodillas: sigue con lo próximo.`, 'salto', 4200);
    return;
  }
  if (it.seg) {
    const s = segDe(it);
    const tramos = [{ tipo: 'prep', s: 3 }];
    if (it.lado) tramos.push({ tipo: 'trabajo', s, txt: 'Primer lado' }, { tipo: 'cambio', s: 5 }, { tipo: 'trabajo', s, txt: 'Segundo lado' });
    else tramos.push({ tipo: 'trabajo', s });
    cerrarDescanso();
    iniciarTrabajo(`${e.n} · ${bl.rondas ? 'Ronda' : 'Serie'} ${k + 1}`, tramos, ok => { if (ok) marcar(slot, k); });
    return;
  }
  marcar(slot, k);
}

function marcar(slot, k) {
  const it = item(slot), bl = bloqueDe(slot), e = EJ[it.e];
  const h = (ctx.rec.hechas[slot] ||= []);
  h[k] = true;
  ctx.rec.saltos += contactos(it);
  if (W.conPeso(it.e) && ctx.rec.pesos[slot] === undefined) ctx.rec.pesos[slot] = W.sugerido(it.e, ctx.f, { ligera: ctx.ses.ligera });
  guardar();
  sonar.serie(); vibrar(25);
  repintarTarjeta(slot);
  const nb = $(`.ej[data-slot="${slot}"] .serie[data-k="${k}"]`, ctx.vista);
  nb?.classList.add('pop'); burbujas(nb);
  pintarCab();

  const p = progreso(ctx.ses, ctx.rec);
  const primera = W.conPeso(it.e) && ctx.rec.pesos[slot] > 0 && !S().pesos[it.e];
  if (primera && k === 0) return hojaPrueba(slot);
  if (p.ok >= p.tot) return setTimeout(terminar, 500);

  // Descanso: en circuito solo al terminar la ronda; en el resto, después de cada serie
  if (bl.rondas) {
    const ultimo = bl.items[bl.items.length - 1];
    if (ultimo.slot === slot && k < bl.rondas - 1) iniciarDescanso(bl.descansoRonda, `Fin de la ronda ${k + 1}`, 'Respira y vuelve a empezar el circuito.');
  } else if (it.d) {
    const fin = h.slice(0, it.s).filter(Boolean).length >= it.s;
    iniciarDescanso(it.d, fin ? `Listo: ${e.n}` : `${e.n} · serie ${k + 2} de ${it.s}`,
      bl.b === 'potencia' ? 'Descanso completo: la velocidad importa más que el cansancio.' : '');
  }
  if (h.slice(0, it.s).filter(Boolean).length >= it.s) {
    const card = $(`.ej[data-slot="${slot}"]`, ctx.vista);
    card?.classList.remove('abierta');
  }
}

function repintarTarjeta(slot) {
  const card = $(`.ej[data-slot="${slot}"]`, ctx.vista);
  if (!card) return;
  const it = item(slot), bl = bloqueDe(slot);
  const abierta = card.classList.contains('abierta');
  const tmp = document.createElement('div');
  tmp.innerHTML = tarjeta(it, bl, Number(card.dataset.n));
  const nueva = tmp.firstElementChild;
  if (abierta) { nueva.classList.add('abierta'); nueva.querySelector('.ej-cab').setAttribute('aria-expanded', 'true'); }
  card.replaceWith(nueva);
}

function pintarCab() {
  const p = progreso(ctx.ses, ctx.rec);
  $('#ses-barra').style.transform = `scaleX(${p.frac})`;
  $('#ses-series').textContent = `${p.ok} de ${p.tot} series`;
  const s = $('#ses-saltos');
  if (s) {
    s.querySelector('b').textContent = `Saltos ${ctx.rec.saltos} / ${ctx.ses.tope}`;
    s.classList.toggle('lleno', ctx.rec.saltos >= ctx.ses.tope);
  }
}

// ── Serie de prueba ──────────────────────────────────────────
function hojaPrueba(slot) {
  const it = item(slot), e = it.e;
  const v = ctx.rec.pesos[slot];
  const h = abrirHoja(`
    <p class="eyebrow">${esc(EJ[e].n)}</p>
    <h2 class="hoja-t">¿Cómo se sintió con ${W.texto(e, v)}?</h2>
    <p class="hoja-sub">Sé sincero: es mejor quedarse corto que pasarse.</p>
    <div class="opciones">
      <button class="opcion" data-r="1"><b>😎 Muy fácil</b><span>Me sobraban 5 o más repeticiones</span></button>
      <button class="opcion" data-r="0"><b>👌 Bien</b><span>Me sobraban 2-3 y la técnica se veía limpia</span></button>
      <button class="opcion" data-r="-1"><b>😬 Difícil</b><span>No me sobraba nada o se dañó la técnica</span></button>
    </div>`);
  h.onclick = ev => {
    const b = ev.target.closest('[data-r]');
    if (!b) return;
    const r = Number(b.dataset.r);
    let n = v;
    if (r) n = W.paso(e, v, r);
    if (n > W.tope(e, ctx.f)) n = v;
    if (r < 0 && !n) n = W.lista(e)[0];
    ctx.rec.pesos[slot] = n;
    W.guardarTrabajo(e, n, ctx.f);
    guardar();
    cerrarHoja();
    repintarTarjeta(slot);
    aviso(r === 0 ? `¡Perfecto! ${W.texto(e, n)} es tu peso de trabajo.` : r > 0 ? `Sube a ${W.texto(e, n)} para la próxima serie.` : `Baja a ${W.texto(e, n)} para la próxima serie.`, 'check', 3600);
    const bl = bloqueDe(slot);
    if (it.d) iniciarDescanso(it.d, `${EJ[e].n} · serie 2 de ${it.s}`, bl.b === 'potencia' ? 'Descanso completo: la velocidad importa más que el cansancio.' : '');
  };
}

// ── Cambiar ejercicio ────────────────────────────────────────
function hojaCambiar(slot) {
  const it = item(slot);
  const ops = [it.orig, ...it.alts];
  let sel = it.e;
  const h = abrirHoja(`
    <h2 class="hoja-t">Cambiar ejercicio</h2>
    <p class="hoja-sub">Si la máquina está ocupada o algo no te cuadra. Mismo objetivo en el agua.</p>
    <div class="alts">${ops.map((o, i) => `
      <button class="alt ${o.e === sel ? 'sel' : ''} ${i === 0 ? 'original' : ''}" data-e="${o.e}">
        ${i === 0 ? '<span class="alt-tag">Del plan</span>' : ''}
        <span class="alt-cab"><span class="alt-n">${esc(EJ[o.e].n)}</span><span class="alt-sr">${prescripcion(o)}</span></span>
        <span class="alt-p">${esc(EJ[o.e].para)}</span>
      </button>`).join('')}</div>
    <div class="fila-2">
      <button class="btn-sec" data-u="hoy">Solo hoy</button>
      <button class="btn-pri chico" data-u="siempre">Siempre</button>
    </div>`);
  h.onclick = ev => {
    const a = ev.target.closest('.alt');
    if (a) { sel = a.dataset.e; $$('.alt', h).forEach(x => x.classList.toggle('sel', x === a)); vibrar(); return; }
    const u = ev.target.closest('[data-u]');
    if (!u) return;
    const d = dia(ctx.f);
    d.cambios ||= {};
    if (u.dataset.u === 'siempre') {
      if (sel === it.orig.e) delete S().siempre[it.orig.e]; else S().siempre[it.orig.e] = sel;
      delete d.cambios[slot];
    } else d.cambios[slot] = sel;
    // Al cambiar de ejercicio se reinician las series de ese espacio
    ctx.rec.saltos = Math.max(0, ctx.rec.saltos - (ctx.rec.hechas[slot] || []).filter(Boolean).length * contactos(it));
    delete ctx.rec.hechas[slot]; delete ctx.rec.pesos[slot];
    guardar();
    cerrarHoja();
    renderSesion(ctx.vista, ctx.clave, ctx.f, ctx.para);
    aviso(u.dataset.u === 'siempre' ? 'Cambiado para todas las sesiones' : 'Cambiado solo por hoy', 'cambiar');
  };
}

// ── Pedir ayuda al instructor ────────────────────────────────
export function hojaAyuda(e) {
  const x = EJ[e];
  const pts = x.check || [x.como[1], x.error];
  const frase = `Disculpa, ¿me puedes ver una serie de ${x.n.toLowerCase()}? Fíjate en ${minus(pts[0])} y ${minus(pts[1])}.`;
  const ok = !!S().revisado[e];
  const h = abrirHoja(`
    <p class="eyebrow">${ico('mano')} Pedir ayuda</p>
    <h2 class="hoja-t">${esc(x.n)}</h2>
    <p class="hoja-sub">Acércate al instructor del gimnasio y dile esto (o enséñale el teléfono):</p>
    <blockquote class="frase">"${esc(frase)}"</blockquote>
    <div class="fila-2">
      <button class="btn-sec" data-h="copiar">${ico('copiar')}Copiar</button>
      <button class="btn-sec" data-h="grande">${ico('ojo')}Mostrar en grande</button>
    </div>
    <h4 class="sub-t">Lo que tiene que mirar</h4>
    <div class="hab-lista">${pts.map((p, i) => `<button class="hab" data-h="check" data-i="${i}"><span class="hab-c">${ico('check')}</span>${esc(p)}</button>`).join('')}</div>
    <details class="grabate">
      <summary>${ico('camara')}¿No hay instructor? Grábate</summary>
      <ol class="pasos">
        <li>Apoya el teléfono a la altura de la cadera, de lado${['cajon', 'goblet', 'bulgara', 'sumo', 'patinador', 'copen'].includes(e) ? ' (o de frente para ver las rodillas)' : ''}.</li>
        <li>Graba una serie con la cámara del teléfono.</li>
        <li>Mírate y revisa los 3 puntos de arriba. Si alguno falla, baja el peso o pide ayuda.</li>
      </ol>
      <p class="peq txt2">La app no guarda el video: queda solo en tu galería.</p>
    </details>
    <button class="btn-pri ${ok ? 'hecho' : ''}" data-h="revisado">${ok ? `${ico('check')}Ya te revisaron la técnica` : 'Ya me revisaron la técnica ✅'}</button>`);
  h.onclick = async ev => {
    const b = ev.target.closest('[data-h]');
    if (!b) return;
    if (b.dataset.h === 'check') { b.classList.toggle('on'); vibrar(); }
    if (b.dataset.h === 'copiar') {
      try { await navigator.clipboard.writeText(frase); aviso('Frase copiada', 'copiar'); } catch { aviso('No se pudo copiar', 'info'); }
    }
    if (b.dataset.h === 'grande') mostrarGrande(frase);
    if (b.dataset.h === 'revisado') {
      if (S().revisado[e]) delete S().revisado[e]; else S().revisado[e] = hoy();
      guardar(); cerrarHoja();
      if (ctx && location.hash.startsWith('#sesion')) renderSesion(ctx.vista, ctx.clave, ctx.f, ctx.para);
      else dispatchEvent(new Event('fs:refrescar'));
      if (S().revisado[e]) { aviso('¡Bien hecho! Técnica revisada', 'check'); confeti(false); }
    }
  };
}
const minus = s => s ? s.charAt(0).toLowerCase() + s.slice(1).replace(/\.$/, '') : '';

export function mostrarGrande(texto) {
  const el = document.createElement('div');
  el.className = 'grande';
  el.innerHTML = `<p>${esc(texto)}</p><span>Toca para cerrar</span>`;
  el.onclick = () => el.remove();
  document.body.appendChild(el);
}

function hojaParar() {
  abrirHoja(`
    <div class="alto-grande">${ico('alto')}</div>
    <h2 class="hoja-t centro">Reglas para parar</h2>
    <div class="reglas-parar">${REGLAS_PARAR.map(r => `<div><b>${esc(r.t)}</b><p>${esc(r.d)}</p></div>`).join('')}</div>
    <p class="hoja-sub centro">Parar a tiempo también es entrenar bien.</p>`);
}

// ── Terminar: RPE y llegada a la pared ───────────────────────
function terminar() {
  const p = progreso(ctx.ses, ctx.rec);
  const h = abrirHoja(`
    <h2 class="hoja-t">${p.ok >= p.tot ? '¡Sesión completa!' : '¿Terminas por hoy?'}</h2>
    <p class="hoja-sub">${p.ok >= p.tot ? 'Antes de irte:' : `Llevas ${p.ok} de ${p.tot} series. Está bien terminar si la técnica ya no sale limpia.`} ¿Qué tan duro fue? (RPE)</p>
    <div class="rpe">${RPE.map(([n, t]) => `<button data-rpe="${n}" style="--h:${190 - n * 17}"><b>${n}</b><span>${t}</span></button>`).join('')}</div>`);
  h.onclick = ev => {
    const b = ev.target.closest('[data-rpe]');
    if (!b) return;
    guardarFin(Number(b.dataset.rpe));
  };
}

function guardarFin(rpe) {
  const { f, clave, ses, rec, para } = ctx;
  const d = dia(f);
  const p = progreso(ses, rec);
  rec.rpe = rpe; rec.fin = Date.now(); rec.completa = true;
  const gym = 'ABC'.includes(clave) && clave.length === 1;
  if (gym) {
    d.completa = true; d.rpe = rpe;
    d.res ||= {};
    for (const bl of ses.bloques) for (const it of bl.items) {
      const hechas = (rec.hechas[it.slot] || []).filter(Boolean).length;
      if (!W.conPeso(it.e) || rec.pesos[it.slot] === undefined || !hechas) continue;
      const ok = (rec.hechas[it.slot] || []).slice(0, it.s).filter(Boolean).length >= it.s;
      d.res[it.e] = { v: rec.pesos[it.slot], u: W.unidad(it.e), ok };
      // El peso usado pasa a ser el de trabajo (en descarga/puesta no se toca)
      if (!['descarga', 'puesta'].includes(ses.fase) && !ses.ligera) W.guardarTrabajo(it.e, rec.pesos[it.slot], f, !!rec.subio?.[it.e]);
    }
  }
  if (para) { dia(para).salvado = f; d.planbHecho = clave; }
  guardar();
  cerrarHoja(); cerrarDescanso();
  pantallaEncendida(false);
  pared(p, rpe, !!para);
}

function pared(p, rpe, salvado) {
  const min = Math.max(1, Math.round((ctx.rec.fin - ctx.rec.inicio) / 60000));
  const el = document.createElement('div');
  el.className = 'pared';
  el.innerHTML = `
    <div class="pared-ola"></div>
    <div class="pared-in">
      <div class="pared-ico">${ico(salvado ? 'corazon' : 'trofeo')}</div>
      <h2>${salvado ? '¡Día salvado!' : '¡Llegaste a la pared!'}</h2>
      <p>${salvado ? 'Faltaste, pero no perdiste lo que llevas trabajado. La racha sigue.' : `${esc(ctx.ses.n)} lista. Un paso más cerca de ${esc(C().comp.corto || C().comp.nombre)}.`}</p>
      <div class="pared-stats">
        <div><b>${p.ok}</b><span>series</span></div>
        <div><b>${min}</b><span>${min === 1 ? 'minuto' : 'minutos'}</span></div>
        ${ctx.ses.tope ? `<div><b>${ctx.rec.saltos}</b><span>saltos</span></div>` : ''}
        <div><b>${rpe}</b><span>RPE</span></div>
      </div>
      <button class="btn-pri">Volver a Hoy</button>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('abierta'));
  sonar.logro(); vibrar([80, 60, 80, 60, 200]);
  setTimeout(() => confeti(true), 350);
  el.querySelector('button').onclick = () => { el.remove(); location.hash = 'hoy'; };
}

// ── Chequeo antes de entrenar ────────────────────────────────
export function chequeo(f, alListo) {
  const r = { sueno: null, cansancio: null, dolor: null };
  const caras = (k, ops) => `<div class="caras" data-k="${k}">${ops.map(([v, e, t]) => `<button data-v="${v}"><span>${e}</span><small>${t}</small></button>`).join('')}</div>`;
  const h = abrirHoja(`
    <p class="eyebrow">Chequeo de 10 segundos</p>
    <h2 class="hoja-t">¿Cómo vienes hoy?</h2>
    <h4 class="sub-t">¿Cómo dormiste?</h4>
    ${caras('sueno', [[1, '😫', 'Muy mal'], [2, '😕', 'Mal'], [3, '😐', 'Normal'], [4, '🙂', 'Bien'], [5, '😴', 'Muy bien']])}
    <h4 class="sub-t">¿Qué tan cansado vienes del agua?</h4>
    ${caras('cansancio', [[1, '😄', 'Fresco'], [2, '🙂', 'Poco'], [3, '😐', 'Normal'], [4, '😓', 'Cansado'], [5, '🥵', 'Muerto']])}
    <h4 class="sub-t">¿Algún dolor?</h4>
    <div class="caras dolor" data-k="dolor">
      <button data-v="no"><span>👍</span><small>Nada</small></button>
      <button data-v="hombro"><span>💪</span><small>Hombro</small></button>
      <button data-v="rodilla"><span>🦵</span><small>Rodilla</small></button>
      <button data-v="espalda"><span>🧍</span><small>Espalda</small></button>
    </div>
    <div id="cq-res"></div>`);
  h.onclick = ev => {
    const b = ev.target.closest('.caras button');
    if (b) {
      const k = b.closest('.caras').dataset.k, v = b.dataset.v;
      vibrar();
      if (k === 'dolor') {
        if (v === 'no') r.dolor = [];
        else { const s = new Set((r.dolor || []).filter(Boolean)); s.has(v) ? s.delete(v) : s.add(v); r.dolor = [...s]; }
        $$('.dolor button', h).forEach(x => x.classList.toggle('sel', x.dataset.v === 'no' ? r.dolor.length === 0 : r.dolor.includes(x.dataset.v)));
      } else {
        r[k] = Number(v);
        $$(`[data-k="${k}"] button`, h).forEach(x => x.classList.toggle('sel', x === b));
      }
      resultado();
      return;
    }
    const a = ev.target.closest('[data-cq]');
    if (!a) return;
    const d = dia(f);
    d.chequeo = { sueno: r.sueno, cansancio: r.cansancio, dolor: r.dolor };
    d.ligera = a.dataset.cq === 'ligera';
    guardar(); cerrarHoja();
    alListo();
  };
  function resultado() {
    const box = $('#cq-res', h);
    if (r.sueno === null || r.cansancio === null || r.dolor === null) { box.innerHTML = ''; return; }
    if (r.dolor.length) {
      box.innerHTML = `<div class="nota coral">${ico('alto')}<span>Con dolor de ${r.dolor.join(' y ')} hoy quito todo lo que carga esa zona y dejo solo movilidad y core. <b>Avísale a tu entrenador.</b></span></div>
        <button class="btn-pri" data-cq="normal">Entendido, empezar</button>`;
    } else if (r.cansancio >= 4 || (r.sueno <= 2 && r.cansancio >= 3)) {
      box.innerHTML = `<div class="nota">${ico('luna')}<span>Vienes cargado. Te propongo la <b>versión ligera</b>: misma sesión, una serie menos en todo y sin saltos al cajón.</span></div>
        <div class="fila-2"><button class="btn-sec" data-cq="normal">Normal</button><button class="btn-pri chico" data-cq="ligera">Versión ligera</button></div>`;
    } else {
      box.innerHTML = `<div class="nota agua">${ico('check')}<span>¡Todo en orden! A darle con calidad.</span></div>
        <button class="btn-pri" data-cq="normal">Empezar sesión</button>`;
    }
  }
}

export function abrirSesion(clave, f, para) {
  const d = deFecha(f);
  const ir = () => { location.hash = `sesion/${clave}/${f}${para ? '/' + para : ''}`; };
  if (d.tipo === 'gym' && clave === d.letra && !leerDia(f).chequeo) chequeo(f, ir);
  else ir();
}
