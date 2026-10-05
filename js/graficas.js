// Gráficas en SVG (sin librerías). Un solo eje por gráfica; tocar un punto o barra muestra su valor.
import { fechaCorta } from './fechas.js';
import { vibrar } from './util.js';

export const COL = { serie: 'var(--aqua)', meta: 'var(--amarillo)', alto: 'var(--coral)' };
const esc = s => String(s).replace(/"/g, '&quot;');

// Línea de tiempos de una prueba: más abajo = más rápido. Línea punteada en la meta.
export function lineaTiempos(h, { meta = null, fmt, id }) {
  const W = 320, H = 170, L = 46, R = 14, T = 16, B = 26;
  const vals = h.map(x => x.cs).concat(meta ? [meta] : []);
  let mn = Math.min(...vals), mx = Math.max(...vals);
  const pad = Math.max(30, (mx - mn) * 0.15);
  mn -= pad; mx += pad;
  const X = i => h.length === 1 ? (L + W - R) / 2 : L + (i / (h.length - 1)) * (W - L - R);
  const Y = v => T + ((v - mn) / (mx - mn)) * (H - T - B) * -1 + (H - T - B);
  const pts = h.map((x, i) => [X(i), Y(x.cs)]);
  const marcas = [mn + pad, (mn + mx) / 2, mx - pad];
  const linea = h.length > 1 ? `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" style="stroke:${COL.serie}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` : '';
  const mejor = Math.min(...h.map(x => x.cs));
  const ancho = (W - L - R) / Math.max(2, h.length);
  return `<figure class="grafica">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución de tiempos">
      ${marcas.map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="g-grid"/><text x="${L - 6}" y="${Y(v) + 3.5}" text-anchor="end" class="g-eje">${fmt(Math.round(v))}</text>`).join('')}
      ${meta ? `<line x1="${L}" x2="${W - R}" y1="${Y(meta)}" y2="${Y(meta)}" class="g-meta"/><text x="${W - R}" y="${Y(meta) - 5}" text-anchor="end" class="g-eje">Meta ${fmt(meta)}</text>` : ''}
      ${linea}
      ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${h[i].cs === mejor ? 5.5 : 4}" style="fill:${h[i].cs === mejor ? COL.meta : COL.serie};stroke:var(--card);stroke-width:2"/>`).join('')}
      <text x="${L}" y="${H - 6}" class="g-eje">${fechaCorta(h[0].f)}</text>
      ${h.length > 1 ? `<text x="${W - R}" y="${H - 6}" text-anchor="end" class="g-eje">${fechaCorta(h.at(-1).f)}</text>` : ''}
      ${pts.map(([x], i) => `<rect class="g-hit" data-tip="${esc(`<b>${fmt(h[i].cs)}</b> · ${fechaCorta(h[i].f)}${h[i].tipo === 'comp' ? ' · competencia' : ''}`)}" data-x="${x}" x="${x - ancho / 2}" y="${T}" width="${ancho}" height="${H - T - B}" fill="transparent"/>`).join('')}
      <line class="g-cruz" x1="0" x2="0" y1="${T}" y2="${H - B}" style="opacity:0"/>
    </svg>
    <figcaption class="g-tip">${h.length > 1 ? 'Más abajo = más rápido. El punto amarillo es tu mejor marca.' : 'Agrega más tiempos para ver la curva.'}</figcaption>
  </figure>`;
}

// Barras de RPE por sesión, con la zona ideal (6-8) marcada
export function barrasRPE(h) {
  const W = 320, H = 150, L = 22, R = 8, T = 10, B = 24;
  const n = Math.max(h.length, 6), paso = (W - L - R) / n, bw = Math.min(18, paso - 4);
  const Y = v => T + (1 - v / 10) * (H - T - B);
  return `<figure class="grafica">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Esfuerzo (RPE) de cada sesión">
      <rect x="${L}" y="${Y(8)}" width="${W - L - R}" height="${Y(6) - Y(8)}" class="g-zona"/>
      ${[0, 5, 10].map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="g-grid"/><text x="${L - 5}" y="${Y(v) + 3.5}" text-anchor="end" class="g-eje">${v}</text>`).join('')}
      <text x="${W - R}" y="${Y(8) - 4}" text-anchor="end" class="g-eje">zona ideal 6-8</text>
      ${h.map((x, i) => {
        const cx = L + paso * i + paso / 2, alto = x.rpe >= 9;
        return `<rect x="${cx - bw / 2}" y="${Y(x.rpe)}" width="${bw}" height="${Y(0) - Y(x.rpe)}" rx="4" style="fill:${alto ? COL.alto : COL.serie}"/>
          ${alto ? `<text x="${cx}" y="${Y(x.rpe) - 4}" text-anchor="middle" class="g-val">!</text>` : ''}
          <rect class="g-hit" data-tip="${esc(`<b>RPE ${x.rpe}</b> · Sesión ${x.letra} · ${fechaCorta(x.f)}${alto ? ' · muy alto' : ''}`)}" data-x="${cx}" x="${cx - paso / 2}" y="${T}" width="${paso}" height="${H - T - B}" fill="transparent"/>`;
      }).join('')}
      ${h.length ? `<text x="${L}" y="${H - 6}" class="g-eje">${fechaCorta(h[0].f)}</text><text x="${W - R}" y="${H - 6}" text-anchor="end" class="g-eje">${fechaCorta(h.at(-1).f)}</text>` : ''}
      <line class="g-cruz" x1="0" x2="0" y1="${T}" y2="${H - B}" style="opacity:0"/>
    </svg>
    <figcaption class="g-tip">Toca una barra para ver la sesión.</figcaption>
  </figure>`;
}

// Línea simple de una serie en el tiempo (peso corporal). Tocar un punto muestra su valor.
export function linea(h, { fmt, desc }) {
  const W = 320, H = 150, L = 46, R = 14, T = 14, B = 26;
  const vals = h.map(x => x.v);
  let mn = Math.min(...vals), mx = Math.max(...vals);
  const pad = Math.max(0.5, (mx - mn) * 0.2);
  mn -= pad; mx += pad;
  const X = i => h.length === 1 ? (L + W - R) / 2 : L + (i / (h.length - 1)) * (W - L - R);
  const Y = v => T + (1 - (v - mn) / (mx - mn)) * (H - T - B);
  const pts = h.map((x, i) => [X(i), Y(x.v)]);
  const ancho = (W - L - R) / Math.max(2, h.length);
  const marcas = [mn + pad, (mn + mx) / 2, mx - pad];
  return `<figure class="grafica">
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(desc)}">
      ${marcas.map(v => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="g-grid"/><text x="${L - 6}" y="${Y(v) + 3.5}" text-anchor="end" class="g-eje">${fmt(Math.round(v * 10) / 10)}</text>`).join('')}
      <polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" style="stroke:${COL.serie}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === pts.length - 1 ? 5 : 3.5}" style="fill:${COL.serie};stroke:var(--card);stroke-width:2"/>`).join('')}
      <text x="${L}" y="${H - 6}" class="g-eje">${fechaCorta(h[0].f)}</text>
      <text x="${W - R}" y="${H - 6}" text-anchor="end" class="g-eje">${fechaCorta(h.at(-1).f)}</text>
      ${pts.map(([x], i) => `<rect class="g-hit" data-tip="${esc(`<b>${fmt(h[i].v)}</b> · ${fechaCorta(h[i].f)}`)}" data-x="${x}" x="${x - ancho / 2}" y="${T}" width="${ancho}" height="${H - T - B}" fill="transparent"/>`).join('')}
      <line class="g-cruz" x1="0" x2="0" y1="${T}" y2="${H - B}" style="opacity:0"/>
    </svg>
    <figcaption class="g-tip">Toca un punto para ver el peso de esa semana.</figcaption>
  </figure>`;
}

// Mini gráfica de tendencia (pesos de un ejercicio), sin ejes
export function mini(vals) {
  if (vals.length < 2) return '';
  const W = 84, H = 30, mn = Math.min(...vals), mx = Math.max(...vals), r = mx - mn || 1;
  const pts = vals.map((v, i) => [2 + (i / (vals.length - 1)) * (W - 6), H - 4 - ((v - mn) / r) * (H - 8)]);
  const [ux, uy] = pts.at(-1);
  return `<svg class="mini-g" viewBox="0 0 ${W} ${H}" aria-hidden="true"><polyline points="${pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}" fill="none" style="stroke:${COL.serie}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${ux.toFixed(1)}" cy="${uy.toFixed(1)}" r="3" style="fill:${COL.serie}"/></svg>`;
}

// Toque en cualquier gráfica: muestra el valor y una guía vertical
export function tocarGrafica(ev) {
  const hit = ev.target.closest('.g-hit');
  if (!hit) return false;
  const fig = hit.closest('.grafica');
  const cruz = fig.querySelector('.g-cruz');
  cruz.setAttribute('x1', hit.dataset.x); cruz.setAttribute('x2', hit.dataset.x); cruz.style.opacity = 1;
  fig.querySelector('.g-tip').innerHTML = hit.dataset.tip;
  vibrar(6);
  return true;
}
