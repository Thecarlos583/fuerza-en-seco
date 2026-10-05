// Los ejercicios del día dentro de Hoy (al estilo de Mi Rutina): tarjetas que se abren,
// burbujas por serie, descansos, saltos, pesos guiados, cambiar ejercicio, chequeo y RPE al final.
import { EJ, RPE, REGLAS_PARAR } from './data.js';
import { S, C, guardar, dia, leerDia } from './store.js';
import { sesionDe, deFecha, contactos, letraDe } from './plan.js';
import * as W from './pesos.js';
import { cuerpo } from './cuerpo.js';
import { tieneAnimacion, montar } from './anim.js';
import { iniciarDescanso, iniciarTrabajo, cerrarDescanso } from './timer.js';
import { $, $$, ico, esc, num, chipTransfer, abrirHoja, cerrarHoja, aviso, vibrar, sonar, burbujas, confeti, pantallaEncendida } from './util.js';
import { sumar, lunesDe } from './fechas.js';

let ctx = null; // { clave, f, para, ses, rec, raiz }
const abiertas = new Set();

const LADO = { lado: 'por lado', pierna: 'por pierna', brazo: 'por brazo', pie: 'por pie' };
const segTxt = it => Array.isArray(it.seg) ? `${it.seg[0]}-${it.seg[1]} s` : it.seg >= 120 ? `${it.seg / 60} min` : `${it.seg} s`;
export const prescripcion = it => `${it.s} × ${it.seg ? segTxt(it) : (it.rTxt || it.r)}${it.lado ? ' ' + LADO[it.lado] : ''}`;
const segDe = it => Array.isArray(it.seg) ? it.seg[0] : it.seg;
const refrescar = () => dispatchEvent(new Event('fs:refrescar'));

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

export function sesionDelDia(clave, f) {
  const l = leerDia(f);
  return sesionDe(clave, f, { ligera: !!l.ligera, dolor: l.chequeo?.dolor || [] });
}

// ── HTML de la lista de ejercicios ───────────────────────────
export function htmlSesion(clave, f, para = '') {
  const ses = sesionDelDia(clave, f);
  const rec = leerRegistro(f, clave) || { hechas: {}, pesos: {}, saltos: 0 };
  ctx = { clave, f, para, ses, rec, raiz: null };
  let n = 0;
  return `
    ${ses.aviso ? `<div class="nota coral">${ico('info')}<span>${esc(ses.aviso)}</span></div>` : ''}
    ${ses.ligera ? `<div class="nota">${ico('luna')}<span>Versión ligera: una serie menos, sin saltos al cajón y el peso un escalón abajo.</span></div>` : ''}
    ${ses.bloques.map(bl => `
      <section class="bloque" style="--c:${bl.c}">
        <div class="carril"><span>${esc(bl.n)}</span>${bl.rondas ? `<small>${bl.rondas} rondas · ${bl.descansoRonda} s entre rondas</small>` : ''}</div>
        <div class="lista-ej">${bl.items.map(it => tarjeta(it, bl, ++n)).join('')}</div>
      </section>`).join('')}
    ${ses.final ? `<div class="nota agua">${ico('luna')}<span>${esc(ses.final)}</span></div>` : ''}
    ${rec.completa ? '' : `<button class="btn-pri" data-a="terminar">${ico('bandera')}Terminar sesión</button>`}`;
}

// Conecta los toques de la lista (la raíz es el contenedor dentro de Hoy)
export function activar(raiz) {
  if (!ctx) return;
  ctx.raiz = raiz;
  ctx.rec = registro(ctx.f, ctx.clave);
  raiz.onclick = clic;
}

function tarjeta(it, bl, n) {
  const e = EJ[it.e];
  const hechas = ctx.rec.hechas[it.slot] || [];
  const completa = hechas.slice(0, it.s).filter(Boolean).length >= it.s;
  const abierta = abiertas.has(it.slot);
  const cambio = it.cambiado ? (leerDia(ctx.f).cambios?.[it.slot] ? 'hoy' : 'siempre') : null;
  const ronda = !!bl.rondas;
  return `
  <article class="ej ${completa ? 'completa' : ''} ${abierta ? 'abierta' : ''}" data-slot="${it.slot}" data-n="${n}" style="--c:${bl.c}">
    <button class="ej-cab" data-a="abrir" aria-expanded="${abierta}">
      <span class="ej-num">${completa ? ico('check') : n}</span>
      <span class="ej-tit">
        <span class="ej-n">${esc(e.n)}</span>
        <span class="chips-pres">${chipsPres(it, bl)}</span>
      </span>
      <span class="ej-chev">${ico('abajo')}</span>
    </button>
    <div class="ej-tags">
      ${e.tr.map(chipTransfer).join('')}
      ${e.maq ? `<span class="tag neutro">Máquina</span>` : ''}
      ${e.exp ? `<span class="tag exp">⚡ Baja en 2 s, sube explosivo</span>` : ''}
      ${ctx.ses.casa && e.casa ? `<span class="tag neutro">${ico('casa')}${esc(e.casa)}</span>` : ''}
      ${cambio ? `<span class="tag marca">${ico('cambiar')}${cambio === 'hoy' ? 'Solo hoy' : 'Siempre'}</span><button class="tag volver" data-a="revertir">Original</button>` : ''}
    </div>
    <div class="series" role="group" aria-label="${ronda ? 'Rondas' : 'Series'}">${Array.from({ length: it.s }, (_, k) => `<button class="serie ${hechas[k] ? 'hecha' : ''}" data-a="serie" data-k="${k}" aria-pressed="${!!hechas[k]}" aria-label="${ronda ? 'Ronda' : 'Serie'} ${k + 1}"><span class="serie-n">${k + 1}</span>${ico('check', 'serie-ok')}</button>`).join('')}</div>
    ${bloquePeso(it)}
    ${e.pp && C().pieplano !== false && it.alts.length ? `<button class="pie-plano" data-a="cambiar">${ico('cambiar')}<span><b>Pie plano:</b> si te cuesta el equilibrio o sientes el arco, cámbialo por otro</span></button>` : ''}
    <div class="mas"><div class="mas-in">${abierta ? detalles(it) : ''}    </div></div>
  </article>`;
}
// Series, repeticiones y descanso como chips separados (se acomodan solos en pantallas angostas)
function chipsPres(it, bl) {
  const reps = it.seg ? `<b>${segTxt(it)}</b>` : `<b>${it.rTxt || it.r}</b> reps`;
  const d = it.d ? (it.d >= 60 && it.d % 60 === 0 ? `${it.d / 60} min` : `${it.d} s`) : '';
  return `<span><b>${it.s}</b> ${bl.rondas ? 'rondas' : 'series'}</span><span>${reps}${it.lado ? ' ' + LADO[it.lado] : ''}</span>${d && !bl.rondas ? `<span>${ico('reloj')}${d}</span>` : ''}`;
}
const minus = s => s ? s.charAt(0).toLowerCase() + s.slice(1).replace(/\.$/, '') : '';

// Detalles de la tarjeta (se crean solo al abrirla)
function detalles(it) {
  const e = EJ[it.e];
  return `
      ${tieneAnimacion(it.e) ? `<button class="btn-sec ver" data-a="ver">${ico('play')}Ver cómo se hace</button>` : ''}
      <h4>Para qué sirve en el agua</h4><p class="txt2">${esc(e.para)}</p>
      <h4>Cómo hacerlo</h4>
      <ol class="pasos">${e.como.map(p => `<li>${esc(p)}</li>`).join('')}</ol>
      <div class="error"><span>${ico('cerrar')}</span><p><b>Error común:</b> ${esc(e.error)}</p></div>
      ${e.check ? `<h4>Puntos clave</h4><ul class="claves">${e.check.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${e.tec ? `<p class="sugerencia">${ico('mano')}<span>Si hay alguien en el gimnasio, vale la pena que te vea una serie. Algo como: «¿Me puedes ver una serie de ${esc(e.n.toLowerCase())}? Fíjate en ${esc(minus((e.check || e.como)[0]))}».</span></p>` : ''}
      ${e.z.length ? `<div class="mapa">${cuerpo(e.z, e.s)}</div>` : ''}
      ${it.alts.length ? `<button class="btn-sec" data-a="cambiar">${ico('cambiar')}Cambiar ejercicio</button>` : ''}`;
}

// ── Pesos guiados ────────────────────────────────────────────
function bloquePeso(it) {
  const e = it.e, p = W.info(e);
  if (!p) return '';
  if (!W.conPeso(e)) {
    const t = W.textoFijo(e);
    return t ? `<p class="ultima">${esc(t.ini)} <span class="tope-mini">${ico('candado')}tope: ${esc(t.tope)}</span></p>` : '';
  }
  const f = ctx.f;
  const tope = W.tope(e, f);
  if (tope === 0) return `<p class="ultima">Peso corporal${p.nota ? ` · ${esc(p.nota)}` : ''}</p>`;
  const v = ctx.rec.pesos[it.slot] ?? W.sugerido(e, f, { ligera: ctx.ses.ligera });
  const primera = !S().pesos[e] && v > 0;
  const sube = !primera && W.subida(e, f);
  const ult = W.trabajo(e);
  const calentar = W.paso(e, v / 2 + 0.01, -1) || W.lista(e)[0];
  return `
    <div class="peso">
      <button class="peso-btn" data-a="peso" data-d="-1" aria-label="Menos peso">${ico('menos')}</button>
      <div class="peso-val ${v >= tope ? 'en-tope' : ''}"><b>${v ? num(v) : '0'}</b><span>${v ? W.unidad(e) : 'corporal'}${p.eq === 'mano' && v ? ' c/mano' : ''}</span>${v >= tope ? ico('candado') : ''}</div>
      <button class="peso-btn" data-a="peso" data-d="1" aria-label="Más peso">${ico('mas')}</button>
    </div>
    <p class="ultima">${primera
      ? `Primera vez: empieza con <b>${W.texto(e, v)}</b>. Calienta antes con ${W.texto(e, calentar, { mano: false })} × 8.`
      : `${ult ? `Tu peso de trabajo: <b>${W.texto(e, ult)}</b>` : W.texto(e, v)}`}
      <span class="tope-mini">${ico('candado')}tope ${num(tope)} ${W.unidad(e)}</span></p>
    ${p.nota && primera ? `<p class="ultima">${esc(p.nota)}</p>` : ''}
    ${sube ? `<button class="sube" data-a="subir" data-v="${sube}">${ico('trofeo')}<span>La sesión pasada salió limpia: hoy puedes probar <b>${W.texto(e, sube)}</b></span></button>` : ''}
    ${p.eq === 'barra' && v ? discosSVG(e, v) : ''}`;
}

function discosSVG(e, total) {
  const d = W.discos(e, total);
  const col = { 20: 'var(--coral)', 45: 'var(--coral)', 10: 'var(--azul)', 25: 'var(--azul)', 5: 'var(--turq)', 2.5: 'var(--amarillo)', 1.25: 'var(--txt2)' };
  const alto = x => ({ 20: 72, 45: 72, 25: 62, 10: 56, 5: 44, 2.5: 34, 1.25: 28 }[x] || 30);
  const placa = (x, p) => { const h = alto(p); return `<rect x="${x}" y="${50 - h / 2}" width="12" height="${h}" rx="3" style="fill:${col[p]}"/>`; };
  const der = d.lado.map((p, i) => placa(196 + i * 14, p)).join('');
  const izq = d.lado.map((p, i) => placa(92 - i * 14, p)).join('');
  const txt = d.lado.length ? `${d.lado.map(num).join(' + ')} ${d.u} por lado` : 'sin discos';
  return `<div class="discos">
    <svg viewBox="0 0 300 100" aria-hidden="true">
      <rect x="16" y="46" width="268" height="8" rx="4" style="fill:var(--txt2)"/>
      <rect x="104" y="40" width="6" height="20" rx="2" style="fill:var(--txt)"/><rect x="190" y="40" width="6" height="20" rx="2" style="fill:var(--txt)"/>
      ${izq}${der}
    </svg>
    <p><b>${d.tipo} (${num(d.barra)} ${d.u})</b> + ${txt} = <b>${num(total)} ${d.u}</b></p>
  </div>`;
}

function hojaCandado(t, txt) {
  vibrar([40, 60, 40]);
  abrirHoja(`<div class="candado-grande">${ico('candado')}</div>
    <h2 class="hoja-t centro">${t}</h2>
    <p class="hoja-sub centro">${txt}</p>
    <button class="btn-pri" data-cerrar-hoja>Entendido</button>`).querySelector('[data-cerrar-hoja]').onclick = cerrarHoja;
}

function cambiarPeso(slot, dir) {
  const it = item(slot), e = it.e;
  const tope = W.tope(e, ctx.f);
  const v = ctx.rec.pesos[slot] ?? W.sugerido(e, ctx.f, { ligera: ctx.ses.ligera });
  const n = W.paso(e, v, dir);
  // Máximo un escalón por semana: sobre el peso de trabajo solo se sube cuando toca
  const base = W.trabajo(e) ?? W.inicial(e);
  const permitido = Math.min(tope, ctx.rec.subio?.[e] || W.subida(e, ctx.f) ? W.paso(e, base, 1) : base);
  if (dir > 0 && n > permitido && n <= tope) return hojaCandado('Un escalón por semana', 'Se sube cuando la sesión anterior sale completa, limpia y con RPE de 7 o menos. Cuando toque, aparece aquí.');
  if (dir > 0 && n > tope) return hojaCandado('Tope de este ciclo', 'Más peso no te hace nadar más rápido; la velocidad y la técnica sí.');
  ctx.rec.pesos[slot] = n; guardar();
  vibrar();
  repintarTarjeta(slot);
}

// ── Toques ───────────────────────────────────────────────────
const item = slot => ctx.ses.bloques.flatMap(b => b.items).find(i => i.slot === slot);
const bloqueDe = slot => ctx.ses.bloques.find(b => b.items.some(i => i.slot === slot));

function clic(ev) {
  const b = ev.target.closest('[data-a]');
  if (!b) return;
  const card = b.closest('.ej');
  const slot = card?.dataset.slot;
  switch (b.dataset.a) {
    case 'abrir': {
      const ab = card.classList.toggle('abierta');
      b.setAttribute('aria-expanded', ab);
      ab ? abiertas.add(slot) : abiertas.delete(slot);
      const mas = card.querySelector('.mas-in');
      if (ab && !mas.childElementCount) mas.innerHTML = detalles(item(slot));
      vibrar(8);
      break;
    }
    case 'serie': tocarSerie(slot, Number(b.dataset.k)); break;
    case 'peso': cambiarPeso(slot, Number(b.dataset.d)); break;
    case 'subir': ctx.rec.pesos[slot] = Number(b.dataset.v); ctx.rec.subio = { ...(ctx.rec.subio || {}), [item(slot).e]: true }; guardar(); repintarTarjeta(slot); aviso('¡Vamos con ese escalón!', 'trofeo'); break;
    case 'cambiar': hojaCambiar(slot); break;
    case 'revertir': revertir(slot); break;
    case 'ver': hojaAnimacion(item(slot).e); break;
    case 'terminar': terminar(); break;
    default: return;
  }
  ev.stopPropagation();
}

function tocarSerie(slot, k) {
  const it = item(slot), bl = bloqueDe(slot), e = EJ[it.e];
  const h = (ctx.rec.hechas[slot] ||= []);
  if (h[k]) { // deshacer
    h[k] = false;
    ctx.rec.saltos = Math.max(0, ctx.rec.saltos - contactos(it));
    guardar(); refrescarSeries(slot); pintarCab();
    return;
  }
  const c = contactos(it);
  if (c && ctx.ses.tope && ctx.rec.saltos + c > ctx.ses.tope) {
    vibrar([40, 60, 40]);
    aviso(`Llegaste al tope de ${ctx.ses.tope} saltos de hoy. Sigue con lo próximo.`, 'salto', 3800);
    return;
  }
  if (!ctx.rec.inicio) ctx.rec.inicio = Date.now();
  pantallaEncendida(true);
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
  const pesoNuevo = W.conPeso(it.e) && ctx.rec.pesos[slot] === undefined;
  if (pesoNuevo) ctx.rec.pesos[slot] = W.sugerido(it.e, ctx.f, { ligera: ctx.ses.ligera });
  guardar();
  sonar.serie(); vibrar(25);
  const completa = h.slice(0, it.s).filter(Boolean).length >= it.s;
  if (completa) abiertas.delete(slot);
  pesoNuevo ? repintarTarjeta(slot) : refrescarSeries(slot);
  const nb = $(`.ej[data-slot="${slot}"] .serie[data-k="${k}"]`, ctx.raiz);
  nb?.classList.add('pop'); burbujas(nb);
  pintarCab();

  const p = progreso(ctx.ses, ctx.rec);
  const primera = W.conPeso(it.e) && ctx.rec.pesos[slot] > 0 && !S().pesos[it.e];
  if (primera && k === 0) return hojaPrueba(slot);
  if (p.ok >= p.tot) return setTimeout(terminar, 500);

  // Descanso: en circuito solo al terminar la ronda; en el resto, después de cada serie
  const items = ctx.ses.bloques.flatMap(b => b.items);
  const sig = items.find(x => x !== it && (ctx.rec.hechas[x.slot] || []).slice(0, x.s).filter(Boolean).length < x.s && items.indexOf(x) > items.indexOf(it));
  if (bl.rondas) {
    const ultimo = bl.items[bl.items.length - 1];
    if (ultimo.slot === slot && k < bl.rondas - 1) iniciarDescanso(bl.descansoRonda, `Fin de la ronda ${k + 1}`, 'Vuelve a empezar el circuito.');
  } else if (!(completa && !sig)) {
    iniciarDescanso(it.d || 20, completa ? `Listo: ${e.n}` : `${e.n} · serie ${k + 2} de ${it.s}`,
      bl.b === 'potencia' ? 'Descanso completo: la velocidad importa más que el cansancio.' : completa && sig ? `Siguiente: ${EJ[sig.e].n}` : '');
  }
  if (completa && sig) setTimeout(() => $(`.ej[data-slot="${sig.slot}"]`, ctx.raiz)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
}

// Actualización rápida al marcar una serie: solo burbujas y estado de la tarjeta
function refrescarSeries(slot) {
  const card = $(`.ej[data-slot="${slot}"]`, ctx.raiz);
  if (!card) return;
  const it = item(slot), h = ctx.rec.hechas[slot] || [];
  card.querySelectorAll('.serie').forEach((b, k) => { b.classList.toggle('hecha', !!h[k]); b.setAttribute('aria-pressed', !!h[k]); });
  const completa = h.slice(0, it.s).filter(Boolean).length >= it.s;
  card.classList.toggle('completa', completa);
  if (completa) card.classList.remove('abierta');
  card.querySelector('.ej-num').innerHTML = completa ? ico('check') : card.dataset.n;
}

function repintarTarjeta(slot) {
  const card = $(`.ej[data-slot="${slot}"]`, ctx.raiz);
  if (!card) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = tarjeta(item(slot), bloqueDe(slot), Number(card.dataset.n));
  card.replaceWith(tmp.firstElementChild);
}

// Progreso en el hero de Hoy
function pintarCab() {
  const p = progreso(ctx.ses, ctx.rec);
  const a = $('#hero-letra');
  if (a) a.style.setProperty('--p', p.frac);
  const s = $('#hero-series');
  if (s) s.textContent = `${p.ok} de ${p.tot} series`;
  const sl = $('#hero-saltos');
  if (sl) { sl.innerHTML = `${ico('salto')}Saltos ${ctx.rec.saltos}/${ctx.ses.tope}`; sl.classList.toggle('lleno', ctx.rec.saltos >= ctx.ses.tope); }
}

// ── Serie de prueba ──────────────────────────────────────────
function hojaPrueba(slot) {
  const it = item(slot), e = it.e;
  const v = ctx.rec.pesos[slot];
  const h = abrirHoja(`
    <p class="eyebrow">${esc(EJ[e].n)}</p>
    <h2 class="hoja-t">¿Cómo se sintió con ${W.texto(e, v)}?</h2>
    <div class="opciones">
      <button class="opcion" data-r="1"><b>Muy fácil</b><span>Me sobraban 5 o más repeticiones</span></button>
      <button class="opcion" data-r="0"><b>Bien</b><span>Me sobraban 2-3, técnica limpia</span></button>
      <button class="opcion" data-r="-1"><b>Difícil</b><span>No me sobraba nada o se dañó la técnica</span></button>
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
    aviso(r === 0 ? `${W.texto(e, n)} es tu peso de trabajo` : `Siguiente serie con ${W.texto(e, n)}`, 'check', 3200);
    const bl = bloqueDe(slot);
    if (it.d) iniciarDescanso(it.d, `${EJ[e].n} · serie 2 de ${it.s}`, bl.b === 'potencia' ? 'Descanso completo: la velocidad importa más que el cansancio.' : '');
  };
}

// ── Cambiar ejercicio (como en Mi Rutina) ────────────────────
function hojaCambiar(slot) {
  const it = item(slot), orig = it.orig;
  let sel = null, modo = 'hoy';
  const h = abrirHoja(`
    <h3 class="hoja-t">Cambiar ejercicio</h3>
    <p class="hoja-sub">En lugar de <b>${esc(EJ[orig.e].n)}</b> · ${prescripcion(orig)}</p>
    <div class="alts">
      ${it.cambiado ? `<button class="alt original" data-e="${orig.e}"><span class="alt-cab"><span class="alt-n">${ico('cambiar')} Volver al original</span><b class="alt-sr">${prescripcion(orig)}</b></span><span class="alt-p">${esc(EJ[orig.e].n)}</span></button>` : ''}
      ${it.alts.map(a => `<button class="alt ${a.e === it.e ? 'actual' : ''}" data-e="${a.e}">
        <span class="alt-cab"><span class="alt-n">${esc(EJ[a.e].n)}</span><b class="alt-sr">${prescripcion(a)}</b></span>
        <span class="alt-p">${esc(EJ[a.e].como[0])}</span>${a.e === it.e ? '<span class="alt-tag">Ahora</span>' : ''}${EJ[a.e].maq ? '<span class="alt-maq">Máquina</span>' : ''}${EJ[a.e].pp && C().pieplano !== false ? '<span class="alt-pp">Puede costar con pie plano</span>' : ''}</button>`).join('')}
    </div>
    <div class="seg" role="radiogroup" aria-label="Duración del cambio">
      <button class="act" data-m="hoy" role="radio" aria-checked="true">Solo por hoy</button>
      <button data-m="siempre" role="radio" aria-checked="false">Usar siempre</button>
    </div>
    <button class="btn-pri" data-listo disabled>Elige una opción</button>`);
  h.onclick = ev => {
    const alt = ev.target.closest('.alt');
    if (alt) {
      sel = alt.dataset.e;
      $$('.alt', h).forEach(x => x.classList.toggle('sel', x === alt));
      const btn = $('[data-listo]', h);
      btn.disabled = false;
      btn.textContent = sel === orig.e ? 'Volver al original' : 'Cambiar';
      vibrar(8);
      return;
    }
    const m = ev.target.closest('[data-m]');
    if (m) {
      modo = m.dataset.m;
      $$('[data-m]', h).forEach(x => { x.classList.toggle('act', x === m); x.setAttribute('aria-checked', x === m); });
      vibrar(8);
      return;
    }
    if (ev.target.closest('[data-listo]') && sel) { aplicarCambio(slot, sel, modo); cerrarHoja(); refrescar(); }
  };
}

function aplicarCambio(slot, id, modo) {
  const it = item(slot), base = it.orig.e, d = dia(ctx.f), siempre = S().siempre;
  d.cambios ||= {};
  if (id === base) {
    if (modo === 'siempre') { delete siempre[base]; delete d.cambios[slot]; }
    else if (siempre[base]) d.cambios[slot] = base;
    else delete d.cambios[slot];
    aviso(`De vuelta a ${EJ[base].n}`, 'cambiar');
  } else {
    if (modo === 'siempre') { siempre[base] = id; delete d.cambios[slot]; }
    else d.cambios[slot] = id;
    aviso(modo === 'siempre' ? 'Cambiado para siempre' : 'Cambiado solo por hoy', 'cambiar');
  }
  // Al cambiar de ejercicio se reinician las series de ese puesto
  ctx.rec.saltos = Math.max(0, ctx.rec.saltos - (ctx.rec.hechas[slot] || []).filter(Boolean).length * contactos(it));
  delete ctx.rec.hechas[slot]; delete ctx.rec.pesos[slot];
  guardar(); vibrar();
}

function revertir(slot) {
  const it = item(slot), d = dia(ctx.f);
  if (d.cambios?.[slot]) delete d.cambios[slot]; else delete S().siempre[it.orig.e];
  delete ctx.rec.hechas[slot]; delete ctx.rec.pesos[slot];
  guardar(); vibrar();
  aviso(`De vuelta a ${EJ[it.orig.e].n}`, 'cambiar');
  refrescar();
}

// ── Ver cómo se hace ─────────────────────────────────────────
export function hojaAnimacion(e) {
  const x = EJ[e];
  const h = abrirHoja(`
    <p class="eyebrow">${ico('play')} Cómo se hace</p>
    <h2 class="hoja-t">${esc(x.n)}</h2>
    <div class="anim-caja"></div>
    <h4 class="sub-t">En el agua te sirve para</h4>
    <p class="txt2">${esc(x.para)}</p>
    <div class="error"><span>${ico('cerrar')}</span><p><b>Error común:</b> ${esc(x.error)}</p></div>
    ${x.z.length ? `<h4 class="sub-t">Músculos que trabaja</h4><div class="mapa encendido">${cuerpo(x.z, x.s)}</div>` : ''}`);
  montar(h.querySelector('.anim-caja'), e);
}

export function hojaParar() {
  abrirHoja(`
    <div class="alto-grande">${ico('alto')}</div>
    <h2 class="hoja-t centro">Cuándo parar</h2>
    <div class="reglas-parar">${REGLAS_PARAR.map(r => `<div><b>${esc(r.t)}</b><p>${esc(r.d)}</p></div>`).join('')}</div>`);
}

// ── Terminar: RPE y llegada a la pared ───────────────────────
function terminar() {
  const p = progreso(ctx.ses, ctx.rec);
  const h = abrirHoja(`
    <h2 class="hoja-t">${p.ok >= p.tot ? '¡Sesión completa!' : '¿Terminas por hoy?'}</h2>
    <p class="hoja-sub">${p.ok >= p.tot ? '' : `Llevas ${p.ok} de ${p.tot} series. `}¿Qué tan duro fue? (RPE)</p>
    <div class="rpe">${RPE.map(([n, t]) => `<button data-rpe="${n}" style="--h:${190 - n * 17}"><b>${n}</b><span>${t}</span></button>`).join('')}</div>`);
  h.onclick = ev => {
    const b = ev.target.closest('[data-rpe]');
    if (b) guardarFin(Number(b.dataset.rpe));
  };
}

function guardarFin(rpe) {
  const { f, clave, ses, rec, para } = ctx;
  const d = dia(f);
  const p = progreso(ses, rec);
  rec.rpe = rpe; rec.fin = Date.now(); rec.completa = true; rec.inicio ||= rec.fin;
  const gym = clave.length === 1 && 'ABC'.includes(clave);
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
    // Si hizo hoy una sesión que le tocaba otro día de la semana y no la había hecho, cuenta como recuperada
    if (deFecha(f).letra !== clave) {
      for (let x = lunesDe(f); x < f; x = sumar(x, 1)) {
        if (letraDe(x) === clave && !leerDia(x).completa) { dia(x).recuperada = f; break; }
      }
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
      <button class="btn-pri">Listo</button>
    </div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('abierta'));
  sonar.logro(); vibrar([80, 60, 80, 60, 200]);
  setTimeout(() => confeti(true), 350);
  el.querySelector('button').onclick = () => { el.remove(); scrollTo({ top: 0, behavior: 'smooth' }); refrescar(); };
}

// ── Chequeo antes de entrenar ────────────────────────────────
export function chequeo(f) {
  const r = { sueno: null, cansancio: null, dolor: null };
  const caras = (k, ops) => `<div class="caras" data-k="${k}">${ops.map(([v, e, t]) => `<button data-v="${v}"><span>${e}</span><small>${t}</small></button>`).join('')}</div>`;
  const h = abrirHoja(`
    <p class="eyebrow">Chequeo rápido</p>
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
      vibrar(8);
      if (k === 'dolor') {
        if (v === 'no') r.dolor = [];
        else { const s = new Set(r.dolor || []); s.has(v) ? s.delete(v) : s.add(v); r.dolor = [...s]; }
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
    refrescar();
  };
  function resultado() {
    const box = $('#cq-res', h);
    if (r.sueno === null || r.cansancio === null || r.dolor === null) { box.innerHTML = ''; return; }
    if (r.dolor.length) {
      box.innerHTML = `<div class="nota coral">${ico('alto')}<span>Hoy quito lo que carga ${r.dolor.join(' y ')}: queda movilidad y core. Coméntaselo a tu entrenador.</span></div>
        <button class="btn-pri" data-cq="normal">Listo</button>`;
    } else if (r.cansancio >= 4 || (r.sueno <= 2 && r.cansancio >= 3)) {
      box.innerHTML = `<div class="nota">${ico('luna')}<span>Vienes cargado. Opción: <b>versión ligera</b> (una serie menos y sin saltos al cajón).</span></div>
        <div class="fila-2"><button class="btn-sec" data-cq="normal">Normal</button><button class="btn-pri chico" data-cq="ligera">Versión ligera</button></div>`;
    } else {
      box.innerHTML = `<button class="btn-pri" data-cq="normal">Listo</button>`;
    }
  }
}
