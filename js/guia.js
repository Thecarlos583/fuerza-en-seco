// Guía: el plan día por día (como en Mi Rutina), reglas, cuándo parar y fases hasta la competencia.
import { FASES, REGLAS_PARAR, REGLAS_ENTRENADOR, SUGERIR, EJ, SESIONES, RUTINAS, ACTIVACION } from './data.js';
import { C } from './store.js';
import { tramos, gymOrden } from './plan.js';
import { fechaCorta, fechaLarga, NOMBRE_DIA, SEMANA } from './fechas.js';
import { ico, esc } from './util.js';
import { prescripcion, hojaAnimacion } from './sesion.js';
import { tieneAnimacion } from './anim.js';

export function renderGuia(v, sub) {
  const c = C();
  const ts = tramos().filter(t => !['antes', 'despues'].includes(t.fase));
  const orden = gymOrden();
  const lista = items => `<ul>${items.map(it => `<li style="--c:${EJ[it.e].maq ? '#7C9CFF' : '#00D1FF'}"><i class="punto"></i><span>${esc(EJ[it.e].n)}${EJ[it.e].maq ? ' <small>(máquina)</small>' : ''}</span>${tieneAnimacion(it.e) ? `<button class="ver-mini" data-g="ver" data-e="${it.e}" aria-label="Ver cómo se hace">${ico('play')}</button>` : ''}<b>${prescripcion(it)}</b></li>`).join('')}</ul>`;
  const diaSesion = letra => {
    const s = SESIONES[letra];
    return `<details class="plan-dia"><summary><span class="dia-n">${NOMBRE_DIA[orden['ABC'.indexOf(letra)]] || ''}</span><span class="dia-t">Sesión ${letra} · ${s.n}<small>${s.sub}</small></span>${ico('abajo')}</summary>
      <p class="plan-b">Activación</p>${lista(ACTIVACION)}
      <p class="plan-b">Potencia</p>${lista(s.potencia)}
      <p class="plan-b">Fuerza</p>${lista(s.fuerza)}
      <p class="plan-b">Core y prevención</p>${lista(s.core)}</details>`;
  };
  const rutina = k => `<details class="plan-dia"><summary><span class="dia-n">${k === 'movilidad' ? 'Otros días' : 'Plan B'}</span><span class="dia-t">${RUTINAS[k].n}<small>${RUTINAS[k].sub}</small></span>${ico('abajo')}</summary>
      ${RUTINAS[k].bloques.map(b => lista(b.items)).join('')}</details>`;

  v.innerHTML = `
    <div class="top"><p class="saludo">Para tenerlo a mano</p><h1>Guía</h1></div>

    <section class="card">
      <div class="card-cab"><h3>${ico('cal')} Tu semana</h3><span class="cont">A y B con máquinas · C sin máquinas</span></div>
      <div class="plan">
        ${['A', 'B', 'C'].map(diaSesion).join('')}
        ${rutina('movilidad')}
        <div class="plan-dia quieto"><span class="dia-n">Domingo</span><span class="dia-t">Descanso</span></div>
        ${['recuperacion', 'forma', 'agua'].map(rutina).join('')}
      </div>
      <p class="peq txt2">Las series cambian según la fase: aquí ves las de las semanas de construcción.</p>
    </section>

    <section class="card regla" style="--c:#FF6B6B">
      <h3>${ico('alto')} Cuándo parar</h3>
      <div class="reglas-parar">${REGLAS_PARAR.map(r => `<div><b>${esc(r.t)}</b><p>${esc(r.d)}</p></div>`).join('')}</div>
    </section>

    <section class="card regla" style="--c:#00D1FF">
      <h3>${ico('guia')} Reglas del entrenador</h3>
      <ul>${REGLAS_ENTRENADOR.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    </section>

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
          : `Potencia ${4 + fa.p} series · fuerza ${3 + fa.f} series · RPE ${fa.rpe}`;
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
    if (b) { ev.preventDefault(); hojaAnimacion(b.dataset.e); }
  };
  if (sub) setTimeout(() => document.getElementById(sub)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}
