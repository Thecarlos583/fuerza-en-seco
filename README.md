# Fuerza en Seco

App web personal (PWA) de preparación física en seco para Juan, nadador de pecho (50 y 100 pecho, 50 libre), con miras a los Juegos Deportivos Nacionales del 15 de noviembre de 2026. HTML, CSS y JS puro, sin build y sin ningún recurso externo. Después de abrirla una vez, funciona al 100% en modo avión. Los datos se guardan solo en el teléfono (localStorage).

## Estructura

```
index.html          pantallas fijas (descanso, temporizador de trabajo, pestañas)
manifest.json       datos de la app instalable (Chrome en Android)
sw.js               caché para usarla sin internet
css/styles.css      todo el diseño (tema acuático)
icons/              ícono propio (SVG + PNG 192/512 + maskable)
js/data.js          ← EL PLAN: ejercicios, sesiones A/B/C, rutinas, Plan B, fases, pesos
js/poses.js         ← LAS ANIMACIONES: poses clave de cada ejercicio ("Ver cómo se hace")
js/anim.js          motor de animación de la figura en SVG
js/plan.js          periodización hacia atrás desde la competencia, qué toca cada día, mover sesión
js/pesos.js         peso inicial, topes, escalones, kg/lb, calculadora de discos
js/hoy.js           pantalla Hoy con los ejercicios del día (estilo Mi Rutina), Ver otro día, Plan B
js/sesion.js        tarjetas de ejercicio, series, descansos, cambiar ejercicio, chequeo, RPE
js/marcas.js        Mis marcas: tiempos de natación por prueba y piscina, metas, gráfica
js/progreso.js      pruebas físicas, RPE por sesión, calendario y pesos de trabajo
js/entrenador.js    resumen para el entrenador de natación (plan, por qué de cada ejercicio, progreso)
js/graficas.js      gráficas en SVG
js/guia.js · js/ajustes.js
js/timer.js         temporizadores de descanso (ola) y de trabajo
js/cuerpo.js        mapa del cuerpo en SVG
js/store.js         guardado en localStorage
js/util.js          sonido, vibración, confeti, burbujas, hojas, íconos
```

## Cambiar el plan

Sesiones A y B con máquinas; C es el día sin máquinas (mancuernas, balón y peso corporal). Todo está en `js/data.js`; las animaciones, en `js/poses.js`. Después de editar cualquier archivo, sube `VERSION` en `sw.js` (por ejemplo, `fuerza-en-seco-v2`) para que el teléfono descargue lo nuevo. El teléfono toma la versión nueva la segunda vez que abre la app.

## Probar en la PC

```
python -m http.server 8770
```
Abre `http://localhost:8770`. Para simular otro día: `http://localhost:8770/?fecha=2026-11-09`.

## Instalar en el teléfono (Android + Chrome)

1. Abre el enlace en Chrome.
2. Toca **Instalar app** en la pantalla Hoy (o el menú ⋮ → *Instalar aplicación*).
3. Ábrela una vez con internet para que se guarde completa.
4. Comprobación: activa el modo avión, cierra la app y vuelve a abrirla. Debe cargar Hoy y la sesión del día igual que con internet.
