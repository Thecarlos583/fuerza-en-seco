// Guía: el plan día por día (como en Mi Rutina), reglas, cuándo parar y fases hasta la competencia.
import { FASES, REGLAS_PARAR, REGLAS_ORO, SUGERIR, EJ, SESIONES, RUTINAS, ACTIVACION, LIGAS, LIGAS_TXT } from './data.js';
import { C, guardar } from './store.js';
import * as W from './pesos.js';
import { tramos, gymOrden, RECUPERACION } from './plan.js';
import { fechaCorta, fechaLarga, NOMBRE_DIA, SEMANA } from './fechas.js';
import { ico, esc, vibrar, aviso } from './util.js';
import { prescripcion, hojaAnimacion } from './sesion.js';
import { tieneAnimacion } from './anim.js';
import { guiaAgarresHTML } from './agarres.js';

export function renderGuia(v, sub) {
  const c = C();
  const ts = tramos().filter(t => !['antes', 'despues'].includes(t.fase));
  const orden = gymOrden();
  const lista = items => `<ul>${items.map(it => `<li style="--c:${EJ[it.e].maq ? 'var(--azul)' : 'var(--aqua)'}"><i class="punto"></i><span>${esc(EJ[it.e].n)}${EJ[it.e].maq ? ' <small>(máquina)</small>' : ''}${pesos(it.e)}</span>${tieneAnimacion(it.e) ? `<button class="ver-mini" data-g="ver" data-e="${it.e}" aria-label="Ver cómo se hace">${ico('play')}</button>` : ''}<b>${prescripcion(it)}</b></li>`).join('')}</ul>`;
  // "Empieza con" y "Tope" en la unidad elegida con el switch
  const pesos = e => {
    if (!W.conPeso(e) || W.tope(e) === 0) return '';
    const ini = W.inicial(e);
    return `<small class="pesos-g">Empieza con ${ini ? W.texto(e, ini, { mano: false }) : 'peso corporal'} · tope ${W.cifra(e, W.tope(e))}</small>`;
  };
  const diaSesion = letra => {
    const s = SESIONES[letra];
    return `<details class="plan-dia"><summary><span class="dia-n">${NOMBRE_DIA[orden['ABC'.indexOf(letra)]] || ''}</span><span class="dia-t">Sesión ${letra} · ${s.n}<small>${s.sub}</small></span>${ico('abajo')}</summary>
      <p class="plan-b">Activación</p>${lista(ACTIVACION)}
      <p class="plan-b">Potencia</p>${lista(s.potencia)}
      <p class="plan-b">Fuerza</p>${lista(s.fuerza)}
      <p class="plan-b">Core y prevención</p>${lista(s.core)}</details>`;
  };
  const rutina = (k, dn) => `<details class="plan-dia"><summary><span class="dia-n">${dn}</span><span class="dia-t">${RUTINAS[k].n}<small>${RUTINAS[k].sub}</small></span>${ico('abajo')}</summary>
      ${RUTINAS[k].bloques.map(b => lista(b.items)).join('')}</details>`;
  // La semana en orden: gimnasio, recuperación de los días de doble sesión y domingo libre
  const dias = SEMANA.map(d => {
    const k = orden.indexOf(d);
    if (k >= 0 && k < 3) return diaSesion('ABC'[k]);
    if (d === 'dom') return `<div class="plan-dia quieto"><span class="dia-n">Domingo</span><span class="dia-t">Descanso</span></div>`;
    if (RECUPERACION[d]) return rutina(RECUPERACION[d], NOMBRE_DIA[d]);
    return rutina('movilidad', NOMBRE_DIA[d]);
  }).join('');
  const ligas = `<details class="plan-dia"><summary><span class="dia-n">Días de agua</span><span class="dia-t">Antes de nadar: activación con ligas<small>4 min · banda ligera o mediana · ${esc(LIGAS_TXT.ligera)}</small></span>${ico('abajo')}</summary>
      ${lista(LIGAS.base)}<p class="plan-b">En competencia se suman (según tus pruebas)</p>${lista([...LIGAS.pecho, ...LIGAS.libre])}</details>`;

  v.innerHTML = `
    <div class="top"><p class="saludo">Para tenerlo a mano</p><h1>Guía</h1></div>

    <section class="card">
      <div class="card-cab"><h3>${ico('cal')} Tu semana</h3><span class="cont">fuerza explosiva · máquinas y mancuernas</span></div>
      <div class="plan">
        ${dias}
        ${ligas}
      </div>
      <p class="plan-b">Plan B (solo si no pudiste ir)</p>
      <div class="plan">${['recuperacion', 'forma', 'agua'].map(k => rutina(k, 'Plan B')).join('')}</div>
      <p class="peq txt2">Las series cambian según la fase: aquí ves las de las semanas de construcción.</p>
    </section>

    <section class="card regla" style="--c:var(--coral)">
      <h3>${ico('alto')} Cuándo parar</h3>
      <div class="reglas-parar">${REGLAS_PARAR.map(r => `<div><b>${esc(r.t)}</b><p>${esc(r.d)}</p></div>`).join('')}</div>
    </section>

    <section class="card oro" id="reglas">
      <div class="card-cab"><h3>${ico('trofeo')} Tus 8 reglas de oro</h3><span class="cont" id="oro-n">1 de ${REGLAS_ORO.length}</span></div>
      <p class="oro-lema">Entrenar explosivo, fresco y seguro</p>
      <div class="oro-carrusel" id="oro" tabindex="0" aria-label="Reglas de oro, desliza para ver la siguiente">
        ${REGLAS_ORO.map((r, k) => `<article class="oro-t" aria-label="Regla ${k + 1} de ${REGLAS_ORO.length}">
          <span class="oro-ico">${ico(r.i)}</span>
          <p class="oro-num">Regla ${k + 1}</p>
          <h4>${esc(r.t)}</h4>
          <p>${esc(r.d)}</p>
          <p class="oro-ej"><b>Ejemplo:</b> ${esc(r.ej)}</p>
        </article>`).join('')}
      </div>
      <div class="oro-puntos" aria-hidden="true">${REGLAS_ORO.map((_, k) => `<i class="${k ? '' : 'act'}"></i>`).join('')}</div>
    </section>

    ${guiaAgarresHTML(Object.values(EJ))}

    <section class="card" id="primer-dia">
      <div class="card-cab"><h3>${ico('mano')} Si quieres que te guíen</h3></div>
      <p class="txt2">Entrenar solo está bien, pero al principio ayuda que alguien te vea un par de series, sobre todo en ${SUGERIR.map(e => EJ[e].n.toLowerCase()).join(', ')}. Al instructor le puedes decir algo como: «Soy nadador, me estoy preparando para ${esc(c.comp.corto || c.comp.nombre)} y estoy haciendo un plan de fuerza explosiva. ¿Me ves la técnica de este ejercicio?».</p>
    </section>

    <section class="card">
      <div class="card-cab"><h3>${ico('trofeo')} Hasta ${esc(c.comp.corto || c.comp.nombre)}</h3></div>
      <p class="txt2 peq">Se calcula hacia atrás desde el ${fechaLarga(c.comp.ini).toLowerCase()}. Si cambias la fecha en Ajustes, se recalcula solo.</p>
      <div class="fases">${ts.map(t => {
        const fa = FASES[t.fase];
        const det = t.fase === 'puesta' ? 'Potencia 2 × 2-3 · sin fuerza'
          : t.fase === 'competencia' ? 'Calentamiento en seco y recuperación'
          : `Potencia ${4 + fa.p} series · fuerza ${3 + fa.f}-${4 + fa.f} series · RPE ${fa.rpe}`;
        return `<div class="fase-f" style="--c:${fa.c}">
          <div><b>${fa.n}</b><span>${fechaCorta(t.ini)}${t.fin !== t.ini ? ' – ' + fechaCorta(t.fin) : ''}</span></div>
          <p>${det}${fa.tope ? ` · tope ${fa.tope} saltos` : ''}</p>
        </div>`;
      }).join('')}</div>
      <div class="nota agua">${ico('piscina')}<span>La descarga del agua la decide tu entrenador de natación. La app ajusta solo el trabajo en seco para que llegues fresco y explosivo.</span></div>
      <p class="peq txt2">Los saltos suaves (pogo) de la activación no cuentan para el tope.</p>
    </section>
    <p class="pie">Este plan complementa a tu entrenador de natación: enséñaselo.</p>`;

  v.onclick = ev => {
    const b = ev.target.closest('[data-g=ver]');
    if (b) { ev.preventDefault(); hojaAnimacion(b.dataset.e); return; }
  };
  const car = v.querySelector('#oro');
  car.addEventListener('scroll', () => {
    const k = Math.round(car.scrollLeft / car.clientWidth);
    v.querySelectorAll('.oro-puntos i').forEach((p, i) => p.classList.toggle('act', i === k));
    v.querySelector('#oro-n').textContent = `${k + 1} de ${REGLAS_ORO.length}`;
  }, { passive: true });
  if (sub) setTimeout(() => document.getElementById(sub)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}
