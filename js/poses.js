// ─────────────────────────────────────────────────────────────
// Animaciones: poses clave de cada ejercicio (ver los ángulos en js/anim.js).
// ms: tiempo hasta la pose siguiente · pausa: tiempo quieto en la pose
// punto: zona que se ilumina en coral con su texto (rodilla, cadera, espalda, pies, hombro, manos, codo, cabeza)
// como: 'id' usa la animación de otro ejercicio parecido
// ─────────────────────────────────────────────────────────────
export const ANIM = {
  cajon: { vistas: ['lado', 'frente'], x0: 62, sigue: 'cadera', equipo: [{ tipo: 'cajon', x: 120, ancho: 46, alto: 30 }],
    poses: [
      { n: 'Párate frente al cajón, pies al ancho de la cadera', torso: 0, cadera: 0, rodilla: 0, hombro: 0, codo: 10, pausa: 400, ms: 500 },
      { n: 'Brazos atrás y baja un poco la cadera', torso: 38, cadera: 82, rodilla: 85, hombro: -55, codo: 10, pausa: 150, ms: 240 },
      { n: 'Salta explosivo llevando los brazos arriba', torso: 12, cadera: 8, rodilla: 4, punta: 38, hombro: 150, codo: 15, dx: 5, dy: 2, ms: 220 },
      { n: 'Sube las rodillas en el aire', torso: 22, cadera: 100, rodilla: 115, punta: 15, hombro: 105, codo: 25, dx: 52, dy: 50, ms: 220 },
      { n: 'Cae suave en el cajón, rodillas hacia afuera', torso: 36, cadera: 86, rodilla: 90, hombro: 55, codo: 30, dx: 86, dy: 30, pausa: 800, ms: 500, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas hacia afuera' } },
      { n: 'Párate completo arriba', torso: 0, cadera: 0, rodilla: 0, hombro: 0, codo: 10, dx: 86, dy: 30, pausa: 300, ms: 700 },
      { n: 'Baja caminando: primero un pie', torso: 20, cadera: 85, rodilla: 120, cadera2: -10, rodilla2: 0, punta2: 35, hombro: 25, codo: 15, hombro2: -20, dx: 86, dy: 30, pausa: 150, ms: 550, punto: { zona: 'pies', txt: 'Nunca bajes saltando' } },
      { n: 'Luego el otro pie, y vuelve a tu marca', apoyo: 2, torso: 8, cadera: 55, rodilla: 85, cadera2: 0, rodilla2: 5, hombro: -15, hombro2: 15, codo: 15, dx: 48, dy: 0, ms: 450 },
    ] },
  goblet: { vistas: ['lado', 'frente'], x0: 128, mano: 'goblet', juntas: true, ancho: 15, sigue: 'cadera',
    poses: [
      { n: 'De pie, mancuerna pegada al pecho', torso: 4, cadera: 4, rodilla: 0, hombro: 6, codo: 145, pausa: 600, ms: 1500, punto: { zona: 'espalda', txt: 'Pecho alto' } },
      { n: 'Baja en 3 segundos, la cadera va atrás y abajo', torso: 18, cadera: 56, rodilla: 62, hombro: 20, codo: 145, ms: 1500, punto: { zona: 'rodilla', txt: 'Rodillas en la dirección de los pies' } },
      { n: 'Abajo: talones pegados al piso', torso: 32, cadera: 112, rodilla: 118, hombro: 34, codo: 145, pausa: 450, ms: 550, punto: { zona: 'pies', txt: 'Talones abajo' } },
      { n: 'Sube rápido empujando el piso', torso: 14, cadera: 45, rodilla: 50, hombro: 16, codo: 145, ms: 300 },
    ] },
  rdl: { vistas: ['lado', 'frente'], x0: 128, mano: 'mancuernas', ancho: 11, sigue: 'cadera',
    poses: [
      { n: 'De pie, mancuernas pegadas a los muslos', torso: 0, cadera: 0, rodilla: 8, hombro: 0, codo: 0, hF: 6, hF2: 6, pausa: 600, ms: 900 },
      { n: 'Lleva la cadera atrás, rodillas apenas dobladas', torso: 30, cadera: 48, rodilla: 18, hombro: 26, codo: 0, hF: 6, hF2: 6, ms: 900, punto: { zona: 'cadera', txt: 'La cadera va atrás, no hacia abajo' } },
      { n: 'Baja hasta media pierna con la espalda recta', torso: 66, cadera: 96, rodilla: 24, hombro: 58, codo: 0, hF: 6, hF2: 6, pausa: 500, ms: 700, punto: { zona: 'espalda', txt: 'Espalda recta todo el tiempo' } },
      { n: 'Sube apretando el glúteo', torso: 28, cadera: 45, rodilla: 17, hombro: 24, codo: 0, hF: 6, hF2: 6, ms: 600, punto: { zona: 'manos', txt: 'Mancuernas pegadas a las piernas' } },
    ] },
  // ── Saltos ─────────────────────────────────────────────────
  svertical: { vistas: ['lado', 'frente'], x0: 120,
    poses: [
      { n: 'De pie, pies al ancho de la cadera', hombro: 0, codo: 10, pausa: 400, ms: 500 },
      { n: 'Brazos atrás y baja la cadera', torso: 38, cadera: 82, rodilla: 85, hombro: -55, codo: 10, pausa: 100, ms: 220 },
      { n: 'Despega explosivo, brazos arriba', torso: 8, cadera: 5, rodilla: 2, punta: 40, hombro: 165, codo: 10, dy: 2, ms: 200 },
      { n: 'Estírate completo en el aire', torso: 4, cadera: 6, rodilla: 6, punta: 30, hombro: 175, codo: 5, dy: 24, ms: 260 },
      { n: 'Cae suave', torso: 30, cadera: 70, rodilla: 75, hombro: 40, codo: 20, pausa: 450, ms: 600, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas alineadas con los pies' } },
    ] },
  scmpared: { vistas: ['frente', 'lado'], x0: 120, brazosF: true, sigue: 'cadera', equipo: [{ tipo: 'muro', x: 148, vista: 'frente' }],
    poses: [
      { n: 'De lado a la pared', hombro: 0, codo: 10, hF: 10, hF2: 10, pausa: 400, ms: 300 },
      { n: 'Baja rápido con los brazos abajo', torso: 30, cadera: 75, rodilla: 80, hombro: -50, codo: 10, hF: 20, hF2: 20, ms: 200 },
      { n: 'Salta y toca lo más alto que puedas', torso: 4, cadera: 4, rodilla: 2, punta: 40, hombro: 175, codo: 0, hombro2: 20, hF: 30, hF2: 170, dy: 16, ms: 260, punto: { zona: 'manos', txt: 'Marca la altura y trata de llegar igual cada vez' } },
      { n: 'Cae suave', torso: 28, cadera: 65, rodilla: 70, hombro: 40, codo: 20, hF: 20, hF2: 30, pausa: 500, ms: 600, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas alineadas' } },
    ] },
  longitud: { vistas: ['lado', 'frente'], x0: 30, sigue: 'cadera',
    poses: [
      { n: 'Pies al ancho de la cadera', hombro: 0, codo: 10, pausa: 400, ms: 500 },
      { n: 'Brazos atrás y baja la cadera', torso: 45, cadera: 88, rodilla: 82, hombro: -60, codo: 10, pausa: 100, ms: 220 },
      { n: 'Salta lo más lejos posible, brazos adelante', torso: 42, cadera: 12, rodilla: 4, punta: 45, hombro: 160, codo: 10, dx: 10, dy: 3, ms: 220 },
      { n: 'En el aire, lleva las rodillas adelante', torso: 20, cadera: 95, rodilla: 90, punta: 10, hombro: 120, codo: 20, dx: 70, dy: 30, ms: 260 },
      { n: '"Clava" la caída y aguanta 2 s', torso: 38, cadera: 88, rodilla: 84, hombro: 70, codo: 20, dx: 120, pausa: 1000, ms: 500, punto: { zona: 'rodilla', txt: 'Clava la caída 2 s, pecho no tan adelante' } },
      { n: 'Vuelve caminando a tu marca', hombro: 0, codo: 10, dx: 120, pausa: 300, ms: 900 },
    ] },
  cuclillas: { vistas: ['lado', 'frente'], x0: 60, sigue: 'cadera',
    poses: [
      { n: 'Baja a media sentadilla, brazos atrás', torso: 30, cadera: 70, rodilla: 72, hombro: -35, codo: 10, pausa: 300, ms: 220 },
      { n: 'Salta corto hacia adelante', torso: 24, cadera: 14, rodilla: 10, punta: 30, hombro: 90, codo: 15, dx: 22, dy: 12, ms: 220 },
      { n: 'Cae suave en media sentadilla', torso: 30, cadera: 70, rodilla: 72, hombro: 30, codo: 10, dx: 44, pausa: 600, ms: 400, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas alineadas con los pies' } },
      { n: 'Párate y vuelve a tu marca', hombro: 0, codo: 10, dx: 44, pausa: 200, ms: 900 },
    ] },
  sstream: { vistas: ['lado', 'frente'], x0: 120, juntas: true, sigue: 'cadera',
    poses: [
      { n: 'Brazos arriba en streamline, piernas juntas', hombro: 180, codo: 0, ancho: 5, pausa: 400, ms: 450 },
      { n: 'Baja un poco sin abrir los brazos', torso: 25, cadera: 62, rodilla: 66, hombro: 180, codo: 0, ancho: 5, pausa: 100, ms: 220 },
      { n: 'Salta vertical', torso: 2, cadera: 2, rodilla: 2, punta: 40, hombro: 180, codo: 0, ancho: 5, dy: 16, ms: 260 },
      { n: 'Cae suave, brazos siempre juntos', torso: 25, cadera: 58, rodilla: 62, hombro: 180, codo: 0, ancho: 5, pausa: 400, ms: 500, punto: { zona: 'manos', txt: 'No separes los brazos en ningún momento' } },
    ] },
  squatJump: { vistas: ['lado', 'frente'], x0: 120,
    poses: [
      { n: 'De pie, manos al pecho', hombro: 40, codo: 90, pausa: 300, ms: 500 },
      { n: 'Baja a media sentadilla y pausa 2 s', torso: 34, cadera: 92, rodilla: 98, hombro: 50, codo: 80, pausa: 1400, ms: 200, punto: { zona: 'cadera', txt: 'Pausa 2 s abajo, sin rebotar' } },
      { n: 'Salta explosivo', torso: 4, cadera: 4, rodilla: 4, punta: 40, hombro: 30, codo: 70, dy: 40, ms: 300 },
      { n: 'Cae suave', torso: 28, cadera: 65, rodilla: 70, hombro: 45, codo: 80, pausa: 400, ms: 600, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas alineadas' } },
    ] },
  sjSinBrazos: { vistas: ['lado', 'frente'], x0: 120, brazosF: true, sigue: 'cadera',
    poses: [
      { n: 'Manos en la cintura', hombro: -25, codo: 95, hF: 40, cF: -80, pausa: 400, ms: 500 },
      { n: 'Baja a media sentadilla y pausa 2 s', torso: 34, cadera: 92, rodilla: 98, hombro: -10, codo: 95, hF: 40, cF: -80, pausa: 1400, ms: 200, punto: { zona: 'cadera', txt: 'Pausa 2 s abajo, sin rebotar' } },
      { n: 'Salta explosivo sin usar los brazos', torso: 4, cadera: 4, rodilla: 4, punta: 40, hombro: -25, codo: 95, hF: 40, cF: -80, dy: 34, ms: 300 },
      { n: 'Cae suave', torso: 28, cadera: 65, rodilla: 70, hombro: -15, codo: 95, hF: 40, cF: -80, pausa: 400, ms: 600, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas alineadas' } },
    ] },
  sjCasa: { vistas: ['lado', 'frente'], x0: 120, sigue: 'cadera',
    poses: [
      { n: 'De pie, pies al ancho de la cadera', hombro: 0, codo: 10, pausa: 300, ms: 500 },
      { n: 'Media sentadilla y pausa 1 s', torso: 32, cadera: 85, rodilla: 90, hombro: -40, codo: 10, pausa: 1000, ms: 200, punto: { zona: 'cadera', txt: 'Pausa 1 s, sin rebotar' } },
      { n: 'Salta explosivo con los brazos arriba', torso: 4, cadera: 4, rodilla: 2, punta: 40, hombro: 160, codo: 10, dy: 32, ms: 300 },
      { n: 'Cae suave', torso: 28, cadera: 65, rodilla: 70, hombro: 40, codo: 20, pausa: 400, ms: 600, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas alineadas' } },
    ] },
  cajonSentado: { vistas: ['lado', 'frente'], x0: 96, sigue: 'cadera', equipo: [{ tipo: 'banco', x: 28, ancho: 44, alto: 36, vista: 'lado' }, { tipo: 'rect', x: 92, y: 146, w: 56, h: 5, vista: 'frente' }, { tipo: 'cajon', x: 150, ancho: 44, alto: 30 }],
    poses: [
      { n: 'Sentado en el banco, frente al cajón', torso: 10, cadera: 90, rodilla: 90, hombro: 0, codo: 20, pausa: 600, ms: 300 },
      { n: 'Inclínate un poco con los brazos atrás', torso: 32, cadera: 100, rodilla: 86, hombro: -50, codo: 10, pausa: 100, ms: 220 },
      { n: 'Párate y salta explosivo, brazos arriba', torso: 12, cadera: 8, rodilla: 4, punta: 38, hombro: 150, codo: 15, dx: 8, dy: 2, ms: 220 },
      { n: 'Sube las rodillas en el aire', torso: 22, cadera: 100, rodilla: 115, punta: 15, hombro: 105, codo: 25, dx: 50, dy: 48, ms: 220 },
      { n: 'Cae suave en el cajón', torso: 36, cadera: 86, rodilla: 90, hombro: 55, codo: 30, dx: 74, dy: 30, pausa: 800, ms: 500, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas hacia afuera' } },
      { n: 'Párate completo arriba', hombro: 0, codo: 10, dx: 74, dy: 30, pausa: 300, ms: 600 },
      { n: 'Baja caminando, un pie y luego el otro', torso: 20, cadera: 85, rodilla: 120, cadera2: -10, rodilla2: 0, punta2: 35, hombro: 25, codo: 15, hombro2: -20, dx: 74, dy: 30, pausa: 150, ms: 600, punto: { zona: 'pies', txt: 'Nunca bajes saltando' } },
      { n: 'Vuelve y siéntate otra vez', hombro: 0, codo: 10, pausa: 200, ms: 600 },
    ] },
  pogo: { vistas: ['lado', 'frente'], x0: 120, sigue: 'pies',
    poses: [
      { n: 'Toca el piso un instante, piernas casi rectas', torso: 3, cadera: 5, rodilla: 8, punta: 22, hombro: 20, codo: 80, ms: 170 },
      { n: 'Rebota corto en la punta de los pies', torso: 2, cadera: 2, rodilla: 2, punta: 45, hombro: 15, codo: 80, dy: 10, ms: 170, punto: { zona: 'pies', txt: 'Toca el piso lo menos posible' } },
    ] },

  // ── Flexiones ──────────────────────────────────────────────
  flexExpl: { vistas: ['lado'], x0: 40,
    poses: [
      { n: 'Cuerpo recto, manos bajo los hombros', giro: 74, punta: 14, hombro: 90, codo: 0, pausa: 300, ms: 900 },
      { n: 'Baja controlado', giro: 80, punta: 10, hombro: 40, codo: 95, pausa: 150, ms: 250, punto: { zona: 'cadera', txt: 'Cadera alineada, sin dejarla caer' } },
      { n: 'Empuja explosivo, lo más rápido que puedas', giro: 62, punta: 18, hombro: 105, codo: 0, ms: 250 },
    ] },
  flexCasa: { como: 'flexRapidas' },
  flexRapidas: { vistas: ['lado'], x0: 40, sigue: 'hombro', equipo: [{ tipo: 'colchoneta', x: 26, ancho: 180 }],
    poses: [
      { n: 'Cuerpo recto, manos bajo los hombros', giro: 74, punta: 14, hombro: 90, codo: 0, pausa: 300, ms: 700 },
      { n: 'Baja controlado', giro: 80, punta: 10, hombro: 40, codo: 95, pausa: 100, ms: 260, punto: { zona: 'cadera', txt: 'Cadera alineada, sin dejarla caer' } },
      { n: 'Sube lo más rápido que puedas', giro: 74, punta: 14, hombro: 90, codo: 0, ms: 200 },
    ] },

  // ── Máquinas de pierna ─────────────────────────────────────
  prensa: { vistas: ['lado'], ancla: 'cadera', x0: 82, y0: 140,
    equipo: [{ tipo: 'rect', x: 44, y: 147, w: 52, h: 6 }, { tipo: 'linea', x1: 66, y1: 153, x2: 66, y2: 182 }, { tipo: 'respaldo' }, { tipo: 'carro', riel: 135 }],
    poses: [
      { n: 'Espalda pegada, piernas casi estiradas', torso: -50, cadera: 85, rodilla: 6, punta: -135, hombro: 75, codo: 10, pausa: 400, ms: 1600 },
      { n: 'Baja hasta que las rodillas queden a 90°', torso: -50, cadera: 130, rodilla: 92, punta: -135, hombro: 75, codo: 10, pausa: 300, ms: 900, punto: { zona: 'cadera', txt: 'La cadera no se despega del asiento' } },
      { n: 'Empuja con todo el pie, sin bloquear', torso: -50, cadera: 92, rodilla: 14, punta: -135, hombro: 75, codo: 10, ms: 400, punto: { zona: 'rodilla', txt: 'Sin bloquear las rodillas arriba' } },
    ] },
  smith: { vistas: ['lado', 'frente'], x0: 128, mano: 'barra', ancho: 15, sigue: 'cadera', equipo: [{ tipo: 'linea', x1: 116, y1: 14, x2: 116, y2: 182, vista: 'lado' }, { tipo: 'linea', x1: 72, y1: 14, x2: 72, y2: 182, vista: 'frente' }, { tipo: 'linea', x1: 168, y1: 14, x2: 168, y2: 182, vista: 'frente' }],
    poses: [
      { n: 'Barra en la espalda, pies un poco adelante', torso: 4, cadera: 4, rodilla: 2, hombro: -55, codo: 140, pausa: 500, ms: 1500 },
      { n: 'Baja controlado', torso: 18, cadera: 60, rodilla: 66, hombro: -48, codo: 140, ms: 700, punto: { zona: 'rodilla', txt: 'Rodillas en la dirección de los pies' } },
      { n: 'Abajo, talones pegados al piso', torso: 26, cadera: 100, rodilla: 106, hombro: -42, codo: 140, pausa: 300, ms: 600, punto: { zona: 'pies', txt: 'Talones pegados al piso' } },
      { n: 'Sube rápido', torso: 10, cadera: 35, rodilla: 38, hombro: -50, codo: 140, ms: 400 },
    ] },
  // ── Activación ─────────────────────────────────────────────
  mtobillo: { vistas: ['lado'], x0: 150, equipo: [{ tipo: 'muro', x: 172 }],
    poses: [
      { n: 'Pie cerca de la pared', torso: 6, cadera: 28, rodilla: 30, cadera2: -24, rodilla2: 18, punta2: 35, hombro: 70, codo: 30, pausa: 300, ms: 900 },
      { n: 'Lleva la rodilla hacia la pared', torso: 8, cadera: 48, rodilla: 78, cadera2: -24, rodilla2: 22, punta2: 40, hombro: 75, codo: 40, pausa: 400, ms: 900, punto: { zona: 'pies', txt: 'El talón no se despega del piso' } },
    ] },
  puente: { vistas: ['lado'], x0: 168, sigue: 'cadera', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Boca arriba, rodillas dobladas y pies apoyados', torso: -95, cadera: 60, rodilla: 125, hombro: 0, codo: 0, pausa: 400, ms: 700 },
      { n: 'Sube la cadera empujando con los talones', torso: -112, cadera: 0, rodilla: 112, hombro: 0, codo: 0, pausa: 1200, ms: 900, punto: { zona: 'cadera', txt: 'Aprieta el glúteo 2 s, sin arquear la espalda' } },
    ] },
  puentePies: { vistas: ['lado'], x0: 196, sigue: 'cadera', equipo: [{ tipo: 'banco', x: 150, ancho: 60, alto: 30 }, { tipo: 'colchoneta', x: 30, ancho: 120 }],
    poses: [
      { n: 'Boca arriba con los pies sobre el banco', torso: -90, cadera: 75, rodilla: 105, punta: 0, hombro: 0, codo: 0, dy: 30, pausa: 400, ms: 700 },
      { n: 'Sube la cadera hasta quedar recto', torso: -120, cadera: 0, rodilla: 90, punta: 0, hombro: 0, codo: 0, dy: 30, pausa: 1100, ms: 900, punto: { zona: 'cadera', txt: 'Aprieta arriba y baja lento' } },
    ] },
  puente1: { vistas: ['lado'], x0: 168, apoyo: 2, sigue: 'cadera', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Boca arriba, una pierna estirada al aire', torso: -95, cadera: 55, rodilla: 0, cadera2: 60, rodilla2: 125, hombro: 0, codo: 0, pausa: 400, ms: 700 },
      { n: 'Sube empujando con el talón, cadera nivelada', torso: -112, cadera: 0, rodilla: 0, cadera2: 0, rodilla2: 112, hombro: 0, codo: 0, pausa: 1000, ms: 900, punto: { zona: 'cadera', txt: 'La cadera no se ladea' } },
    ] },
  hipMaq: { vistas: ['lado'], x0: 172, equipo: [{ tipo: 'banco', x: 58, ancho: 44, alto: 32 }, { tipo: 'rodillo', en: 'cadera', dy: -8 }],
    poses: [
      { n: 'Espalda alta apoyada, rodillo sobre la cadera', torso: -55, cadera: 70, rodilla: 125, hombro: 0, codo: 0, pausa: 300, ms: 800 },
      { n: 'Sube la cadera hasta quedar recto de hombros a rodillas', torso: -90, cadera: 0, rodilla: 90, hombro: 0, codo: 0, pausa: 700, ms: 800, punto: { zona: 'cadera', txt: 'Sube con el glúteo, no arqueando la espalda' } },
    ] },
  hipthrust: { vistas: ['lado'], x0: 172, sigue: 'cadera', equipo: [{ tipo: 'banco', x: 58, ancho: 44, alto: 32 }, { tipo: 'pesoCadera' }],
    poses: [
      { n: 'Espalda alta en el banco, mancuerna sobre la cadera', torso: -55, cadera: 70, rodilla: 125, hombro: 12, codo: 25, pausa: 400, ms: 800 },
      { n: 'Sube la cadera hasta quedar recto', torso: -90, cadera: 0, rodilla: 90, hombro: 12, codo: 25, pausa: 1000, ms: 900, punto: { zona: 'cadera', txt: 'Aprieta 1 s arriba, sin arquear la espalda' } },
    ] },
  aductorMaq: { vistas: ['frente'], ancla: 'cadera', x0: 120, y0: 140, juntas: true,
    equipo: [{ tipo: 'rect', x: 96, y: 144, w: 48, h: 6 }, { tipo: 'linea', x1: 120, y1: 150, x2: 120, y2: 182 }, { tipo: 'almohadillas' }],
    poses: [
      { n: 'Siéntate con la espalda apoyada, piernas abiertas', cadera: 90, rodilla: 90, hombro: 10, codo: 20, ancho: 30, pausa: 300, ms: 900 },
      { n: 'Cierra las piernas controlado', cadera: 90, rodilla: 90, hombro: 10, codo: 20, ancho: 10, pausa: 300, ms: 1300, punto: { zona: 'rodilla', txt: 'Cierra controlado y abre lento' } },
    ] },
  sumo: { vistas: ['frente', 'lado'], x0: 128, mano: 'goblet', juntas: true, ancho: 26,
    poses: [
      { n: 'De pie, pies bien abiertos', torso: 5, cadera: 5, hombro: 0, codo: 0, pausa: 400, ms: 1300 },
      { n: 'Baja con las rodillas hacia afuera', torso: 22, cadera: 92, rodilla: 96, hombro: 18, codo: 0, pausa: 300, ms: 800, punto: { zona: 'rodilla', txt: 'Rodillas hacia afuera, siguiendo a los pies' } },
    ] },

  // ── Core y prevención ──────────────────────────────────────
  // ── Sesión B ───────────────────────────────────────────────
  slam: { vistas: ['lado'], x0: 112, mano: 'balon', sigue: 'manos', equipo: [{ tipo: 'balonPiso', x: 160 }],
    poses: [
      { n: 'Balón arriba, brazos estirados', rodilla: 4, punta: 20, hombro: 172, codo: 8, pausa: 400, ms: 260 },
      { n: 'Lánzalo al piso con todo usando el abdomen', torso: 42, cadera: 52, rodilla: 30, hombro: 30, codo: 5, bal: 0, pausa: 350, ms: 450, punto: { zona: 'espalda', txt: 'El golpe sale del abdomen, no solo de los brazos' } },
      { n: 'Recógelo con la espalda recta y repite', torso: 50, cadera: 92, rodilla: 75, hombro: 45, codo: 5, bal: 1, pausa: 300, ms: 700, punto: { zona: 'espalda', txt: 'Espalda recta al recoger' } },
    ] },
  slamCuerda: { vistas: ['lado'], x0: 104, sigue: 'manos', equipo: [{ tipo: 'poste', x: 200, y: 26 }, { tipo: 'banda', x: 200, y: 28 }],
    poses: [
      { n: 'Brazos arriba agarrando la banda', rodilla: 4, punta: 10, hombro: 160, codo: 10, pausa: 400, ms: 260 },
      { n: 'Jala hacia abajo explosivo usando el abdomen', torso: 40, cadera: 45, rodilla: 25, hombro: 20, codo: 5, pausa: 400, ms: 700, punto: { zona: 'espalda', txt: 'El golpe sale del abdomen' } },
    ] },
  slamSuave: { vistas: ['lado'], x0: 112, mano: 'balon', sigue: 'manos', equipo: [{ tipo: 'balonPiso', x: 156 }],
    poses: [
      { n: 'Balón arriba', rodilla: 4, punta: 12, hombro: 160, codo: 10, pausa: 400, ms: 500 },
      { n: 'Lánzalo al piso rápido pero suave', torso: 30, cadera: 36, rodilla: 22, hombro: 40, codo: 5, bal: 0, pausa: 400, ms: 500 },
      { n: 'Recógelo con la espalda recta', torso: 45, cadera: 92, rodilla: 80, hombro: 45, codo: 5, bal: 1, pausa: 300, ms: 800, punto: { zona: 'espalda', txt: 'Espalda recta al recoger' } },
    ] },
  pechoPared: { vistas: ['lado'], x0: 104, mano: 'balon', equipo: [{ tipo: 'muro', x: 196 }],
    poses: [
      { n: 'Balón en el pecho, frente a la pared', torso: 5, cadera: 10, rodilla: 12, hombro: 22, codo: 132, pausa: 300, ms: 200 },
      { n: 'Lánzalo fuerte con los dos brazos', torso: 8, cadera: 10, rodilla: 10, hombro: 88, codo: 0, bal: 0, ms: 380, punto: { zona: 'codo', txt: 'Codos cerca del cuerpo, no abiertos' } },
      { n: 'Atrápalo y repite', torso: 5, cadera: 12, rodilla: 14, hombro: 70, codo: 50, pausa: 150, ms: 300 },
    ] },
  jalon: { vistas: ['lado'], ancla: 'cadera', x0: 106, y0: 136, mano: 'barra',
    equipo: [{ tipo: 'rect', x: 80, y: 140, w: 46, h: 6 }, { tipo: 'linea', x1: 103, y1: 146, x2: 103, y2: 182 }, { tipo: 'torre', x: 150, y0: 8 }, { tipo: 'cable', x: 150, y: 14 }, { tipo: 'rodillo', en: 'rodilla', dy: -8, dx: -4 }],
    poses: [
      { n: 'Siéntate con los brazos arriba', torso: -8, cadera: 92, rodilla: 95, hombro: 168, codo: 12, pausa: 300, ms: 700 },
      { n: 'Baja la barra al pecho alto', torso: -16, cadera: 98, rodilla: 95, hombro: 22, codo: 138, pausa: 300, ms: 1200, punto: { zona: 'codo', txt: 'Codos abajo y atrás, pecho alto' } },
    ] },
  remoPolea: { vistas: ['lado'], ancla: 'cadera', x0: 74, y0: 150,
    equipo: [{ tipo: 'rect', x: 44, y: 154, w: 60, h: 6 }, { tipo: 'linea', x1: 74, y1: 160, x2: 74, y2: 182 }, { tipo: 'rect', x: 172, y: 128, w: 6, h: 40 }, { tipo: 'torre', x: 212, y0: 110 }, { tipo: 'cable', x: 212, y: 146 }],
    poses: [
      { n: 'Siéntate con los brazos estirados', torso: 8, cadera: 88, rodilla: 25, punta: -10, hombro: 82, codo: 0, pausa: 300, ms: 700 },
      { n: 'Jala llevando los codos atrás', torso: -4, cadera: 82, rodilla: 25, punta: -10, hombro: -25, codo: 105, pausa: 500, ms: 1000, punto: { zona: 'espalda', txt: 'Pecho alto, aprieta los omóplatos' } },
    ] },
  remoMaq: { vistas: ['lado'], ancla: 'cadera', x0: 88, y0: 142, mano: 'barra', sigue: 'manos',
    equipo: [{ tipo: 'rect', x: 62, y: 146, w: 46, h: 6 }, { tipo: 'linea', x1: 84, y1: 152, x2: 84, y2: 182 }, { tipo: 'rect', x: 112, y: 96, w: 7, h: 34 }, { tipo: 'linea', x1: 116, y1: 130, x2: 116, y2: 182 }, { tipo: 'torre', x: 196, y0: 70 }, { tipo: 'cable', x: 196, y: 104 }],
    poses: [
      { n: 'Pecho contra el apoyo, brazos estirados', torso: 16, cadera: 84, rodilla: 80, hombro: 78, codo: 0, pausa: 300, ms: 700 },
      { n: 'Jala con los codos hacia atrás', torso: 16, cadera: 84, rodilla: 80, hombro: -30, codo: 110, pausa: 500, ms: 1000, punto: { zona: 'espalda', txt: 'Aprieta los omóplatos y vuelve lento' } },
    ] },
  remoCasa: { vistas: ['lado'], x0: 120, sigue: 'manos', equipo: [{ tipo: 'muro', x: 212 }, { tipo: 'banda', x: 212, y: 100 }],
    poses: [
      { n: 'Banda atada a la puerta, brazos estirados', torso: 6, cadera: 10, rodilla: 15, hombro: 82, codo: 0, pausa: 300, ms: 700 },
      { n: 'Jala llevando los codos atrás', torso: 2, cadera: 8, rodilla: 15, hombro: -25, codo: 110, pausa: 500, ms: 1000, punto: { zona: 'espalda', txt: 'Aprieta los omóplatos' } },
    ] },
  pulloverPolea: { vistas: ['lado'], x0: 104, equipo: [{ tipo: 'torre', x: 208, y0: 12 }, { tipo: 'cable', x: 208, y: 22, agarre: 'cuerda' }],
    poses: [
      { n: 'Brazos arriba, casi rectos', torso: 22, cadera: 22, rodilla: 12, hombro: 150, codo: 12, pausa: 300, ms: 1000 },
      { n: 'Baja la cuerda hasta los muslos', torso: 24, cadera: 24, rodilla: 12, hombro: 12, codo: 10, pausa: 300, ms: 1100, punto: { zona: 'codo', txt: 'Brazos casi rectos, como el barrido de la brazada' } },
    ] },
  pullover: { vistas: ['lado'], x0: 146, apoyo: 'cuerpo', mano: 'goblet', sigue: 'manos', equipo: [{ tipo: 'banco', x: 92, ancho: 64, alto: 30 }],
    poses: [
      { n: 'Acostado en el banco, mancuerna arriba del pecho', giro: -90, cadera: 10, rodilla: 90, hombro: 90, codo: 10, pausa: 400, ms: 1300 },
      { n: 'Bájala detrás de la cabeza, brazos casi rectos', giro: -90, cadera: 10, rodilla: 90, hombro: 160, codo: 15, pausa: 300, ms: 1100, punto: { zona: 'hombro', txt: 'Baja solo hasta donde estés cómodo' } },
    ] },
  rotExtPolea: { vistas: ['frente'], x0: 120, brazosF: true, rotF: 2, equipo: [{ tipo: 'torre', x: 26 }, { tipo: 'cable', x: 30, y: 118, lado: 1 }],
    poses: [
      { n: 'De lado a la polea, codo pegado y mano al frente', hF: 4, hF2: 6, rF2: 5, pausa: 300, ms: 1000 },
      { n: 'Gira la mano hacia afuera', hF: 4, hF2: 6, rF2: 80, pausa: 300, ms: 1100, punto: { zona: 'codo', txt: 'El codo no se separa del cuerpo' } },
    ] },
  rotExt: { vistas: ['frente'], x0: 120, brazosF: true, rotF: 2, sigue: 'manos', equipo: [{ tipo: 'poste', x: 22, y: 100 }, { tipo: 'banda', x: 22, y: 118, lado: 1 }],
    poses: [
      { n: 'Codo pegado al cuerpo, doblado a 90°', hF: 4, hF2: 6, rF2: 5, pausa: 300, ms: 1100 },
      { n: 'Gira la mano hacia afuera lento', hF: 4, hF2: 6, rF2: 80, pausa: 400, ms: 1100, punto: { zona: 'codo', txt: 'El codo no se separa del cuerpo' } },
    ] },
  facepull: { vistas: ['lado'], x0: 96, equipo: [{ tipo: 'torre', x: 210, y0: 40 }, { tipo: 'cable', x: 210, y: 76, agarre: 'cuerda' }],
    poses: [
      { n: 'Brazos estirados al frente', torso: -4, cadera: 8, rodilla: 10, hombro: 92, codo: 0, pausa: 300, ms: 900 },
      { n: 'Jala la cuerda hacia la cara', torso: -4, cadera: 8, rodilla: 10, hombro: 100, codo: 125, pausa: 500, ms: 900, punto: { zona: 'codo', txt: 'Codos altos y abre las manos al final' } },
    ] },
  hollow: { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Boca arriba, brazos estirados atrás', giro: -90, hombro: 175, pausa: 300, ms: 900 },
      { n: 'Despega hombros y piernas, y aguanta', giro: -90, torso: 16, cadera: 36, hombro: 162, cabeza: 8, pausa: 1800, ms: 800, punto: { zona: 'espalda', txt: 'Espalda baja pegada al piso' } },
    ] },
  hollowRod: { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', sigue: 'hombro', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Boca arriba, rodillas dobladas a 90° en el aire', giro: -90, cadera: 90, rodilla: 90, hombro: 165, pausa: 500, ms: 900, punto: { zona: 'espalda', txt: 'Espalda baja pegada al piso' } },
      { n: 'Despega los hombros y aguanta', giro: -90, torso: 16, cadera: 90, rodilla: 90, hombro: 150, cabeza: 8, curva: 3, pausa: 2000, ms: 800, punto: { zona: 'espalda', txt: 'Espalda baja pegada al piso' } },
    ] },
  dominadas: { vistas: ['lado'], ancla: 'cadera', x0: 116, y0: 106, sigue: 'hombro', equipo: [{ tipo: 'barraFija', x1: 70, x2: 170, y: 24 }],
    poses: [
      { n: 'Cuélgate con los brazos estirados', torso: 0, cadera: 12, rodilla: 35, hombro: 176, codo: 0, pausa: 500, ms: 900, punto: { zona: 'hombro', txt: 'Brazos estirados al empezar' } },
      { n: 'Sube llevando el pecho a la barra', torso: -10, cadera: 14, rodilla: 40, hombro: 12, codo: 140, dy: 44, pausa: 300, ms: 1500, punto: { zona: 'cadera', txt: 'Sin balanceo ni patadas' } },
      { n: 'Baja lento, en 3 segundos', torso: -5, cadera: 13, rodilla: 38, hombro: 90, codo: 100, dx: -16, dy: 23, ms: 1500 },
    ] },
  domAsist: { vistas: ['lado'], ancla: 'cadera', x0: 116, y0: 106, sigue: 'hombro', equipo: [{ tipo: 'barraFija', x1: 70, x2: 170, y: 24 }, { tipo: 'linea', x1: 168, y1: 24, x2: 168, y2: 182 }, { tipo: 'rodillo', en: 'rodilla', dy: 9, dx: -2 }],
    poses: [
      { n: 'Rodillas en la asistencia, brazos estirados', torso: 0, cadera: 5, rodilla: 90, hombro: 176, codo: 0, pausa: 500, ms: 900, punto: { zona: 'hombro', txt: 'Brazos estirados al empezar' } },
      { n: 'Sube llevando el pecho a la barra', torso: -10, cadera: 8, rodilla: 90, hombro: 12, codo: 140, dy: 44, pausa: 300, ms: 1500, punto: { zona: 'codo', txt: 'Codos hacia abajo y atrás' } },
      { n: 'Baja lento, en 3 segundos', torso: -5, cadera: 6, rodilla: 90, hombro: 90, codo: 100, dx: -16, dy: 23, ms: 1500 },
    ] },
  remoInv: { vistas: ['lado'], x0: 210, equipo: [{ tipo: 'barraFija', x1: 112, x2: 168, y: 100 }],
    poses: [
      { n: 'Cuélgate bajo la barra con el cuerpo recto', giro: -68, punta: -60, hombro: 92, codo: 0, pausa: 300, ms: 900 },
      { n: 'Lleva el pecho a la barra', giro: -58, punta: -50, hombro: 40, codo: 105, pausa: 300, ms: 900, punto: { zona: 'cadera', txt: 'Cuerpo recto, la cadera no cae' } },
    ] },
  // ── Sesión C ───────────────────────────────────────────────
  patinador: { vistas: ['frente', 'lado'], x0: 120, sigue: 'cadera',
    poses: [
      { n: 'Párate en una pierna', apoyo: 1, lat: -30, torso: 20, cadera: 40, rodilla: 45, cadera2: -10, rodilla2: 95, ancho: 6, hombro: 30, codo: 30, hombro2: -30, pausa: 500, ms: 260 },
      { n: 'Salta de lado', apoyo: 1, lat: 0, torso: 12, cadera: 15, rodilla: 20, cadera2: 15, rodilla2: 25, ancho: 12, hombro: 0, codo: 30, dy: 18, ms: 260 },
      { n: 'Cae en la otra pierna y quédate quieto 1 s', apoyo: 2, lat: 30, torso: 20, cadera: -10, rodilla: 95, cadera2: 40, rodilla2: 45, ancho: 6, hombro: -30, codo: 30, hombro2: 30, pausa: 800, ms: 260, punto: { zona: 'rodilla', txt: 'Rodilla alineada al caer, estable 1 s' } },
      { n: 'Salta de vuelta', apoyo: 2, lat: 0, torso: 12, cadera: 15, rodilla: 25, cadera2: 15, rodilla2: 20, ancho: 12, hombro: 0, codo: 30, dy: 18, ms: 260 },
    ] },
  pasosBanda: { vistas: ['frente', 'lado'], x0: 120, sigue: 'cadera', equipo: [{ tipo: 'bandaRod' }],
    poses: [
      { n: 'Banda arriba de las rodillas, media sentadilla', torso: 20, cadera: 50, rodilla: 55, hombro: 30, codo: 90, lat: 0, ancho: 16, pausa: 500, ms: 450 },
      { n: 'Paso largo hacia un lado', torso: 20, cadera: 50, rodilla: 55, hombro: 30, codo: 90, lat: 6, ancho: 22, pausa: 150, ms: 450 },
      { n: 'Trae el otro pie, sin juntarlos', torso: 20, cadera: 50, rodilla: 55, hombro: 30, codo: 90, lat: 12, ancho: 16, pausa: 300, ms: 450, punto: { zona: 'rodilla', txt: 'Rodillas hacia afuera contra la banda' } },
      { n: 'Ahora de vuelta hacia el otro lado', torso: 20, cadera: 50, rodilla: 55, hombro: 30, codo: 90, lat: 6, ancho: 22, pausa: 150, ms: 450 },
    ] },
  rotacional: { vistas: ['frente'], x0: 120, mano: 'balon', brazosF: true, sigue: 'manos', equipo: [{ tipo: 'muro', x: 10 }],
    poses: [
      { n: 'De lado a la pared, balón a la altura de la cadera', torso: 10, cadera: 20, rodilla: 25, hF: -40, hF2: 35, ancho: 16, tr: -55, pausa: 400, ms: 300 },
      { n: 'Gira desde la cadera', torso: 6, cadera: 14, rodilla: 18, hF: 10, hF2: -5, ancho: 16, tr: 0, ms: 200, punto: { zona: 'cadera', txt: 'El giro empieza en la cadera, no en los brazos' } },
      { n: 'Lanza fuerte y atrapa', torso: 5, cadera: 10, rodilla: 12, hF: 75, hF2: -35, ancho: 16, tr: 55, bal: 0, pausa: 300, ms: 600 },
    ] },
  rotBanda: { vistas: ['frente'], x0: 120, brazosF: true, sigue: 'manos', equipo: [{ tipo: 'poste', x: 226, y: 100 }, { tipo: 'banda', x: 226, y: 112, lado: 'medio' }],
    poses: [
      { n: 'De lado a la banda, manos al frente del pecho', torso: 6, cadera: 14, rodilla: 18, hF: -30, hF2: 30, cF: 60, cF2: -60, ancho: 16, tr: -50, pausa: 300, ms: 250 },
      { n: 'Gira rápido desde la cadera', torso: 6, cadera: 14, rodilla: 18, hF: 50, hF2: -40, cF: -20, cF2: 60, ancho: 16, tr: 50, pausa: 200, ms: 700, punto: { zona: 'cadera', txt: 'Gira desde la cadera, vuelve controlado' } },
    ] },
  zancada: { vistas: ['lado', 'frente'], x0: 150, mano: 'mancuernas', sigue: 'cadera',
    poses: [
      { n: 'De pie, mancuernas a los lados', torso: 4, hombro: 0, codo: 0, pausa: 400, ms: 600 },
      { n: 'Da un paso atrás', torso: 6, cadera: 28, rodilla: 18, cadera2: -28, rodilla2: 25, punta2: 50, hombro: 0, codo: 0, ms: 600 },
      { n: 'Baja la rodilla de atrás cerca del piso', torso: 8, cadera: 82, rodilla: 86, cadera2: -14, rodilla2: 62, punta2: 60, hombro: 0, codo: 0, pausa: 400, ms: 700, punto: { zona: 'rodilla', txt: 'Rodilla de adelante alineada con el pie' } },
      { n: 'Vuelve empujando con el pie de adelante', torso: 4, hombro: 0, codo: 0, ms: 500 },
    ] },
  pressMil: { vistas: ['lado', 'frente'], x0: 128, mano: 'mancuernas', brazosF: true, sigue: 'manos',
    poses: [
      { n: 'De pie, mancuernas a la altura de los hombros', torso: 0, rodilla: 5, hombro: 28, codo: 140, hF: 90, cF: 90, pausa: 400, ms: 700 },
      { n: 'Aprieta el abdomen y empuja arriba', torso: 0, rodilla: 5, hombro: 170, codo: 6, hF: 168, cF: 6, pausa: 300, ms: 1100, punto: { zona: 'espalda', txt: 'Abdomen apretado, sin arquear la espalda' } },
    ] },
  superman: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo', equipo: [{ tipo: 'colchoneta', x: 30, ancho: 180 }],
    poses: [
      { n: 'Boca abajo, brazos estirados al frente', giro: 90, hombro: 178, pausa: 300, ms: 800 },
      { n: 'Despega el pecho y las piernas', giro: 90, torso: -14, cadera: -18, hombro: 175, cabeza: -4, pausa: 1500, ms: 800, punto: { zona: 'cabeza', txt: 'Mira al piso, no hacia arriba' } },
    ] },
  birddog: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo',
    poses: [
      { n: 'En cuatro apoyos', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: 90, codo: 0, pausa: 300, ms: 800 },
      { n: 'Estira un brazo y la pierna contraria', giro: 90, cadera: 90, rodilla: 90, punta: 90, cadera2: 0, rodilla2: 0, punta2: 60, hombro: 178, hombro2: 90, codo: 0, pausa: 900, ms: 800, punto: { zona: 'espalda', txt: 'Espalda quieta, sin arquear' } },
    ] },
  deadbug: { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Boca arriba, brazos al techo y rodillas a 90°', giro: -90, cadera: 90, rodilla: 90, hombro: 90, codo: 0, pausa: 300, ms: 900 },
      { n: 'Baja un brazo y la pierna contraria', giro: -90, cadera: 90, rodilla: 90, cadera2: 15, rodilla2: 0, hombro: 170, hombro2: 90, codo: 0, pausa: 400, ms: 900, punto: { zona: 'espalda', txt: 'Espalda baja pegada al piso' } },
      { n: 'Vuelve al centro', giro: -90, cadera: 90, rodilla: 90, hombro: 90, codo: 0, pausa: 200, ms: 900 },
      { n: 'Ahora el otro lado', giro: -90, cadera: 15, rodilla: 0, cadera2: 90, rodilla2: 90, hombro: 90, hombro2: 170, codo: 0, pausa: 400, ms: 900 },
    ] },

  // ── Movilidad ──────────────────────────────────────────────
  toracica: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo', sigue: 'manos', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 160 }],
    poses: [
      { n: 'En cuatro apoyos, una mano detrás de la cabeza', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: 120, codo: 140, hombro2: 90, codo2: 0, cabeza: 10, pausa: 400, ms: 1000 },
      { n: 'Gira el codo hacia el techo y síguelo con la mirada', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: -70, codo: 140, hombro2: 90, codo2: 0, cabeza: -25, pausa: 900, ms: 1000, punto: { zona: 'codo', txt: 'Gira la espalda alta, no la cadera' } },
    ] },
  gatoCamello: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo', sigue: 'hombro', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 160 }],
    poses: [
      { n: 'En cuatro apoyos', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: 90, codo: 0, pausa: 400, ms: 1400 },
      { n: 'Redondea la espalda mirando al ombligo', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: 90, codo: 0, curva: 11, cabeza: 40, pausa: 800, ms: 1400, punto: { zona: 'espalda', txt: 'Empuja el piso y sube la espalda' } },
      { n: 'Luego húndela mirando al frente', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: 90, codo: 0, curva: -8, cabeza: -30, pausa: 800, ms: 1400 },
    ] },
  rana: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo',
    poses: [
      { n: 'En cuatro apoyos, rodillas abiertas', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: 90, codo: 0, pausa: 400, ms: 1500 },
      { n: 'Lleva la cadera atrás despacio', giro: 90, cadera: 135, rodilla: 135, punta: 90, hombro: 150, codo: 0, pausa: 1500, ms: 1500, punto: { zona: 'cadera', txt: 'Despacio, sin forzar' } },
    ] },
  dorsalPared: { vistas: ['lado'], x0: 120, equipo: [{ tipo: 'muro', x: 206 }],
    poses: [
      { n: 'Manos en la pared, brazos estirados', torso: 35, cadera: 35, rodilla: 6, hombro: 145, codo: 0, pausa: 400, ms: 1500 },
      { n: 'Baja el pecho y aguanta', torso: 78, cadera: 84, rodilla: 10, hombro: 178, codo: 0, pausa: 1500, ms: 1500, punto: { zona: 'hombro', txt: 'Siente el estiramiento bajo la axila' } },
    ] },
  dorsalPuerta: { vistas: ['lado'], x0: 120, sigue: 'cadera', equipo: [{ tipo: 'poste', x: 150, y: 30 }],
    poses: [
      { n: 'Agarra el marco con las manos a la altura de la cabeza', torso: 10, cadera: 10, rodilla: 5, hombro: 140, codo: 10, pausa: 500, ms: 1500 },
      { n: 'Lleva la cadera atrás con las rodillas un poco dobladas', torso: 62, cadera: 90, rodilla: 30, hombro: 165, codo: 0, dx: -18, pausa: 2000, ms: 1500, punto: { zona: 'hombro', txt: 'Respira y aguanta: lo sientes bajo la axila' } },
    ] },
  respPared: { vistas: ['lado'], ancla: 'cadera', x0: 150, y0: 176, equipo: [{ tipo: 'muro', x: 156 }, { tipo: 'colchoneta', x: 40, ancho: 120 }],
    poses: [
      { n: 'Inhala 4 s por la nariz', giro: -90, cadera: 88, rodilla: 0, punta: 0, hombro: 30, codo: 60, torso: 1, ms: 4000 },
      { n: 'Bota el aire en 6 s', giro: -90, cadera: 88, rodilla: 0, punta: 0, hombro: 30, codo: 60, torso: -1, ms: 6000, punto: { zona: 'espalda', txt: 'Respira lento: 4 s adentro, 6 s afuera' } },
    ] },
  circBrazos: { vistas: ['lado'], x0: 120, vuelta: ['hombro', 'hombro2'], sigue: 'manos',
    poses: [
      { n: 'De pie, brazos estirados abajo', hombro: 0, codo: 5, ms: 420 },
      { n: 'Súbelos por delante', hombro: 90, codo: 5, ms: 420 },
      { n: 'Pásalos por arriba', hombro: 180, codo: 5, ms: 420 },
      { n: 'Bájalos por detrás. Después, al revés', hombro: 270, codo: 5, ms: 420 },
    ] },
  movGeneral: { vistas: ['lado'], x0: 124, apoyo: 2, vuelta: ['hombro', 'hombro2'], sigue: 'cadera',
    poses: [
      { n: 'Círculos de cadera: manos en la cintura', torso: -8, cadera: -8, hombro: -25, codo: 95, pausa: 100, ms: 700 },
      { n: 'Lleva la cadera atrás y sigue el círculo', torso: 12, cadera: 14, rodilla: 6, rodilla2: 6, hombro: -25, codo: 95, pausa: 100, ms: 700 },
      { n: 'Círculos de tobillo: levanta un pie', cadera: 30, rodilla: 40, punta: 40, hombro: -25, codo: 95, pausa: 200, ms: 600 },
      { n: 'Gira el tobillo despacio', cadera: 30, rodilla: 40, punta: -20, hombro: -25, codo: 95, pausa: 200, ms: 600, punto: { zona: 'pies', txt: 'Movimientos suaves, sin forzar' } },
      { n: 'Círculos de brazos: adelante', hombro: 90, codo: 5, ms: 450 },
      { n: 'Por arriba', hombro: 180, codo: 5, ms: 450 },
      { n: 'Por detrás, y vuelve a empezar', hombro: 270, codo: 5, ms: 600 },
    ] },
  salidaImag: { vistas: ['lado'], x0: 50, sigue: 'cadera',
    poses: [
      { n: 'Posición de salida: agachado, manos cerca de los pies', torso: 75, cadera: 115, rodilla: 75, punta: 10, hombro: 60, codo: 10, cabeza: 10, pausa: 700, ms: 250 },
      { n: 'Impulso explosivo hacia adelante', torso: 55, cadera: 15, rodilla: 4, punta: 45, hombro: 180, codo: 0, dx: 14, dy: 4, ms: 220 },
      { n: 'Vuela en streamline', torso: 40, cadera: 5, rodilla: 0, punta: 60, hombro: 180, codo: 0, dx: 52, dy: 24, ms: 260 },
      { n: 'Cae suave y termina en streamline perfecto', torso: 25, cadera: 60, rodilla: 62, hombro: 180, codo: 0, dx: 80, pausa: 600, ms: 400, punto: { zona: 'manos', txt: 'Brazos juntos y apretados detrás de la cabeza' } },
      { n: 'Vuelve a tu marca', hombro: 0, codo: 10, dx: 80, pausa: 200, ms: 900 },
    ] },
  streamPared: { vistas: ['frente'], x0: 120, brazosF: true,
    poses: [
      { n: 'Espalda y brazos contra la pared, en W', hF: 80, cF: 100, pausa: 300, ms: 1000 },
      { n: 'Sube a streamline sin despegarlos', hF: 172, cF: 4, pausa: 400, ms: 1000, punto: { zona: 'manos', txt: 'Brazos pegados a la pared, espalda baja también' } },
    ] },

  // ── Plan B en casa ─────────────────────────────────────────
  cardio: { vistas: ['lado', 'frente'], x0: 120,
    poses: [
      { n: 'Trota con una pierna adelante', apoyo: 1, torso: 10, cadera: 35, rodilla: 25, cadera2: -20, rodilla2: 75, punta2: 30, hombro: -30, codo: 90, hombro2: 35, codo2: 90, ms: 260 },
      { n: 'Cambia de pierna', apoyo: 2, torso: 10, cadera: -20, rodilla: 75, punta: 30, cadera2: 35, rodilla2: 25, hombro: 35, codo: 90, hombro2: -30, codo2: 90, ms: 260 },
    ] },
  cuerda: { vistas: ['frente', 'lado'], x0: 120, ancho: 8, brazosF: true, equipo: [{ tipo: 'cuerda' }],
    poses: [
      { n: 'La cuerda pasa bajo los pies: salto suave', rodilla: 4, punta: 40, hF: 25, cF: 15, cu: 0, dy: 8, ms: 260, punto: { zona: 'pies', txt: 'Saltos bajitos, en la punta de los pies' } },
      { n: 'Cae en puntas mientras la cuerda pasa por arriba', rodilla: 10, punta: 18, hF: 25, cF: 15, cu: 180, ms: 260 },
    ] },
  brazadaBanda: { vistas: ['lado'], x0: 96, equipo: [{ tipo: 'poste', x: 214, y: 110 }, { tipo: 'banda', x: 214, y: 112 }],
    poses: [
      { n: 'Inclinado, brazos estirados al frente', torso: 45, cadera: 45, rodilla: 15, hombro: 132, codo: 0, pausa: 200, ms: 500 },
      { n: 'Barre hacia adentro con los codos altos', torso: 45, cadera: 45, rodilla: 15, hombro: 72, codo: 95, ms: 350, punto: { zona: 'codo', txt: 'Codos altos en el barrido' } },
      { n: 'Vuelve rápido al frente', torso: 45, cadera: 45, rodilla: 15, hombro: 112, codo: 60, ms: 250 },
    ] },
  libreBanda: { vistas: ['lado'], x0: 96, sigue: 'manos', equipo: [{ tipo: 'poste', x: 214, y: 100 }, { tipo: 'banda', x: 214, y: 102 }],
    poses: [
      { n: 'Inclinado al frente, brazo estirado adelante', torso: 45, cadera: 45, rodilla: 15, hombro: 160, codo: 0, hombro2: -10, codo2: 10, pausa: 300, ms: 450 },
      { n: 'Jala la banda con el codo alto', torso: 45, cadera: 45, rodilla: 15, hombro: 80, codo: 70, hombro2: -10, codo2: 10, ms: 400, punto: { zona: 'codo', txt: 'Codo alto, como en la brazada' } },
      { n: 'Termina con la mano en la cadera', torso: 45, cadera: 45, rodilla: 15, hombro: -15, codo: 10, hombro2: -10, codo2: 10, pausa: 300, ms: 700 },
    ] },
  patadaSeco: { vistas: ['lado'], ancla: 'cadera', x0: 112, y0: 132, equipo: [{ tipo: 'rect', x: 110, y: 136, w: 110, h: 10 }, { tipo: 'linea', x1: 210, y1: 146, x2: 210, y2: 182 }, { tipo: 'linea', x1: 118, y1: 146, x2: 118, y2: 182 }],
    poses: [
      { n: 'Boca abajo, cadera al borde de la cama', giro: 90, torso: 0, cadera: 0, rodilla: 0, punta: 90, hombro: 150, codo: 30, pausa: 300, ms: 700 },
      { n: 'Lleva los talones al glúteo', giro: 90, cadera: 20, rodilla: 120, punta: 0, hombro: 150, codo: 30, ms: 600 },
      { n: 'Patea y junta bien los pies', giro: 90, cadera: -5, rodilla: 0, punta: 90, hombro: 150, codo: 30, pausa: 500, ms: 500, punto: { zona: 'pies', txt: 'Termina juntando bien los pies' } },
    ] },
  // ── Los que faltaban ───────────────────────────────────────
  sentRapida: { vistas: ['lado', 'frente'], x0: 128, ancho: 14,
    poses: [
      { n: 'De pie, pies al ancho de los hombros', torso: 2, hombro: 80, codo: 0, pausa: 200, ms: 600 },
      { n: 'Baja controlado y sube rápido', torso: 26, cadera: 96, rodilla: 100, hombro: 88, codo: 0, ms: 350, punto: { zona: 'pies', txt: 'Talones abajo, sube rápido' } },
    ] },
  hiper: { vistas: ['lado'], ancla: 'cadera', x0: 128, y0: 104, equipo: [{ tipo: 'rodillo', en: 'cadera', dy: 6, dx: 4 }, { tipo: 'linea', x1: 132, y1: 116, x2: 132, y2: 182 }, { tipo: 'linea', x1: 74, y1: 150, x2: 132, y2: 116 }],
    poses: [
      { n: 'Cadera en el apoyo, baja el tronco', giro: 60, torso: 75, cadera: 75, hombro: 25, codo: 140, pausa: 300, ms: 1000 },
      { n: 'Sube hasta quedar recto', giro: 60, torso: 0, hombro: 25, codo: 140, pausa: 500, ms: 1000, punto: { zona: 'espalda', txt: 'Hasta quedar recto, sin pasarte' } },
    ] },
  balonRod: { vistas: ['lado'], x0: 168, equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }, { tipo: 'objeto', en: 'rodilla', dy: 0, r: 6 }],
    poses: [
      { n: 'Boca arriba con el balón entre las rodillas', torso: -95, cadera: 60, rodilla: 125, hombro: 0, codo: 0, pausa: 800, ms: 400 },
      { n: 'Aprieta fuerte y aguanta respirando normal', torso: -95, cadera: 60, rodilla: 125, hombro: 0, codo: 0, curva: -2, pausa: 2000, ms: 400, punto: { zona: 'rodilla', txt: 'Aprieta fuerte, sin aguantar la respiración' } },
    ] },
  // ── Fuerza (máquinas y mancuernas) ─────────────────────────
  curlFem: { vistas: ['lado'], ancla: 'cadera', x0: 96, y0: 128,
    equipo: [{ tipo: 'rect', x: 70, y: 132, w: 52, h: 6 }, { tipo: 'linea', x1: 94, y1: 138, x2: 94, y2: 182 }, { tipo: 'respaldo' }, { tipo: 'rodillo', en: 'rodilla', dx: -10, dy: -8 }, { tipo: 'rodillo', en: 'tobillo', dx: 0, dy: 7 }],
    poses: [
      { n: 'Piernas estiradas', torso: -12, cadera: 92, rodilla: 8, punta: 0, hombro: 25, codo: 40, pausa: 300, ms: 450 },
      { n: 'Lleva los talones abajo y atrás, explosivo', torso: -12, cadera: 92, rodilla: 105, punta: 0, hombro: 25, codo: 40, pausa: 200, ms: 1500, punto: { zona: 'cadera', txt: 'Sube rápido, baja lento; la cadera no se despega' } },
    ] },
  talones: { vistas: ['lado', 'frente'], x0: 132, puntas: true, sigue: 'pies', equipo: [{ tipo: 'rect', x: 112, y: 168, w: 26, h: 14, r: 2 }, { tipo: 'rodillo', en: 'hombro', dy: -6 }],
    poses: [
      { n: 'Puntas en el borde, talones abajo', punta: -18, hombro: 160, codo: 140, dy: 14, pausa: 400, ms: 450, punto: { zona: 'pies', txt: 'Baja hasta sentir el estiramiento' } },
      { n: 'Sube explosivo en puntas, lo más alto que puedas', punta: 40, hombro: 160, codo: 140, dy: 14, pausa: 500, ms: 1300 },
    ] },
  prensaUna: { vistas: ['lado'], ancla: 'cadera', x0: 82, y0: 140, sigue: 'pies',
    equipo: [{ tipo: 'rect', x: 44, y: 147, w: 52, h: 6 }, { tipo: 'linea', x1: 66, y1: 153, x2: 66, y2: 182 }, { tipo: 'respaldo' }, { tipo: 'carro', riel: 135 }],
    poses: [
      { n: 'Un pie en el centro de la plataforma', torso: -50, cadera: 85, rodilla: 6, punta: -135, cadera2: 105, rodilla2: 125, punta2: -100, hombro: 75, codo: 10, pausa: 400, ms: 1600 },
      { n: 'Baja hasta 90° sin despegar la cadera', torso: -50, cadera: 130, rodilla: 92, punta: -135, cadera2: 105, rodilla2: 125, punta2: -100, hombro: 75, codo: 10, pausa: 300, ms: 900, punto: { zona: 'cadera', txt: 'La cadera no se despega del asiento' } },
      { n: 'Empuja sin bloquear la rodilla', torso: -50, cadera: 92, rodilla: 14, punta: -135, cadera2: 105, rodilla2: 125, punta2: -100, hombro: 75, codo: 10, ms: 400, punto: { zona: 'rodilla', txt: 'Sin bloquear la rodilla arriba' } },
    ] },
  pressPecho: { vistas: ['lado'], ancla: 'cadera', x0: 92, y0: 130, mano: 'barra',
    equipo: [{ tipo: 'rect', x: 66, y: 134, w: 46, h: 6 }, { tipo: 'linea', x1: 88, y1: 140, x2: 88, y2: 182 }, { tipo: 'respaldo' }],
    poses: [
      { n: 'Espalda pegada, agarres al pecho', torso: -6, cadera: 92, rodilla: 92, hombro: -12, codo: 110, pausa: 300, ms: 450 },
      { n: 'Empuja explosivo, sin bloquear los codos', torso: -6, cadera: 92, rodilla: 92, hombro: 86, codo: 6, pausa: 200, ms: 1500, punto: { zona: 'hombro', txt: 'Hombros pegados al respaldo, sin bloquear los codos' } },
    ] },
  pressHombroMaq: { vistas: ['lado'], ancla: 'cadera', x0: 100, y0: 130, mano: 'barra', sigue: 'manos',
    equipo: [{ tipo: 'rect', x: 74, y: 134, w: 46, h: 6 }, { tipo: 'linea', x1: 96, y1: 140, x2: 96, y2: 182 }, { tipo: 'respaldo' }],
    poses: [
      { n: 'Espalda pegada, agarres a la altura de los hombros', torso: -6, cadera: 92, rodilla: 92, hombro: 30, codo: 140, pausa: 300, ms: 450 },
      { n: 'Empuja arriba explosivo, sin bloquear los codos', torso: -6, cadera: 92, rodilla: 92, hombro: 168, codo: 10, pausa: 200, ms: 1500, punto: { zona: 'espalda', txt: 'Espalda pegada al respaldo, sin arquear' } },
    ] },
  remoMano: { vistas: ['lado'], x0: 112, mano: 'mancuernas', equipo: [{ tipo: 'banco', x: 62, ancho: 82, alto: 34 }],
    poses: [
      { n: 'Rodilla y mano en el banco, brazo estirado', torso: 80, cadera: 85, rodilla: 10, cadera2: 80, rodilla2: 90, punta2: 180, hombro: 80, codo: 0, hombro2: 80, codo2: 0, pausa: 300, ms: 450 },
      { n: 'Jala el codo atrás, explosivo', torso: 80, cadera: 85, rodilla: 10, cadera2: 80, rodilla2: 90, punta2: 180, hombro: 15, codo: 100, hombro2: 80, codo2: 0, pausa: 200, ms: 1300, punto: { zona: 'espalda', txt: 'Espalda recta, sin girar el torso' } },
    ] },

  balanceo: { vistas: ['lado'], x0: 128, apoyo: 2, sigue: 'pies', equipo: [{ tipo: 'poste', x: 160, y: 80 }],
    poses: [
      { n: 'Apóyate con una mano y lleva la pierna atrás', torso: 4, cadera: -28, rodilla: 10, punta: 10, cadera2: 0, rodilla2: 0, hombro: -40, codo: 20, hombro2: 70, codo2: 20, ms: 600 },
      { n: 'Balancéala adelante, suelta y cada vez más alto', torso: 0, cadera: 65, rodilla: 5, punta: 0, cadera2: 0, rodilla2: 0, hombro: 40, codo: 20, hombro2: 70, codo2: 20, ms: 600, punto: { zona: 'espalda', txt: 'Sin forzar ni arquear la espalda' } },
    ] },

  plancha: { vistas: ['lado'], x0: 40, equipo: [{ tipo: 'colchoneta', x: 26, ancho: 180 }],
    poses: [
      { n: 'Antebrazos en el piso, cuerpo recto', giro: 80, punta: 12, hombro: 80, codo: 92, pausa: 1500, ms: 600, punto: { zona: 'cadera', txt: 'Cadera alineada, ni caída ni muy arriba' } },
      { n: 'Aguanta respirando', giro: 80, punta: 12, hombro: 80, codo: 92, cabeza: 4, pausa: 1500, ms: 600 },
    ] },
  planchaLat: { vistas: ['lado'], x0: 40, sigue: 'cadera', equipo: [{ tipo: 'colchoneta', x: 26, ancho: 180 }],
    poses: [
      { n: 'De lado sobre el antebrazo, cadera en el piso', giro: 82, cadera: -12, punta: 12, hombro: 82, codo: 92, hombro2: 0, codo2: 0, pausa: 500, ms: 700 },
      { n: 'Sube la cadera hasta quedar recto', giro: 76, punta: 12, hombro: 80, codo: 92, hombro2: 0, codo2: 0, pausa: 1500, ms: 600, punto: { zona: 'cadera', txt: 'Cuerpo en línea, la cadera no cae' } },
      { n: 'Aguanta respirando', giro: 76, punta: 12, hombro: 80, codo: 92, hombro2: 0, codo2: 0, cabeza: 3, pausa: 1500, ms: 700 },
    ] },
};
