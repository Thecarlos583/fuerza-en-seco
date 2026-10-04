// Guía: reglas para parar, primer día en el gimnasio, grábate, reglas del entrenador y el plan por fases.
import { FASES, REGLAS_PARAR, REGLAS_ENTRENADOR, REVISAR, EJ } from './data.js';
import { S, C } from './store.js';
import { tramos } from './plan.js';
import { fechaCorta, fechaLarga } from './fechas.js';
import { ico, esc, aviso } from './util.js';
import { hojaAyuda, mostrarGrande } from './sesion.js';

export const frasePrimerDia = () => {
  const c = C();
  const d = new Date(c.comp.ini + 'T12:00');
  return `Hola, soy ${c.nombre}, soy nadador y estoy preparándome para ${c.comp.corto || c.comp.nombre} del ${d.getDate()} de ${d.toLocaleDateString('es', { month: 'long' })}. Estoy haciendo un plan de fuerza explosiva y voy a entrenar solo. ¿Me podrías revisar la técnica de algunos ejercicios hoy?`;
};

export function renderGuia(v, sub) {
  const frase = frasePrimerDia();
  const ts = tramos().filter(t => !['antes', 'despues'].includes(t.fase));
  v.innerHTML = `
    <div class="top"><p class="saludo">Lo que tienes que saber</p><h1>Guía</h1></div>

    <section class="card regla" style="--c:#FF6B6B">
      <h3>${ico('alto')} Reglas para parar</h3>
      <div class="reglas-parar">${REGLAS_PARAR.map(r => `<div><b>${esc(r.t)}</b><p>${esc(r.d)}</p></div>`).join('')}</div>
    </section>

    <section class="card" id="primer-dia">
      <div class="card-cab"><h3>${ico('mano')} Primer día en el gimnasio</h3></div>
      <p class="txt2 peq">Preséntate con el instructor. Puedes leerle esto o enseñarle el teléfono:</p>
      <blockquote class="frase">"${esc(frase)}"</blockquote>
      <div class="fila-2">
        <button class="btn-sec" data-g="copiar">${ico('copiar')}Copiar</button>
        <button class="btn-sec" data-g="grande">${ico('ojo')}Mostrar en grande</button>
      </div>
      <h4 class="sub-t">Que te revisen sí o sí la primera semana</h4>
      <div class="revisar-lista">${REVISAR.map(e => `<button class="rev ${S().revisado[e] ? 'ok' : ''}" data-g="ayuda" data-e="${e}">
        <span class="hab-c">${ico('check')}</span><span>${esc(EJ[e].n)}</span>${ico('abajo', 'rev-chev')}</button>`).join('')}</div>
    </section>

    <section class="card">
      <div class="card-cab"><h3>${ico('camara')} Grábate (cuando no hay instructor)</h3></div>
      <ol class="pasos">
        <li>Apoya el teléfono a la altura de la cadera, de lado. Para ver las rodillas (sentadillas, saltos, sumo, patinador, Copenhague), de frente.</li>
        <li>Graba una serie con la cámara del teléfono.</li>
        <li>Compárala con "Cómo hacerlo" y revisa los 3 puntos de "Pedir ayuda". Si algo falla, baja el peso.</li>
      </ol>
      <p class="peq txt2">La app no guarda videos: quedan solo en tu galería.</p>
    </section>

    <section class="card regla" style="--c:#00D1FF">
      <h3>${ico('guia')} Reglas del entrenador</h3>
      <ul>${REGLAS_ENTRENADOR.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
    </section>

    <section class="card">
      <div class="card-cab"><h3>${ico('cal')} El plan hasta ${esc(C().comp.corto || C().comp.nombre)}</h3></div>
      <p class="txt2 peq">Se calcula hacia atrás desde el ${fechaLarga(C().comp.ini).toLowerCase()}. Si cambias la fecha en Ajustes, el plan se recalcula solo.</p>
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
      <div class="nota agua">${ico('piscina')}<span>La descarga del agua la decide tu entrenador de natación. Esta app ajusta solo el trabajo en seco para que llegues fresco y explosivo.</span></div>
      <p class="peq txt2">Los saltos suaves (pogo) de la activación no cuentan para el tope: son rebotes cortos para preparar los tobillos.</p>
    </section>
    <p class="pie">Este plan complementa a tu entrenador de natación: enséñaselo.</p>`;

  v.onclick = async ev => {
    const b = ev.target.closest('[data-g]');
    if (!b) return;
    if (b.dataset.g === 'copiar') { try { await navigator.clipboard.writeText(frase); aviso('Frase copiada', 'copiar'); } catch { aviso('No se pudo copiar', 'info'); } }
    if (b.dataset.g === 'grande') mostrarGrande(frase);
    if (b.dataset.g === 'ayuda') hojaAyuda(b.dataset.e);
  };
  if (sub) setTimeout(() => document.getElementById(sub)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}
