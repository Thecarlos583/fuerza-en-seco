// Bienvenida (primer uso) y Ajustes. Comparten el mismo formulario.
import { DEFAULTS } from './data.js';
import { S, C, guardar, exportar, importar, reiniciar } from './store.js';
import { SEMANA, NOMBRE_DIA, valida, hoy } from './fechas.js';
import { diasSeguidos } from './plan.js';
import { $, $$, ico, esc, aviso, vibrar, confeti, sonar } from './util.js';

const seg = (nombre, ops, val) => `<div class="seg" data-seg="${nombre}">${ops.map(([v, t]) => `<button type="button" data-v="${v}" class="${String(v) === String(val) ? 'act' : ''}">${t}</button>`).join('')}</div>`;
const diasSel = (nombre, sel, sinDom = false) => `<div class="dias-sel" data-dias="${nombre}">${SEMANA.map(d => `<button type="button" data-v="${d}" class="${sel.includes(d) ? 'act' : ''}" ${sinDom && d === 'dom' ? 'disabled' : ''}>${NOMBRE_DIA[d].slice(0, 3)}</button>`).join('')}</div>`;

function formulario(c, completo) {
  const p = c.pesoCorp || { v: '', u: 'kg' };
  return `
    <section class="card">
      <h3 class="sub-t">Tú</h3>
      <label class="campo"><span>Nombre</span><input name="nombre" value="${esc(c.nombre)}" autocomplete="given-name"></label>
      <label class="campo"><span>Peso corporal</span>
        <div class="campo-fila"><input name="peso" type="number" inputmode="decimal" min="25" max="150" step="0.5" value="${p.v}" placeholder="Ej. 58">${seg('pu', [['kg', 'kg'], ['lb', 'lb']], p.u)}</div>
      </label>
      <p class="peq txt2">Sirve para ajustar los topes de peso: si pesas menos de 55 kg, todos bajan un 15%.</p>
      <label class="sw"><span><b>Tengo pie plano</b><small>Marca los ejercicios que pueden costar y muestra con qué cambiarlos</small></span><input type="checkbox" name="pieplano" ${c.pieplano !== false ? 'checked' : ''}><i></i></label>
    </section>

    <section class="card">
      <h3 class="sub-t">Tu gimnasio</h3>
      <div class="campo"><span>Mancuernas en</span>${seg('uManc', [['kg', 'Kilos (kg)'], ['lb', 'Libras (lb)']], c.uManc || 'kg')}</div>
      <div class="campo"><span>Discos y máquinas en</span>${seg('uDisco', [['kg', 'Kilos (kg)'], ['lb', 'Libras (lb)']], c.uDisco || 'kg')}</div>
      ${completo ? `<label class="campo"><span>Peso de la barra Z de tu gimnasio (kg)</span><input name="barraZ" type="number" inputmode="decimal" step="0.5" value="${(c.barraZ || [10])[0]}"></label>
      <p class="peq txt2">Pregunta en tu gimnasio cuánto pesa la suya. Suele estar entre 7 y 12 kg.</p>` : ''}
    </section>

    <section class="card">
      <h3 class="sub-t">Tu semana</h3>
      <div class="campo"><span>Días de gimnasio (elige 3)</span>${diasSel('gym', c.gym, true)}</div>
      <p class="peq txt2" id="gym-msg">En orden: el primero es la sesión A, el segundo la B y el tercero la C.</p>
      <div class="campo"><span>Días de agua</span>${diasSel('agua', c.agua)}</div>
      <label class="campo"><span>Fecha de inicio del plan</span><input name="inicio" type="date" value="${c.inicio}"></label>
    </section>

    <section class="card">
      <h3 class="sub-t">${ico('trofeo')} Competencia objetivo</h3>
      <label class="campo"><span>Nombre</span><input name="cnombre" value="${esc(c.comp.nombre)}"></label>
      <div class="fila-2">
        <label class="campo"><span>Empieza</span><input name="cini" type="date" value="${c.comp.ini}"></label>
        <label class="campo"><span>Termina (opcional)</span><input name="cfin" type="date" value="${c.comp.fin || ''}"></label>
      </div>
      <label class="campo"><span>Lugar</span><input name="clugar" value="${esc(c.comp.lugar || '')}" placeholder="Ciudad o piscina"></label>
      <div class="campo"><span>Piscina</span>${seg('piscina', [[25, '25 m (corta)'], [50, '50 m (larga)']], c.comp.piscina)}</div>
      <p class="peq txt2">Todo el plan se calcula hacia atrás desde esta fecha.</p>
    </section>`;
}

function leer(raiz, base) {
  const val = n => $(`[name="${n}"]`, raiz)?.value.trim();
  const segV = n => $(`[data-seg="${n}"] .act`, raiz)?.dataset.v;
  const dias = n => $$(`[data-dias="${n}"] .act`, raiz).map(b => b.dataset.v);
  const peso = parseFloat(val('peso'));
  const cnombre = val('cnombre') || DEFAULTS.comp.nombre;
  const bz = parseFloat(val('barraZ'));
  return {
    ...base,
    nombre: val('nombre') || 'Juan',
    pesoCorp: peso > 0 ? { v: peso, u: segV('pu') } : null,
    pieplano: !!$('[name="pieplano"]', raiz)?.checked,
    uManc: segV('uManc'), uDisco: segV('uDisco'),
    barraZ: bz > 0 ? [bz, Math.round(bz * 2.20462 / 5) * 5 || 20] : (base.barraZ || [10, 20]),
    gym: dias('gym'), agua: dias('agua'),
    inicio: val('inicio'),
    comp: { ...base.comp, nombre: cnombre, corto: /nacional/i.test(cnombre) ? 'los Juegos Nacionales' : cnombre, ini: val('cini'), fin: val('cfin') || '', lugar: val('clugar') || '', piscina: Number(segV('piscina')) },
  };
}

function validar(c) {
  if (c.gym.length !== 3) return 'Elige exactamente 3 días de gimnasio.';
  if (!valida(c.inicio)) return 'Revisa la fecha de inicio.';
  if (!valida(c.comp.ini)) return 'Revisa la fecha de la competencia.';
  if (c.comp.ini <= c.inicio) return 'La competencia tiene que ser después del inicio del plan.';
  if (c.comp.fin && c.comp.fin < c.comp.ini) return 'La fecha de fin no puede ser antes del inicio de la competencia.';
  return null;
}

function interacciones(raiz) {
  raiz.addEventListener('click', e => {
    const s = e.target.closest('[data-seg] button');
    if (s) { $$('button', s.parentElement).forEach(b => b.classList.toggle('act', b === s)); vibrar(); return; }
    const d = e.target.closest('[data-dias] button');
    if (!d) return;
    const grupo = d.parentElement.dataset.dias;
    if (grupo === 'gym' && !d.classList.contains('act') && $$('.act', d.parentElement).length >= 3) { aviso('Solo 3 días de gimnasio por semana', 'info'); return; }
    d.classList.toggle('act'); vibrar();
    if (grupo === 'gym') revisarGym(raiz);
  });
}

function revisarGym(raiz) {
  const g = $$('[data-dias="gym"] .act', raiz).map(b => b.dataset.v);
  const msg = $('#gym-msg', raiz);
  const malo = g.length > 1 && diasSeguidos(g);
  msg.classList.toggle('alerta', malo);
  msg.textContent = malo ? '⚠️ Tienes dos días de gimnasio seguidos. Siempre tiene que haber al menos un día libre entre dos sesiones.' : 'En orden: el primero es la sesión A, el segundo la B y el tercero la C.';
  return !malo;
}

// ── Bienvenida ───────────────────────────────────────────────
export function renderBienvenida(v) {
  const c = { ...DEFAULTS, uManc: 'kg', uDisco: 'kg' };
  v.innerHTML = `
    <div class="bienvenida">
      <div class="logo-grande"><img src="icons/icon.svg" alt=""></div>
      <h1>Fuerza en Seco</h1>
      <p class="txt2">Tu preparación en el gimnasio para nadar más rápido: salidas, virajes, patada y brazada de pecho. Primero, unos datos.</p>
    </div>
    <form id="form" novalidate>${formulario(c, false)}
      <button class="btn-pri" type="submit">${ico('play')}¡Arrancar!</button>
    </form>`;
  interacciones($("#form", v));
  $('#form').onsubmit = e => {
    e.preventDefault();
    const n = leer(v, { ...c, sonido: true, vibracion: true, barraZ: [10, 20], otras: [] });
    const err = validar(n);
    if (err) return aviso(err, 'info', 3500);
    if (!revisarGym(v)) return aviso('Deja un día libre entre sesiones de gimnasio', 'info', 3500);
    S().config = n; guardar();
    confeti(false);
    location.hash = 'hoy';
    dispatchEvent(new Event('fs:refrescar'));
  };
}

// ── Ajustes ──────────────────────────────────────────────────
export function renderAjustes(v) {
  const c = C();
  v.innerHTML = `
    <div class="top"><p class="saludo">Tu plan, a tu medida</p><h1>Ajustes</h1></div>
    <form id="form" novalidate>${formulario(c, true)}
      <section class="card">
        <label class="sw"><span><b>Sonido</b><small>Pitidos al terminar descansos y temporizadores</small></span><input type="checkbox" name="sonido" ${c.sonido !== false ? 'checked' : ''}><i></i></label>
        <label class="sw"><span><b>Vibración</b><small>Vibra al terminar cada descanso</small></span><input type="checkbox" name="vibracion" ${c.vibracion !== false ? 'checked' : ''}><i></i></label>
        <label class="sw"><span><b>Modo ligero</b><small>Sin olas, burbujas ni confeti, para que vaya fluida en cualquier teléfono</small></span><input type="checkbox" name="ligero" ${c.ligero !== false ? 'checked' : ''}><i></i></label>
        <button type="button" class="btn-sec" data-a="probar">${ico('play')}Probar sonido y vibración</button>
        <p class="peq txt2">Si no oyes nada, sube el volumen multimedia del teléfono (no el del timbre).</p>
        <button type="button" class="btn-sec" data-a="notif">${ico('info')}${'Notification' in window && Notification.permission === 'granted' ? 'Notificaciones activadas' : 'Activar notificaciones'}</button>
        <p class="peq txt2">Sirven para avisarte cuando termina un descanso con la app en segundo plano. No siempre llegan a tiempo: en Samsung ve a Ajustes del teléfono → Aplicaciones → Chrome → Batería → "Sin restricciones".</p>
      </section>
      <button class="btn-pri" type="submit">${ico('check')}Guardar cambios</button>
    </form>

    <section class="card">
      <h3 class="sub-t">Tus datos</h3>
      <p class="peq txt2">Todo se guarda solo en este teléfono. Haz un respaldo de vez en cuando.</p>
      <div class="fila-2">
        <button class="btn-sec" data-a="exportar">${ico('descargar')}Exportar</button>
        <button class="btn-sec" data-a="importar">${ico('copiar')}Importar</button>
      </div>
      <input type="file" id="archivo" accept="application/json,.json" hidden>
    </section>
    <section class="card peligro"><button class="btn-peligro" data-a="reiniciar">Borrar todo y empezar de cero</button></section>
    <p class="pie">Fuerza en Seco · funciona sin internet</p>`;
  interacciones($("#form", v));
  revisarGym($('#form', v));
  $('#form').onsubmit = e => {
    e.preventDefault();
    const n = leer(v, c);
    n.sonido = $('[name="sonido"]', v).checked;
    n.vibracion = $('[name="vibracion"]', v).checked;
    n.ligero = $('[name="ligero"]', v).checked;
    document.documentElement.classList.toggle('ligero', n.ligero || matchMedia('(prefers-reduced-motion: reduce)').matches);
    const err = validar(n);
    if (err) return aviso(err, 'info', 3500);
    if (!revisarGym(v)) return aviso('Deja un día libre entre sesiones de gimnasio', 'info', 3500);
    S().config = n; guardar();
    aviso('Guardado. El plan se recalculó.', 'check');
  };
  v.onclick = e => {
    const b = e.target.closest('[data-a]');
    if (!b) return;
    if (b.dataset.a === 'exportar') {
      const url = URL.createObjectURL(new Blob([exportar()], { type: 'application/json' }));
      const a = Object.assign(document.createElement('a'), { href: url, download: `fuerza-en-seco-${hoy()}.json` });
      a.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
    }
    if (b.dataset.a === 'importar') $('#archivo', v).click();
    if (b.dataset.a === 'probar') { sonar.fin(); try { navigator.vibrate?.([200, 100, 200]); } catch { } aviso('¿Lo oíste? Si no, sube el volumen multimedia', 'play', 3500); }
    if (b.dataset.a === 'notif' && 'Notification' in window) Notification.requestPermission().then(r => { aviso(r === 'granted' ? 'Notificaciones activadas' : 'No se activaron las notificaciones', 'info'); dispatchEvent(new Event('fs:refrescar')); });
    if (b.dataset.a === 'reiniciar' && confirm('¿Seguro? Se borran todas tus sesiones, pesos y ajustes.')) {
      reiniciar(); location.hash = 'bienvenida'; dispatchEvent(new Event('fs:refrescar'));
    }
  };
  $('#archivo', v).onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    try { importar(await f.text()); aviso('Datos importados', 'check'); dispatchEvent(new Event('fs:refrescar')); }
    catch (err) { aviso(err.message || 'No se pudo importar', 'info', 3500); }
  };
}
