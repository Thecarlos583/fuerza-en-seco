// ─────────────────────────────────────────────────────────────
// Animaciones: poses clave de cada ejercicio (ver los ángulos en js/anim.js).
// ms: tiempo hasta la pose siguiente · pausa: tiempo quieto en la pose
// punto: zona que se ilumina en coral con su texto (rodilla, cadera, espalda, pies, hombro, manos, codo, cabeza)
// como: 'id' usa la animación de otro ejercicio parecido
// ─────────────────────────────────────────────────────────────
export const ANIM = {
  cajon: { vistas: ['lado', 'frente'], x0: 62, equipo: [{ tipo: 'cajon', x: 120, ancho: 46, alto: 30 }],
    poses: [
      { n: 'De pie', torso: 0, cadera: 0, rodilla: 0, hombro: 0, codo: 10, pausa: 400, ms: 500 },
      { n: 'Brazos atrás y carga', torso: 38, cadera: 82, rodilla: 85, hombro: -55, codo: 10, pausa: 120, ms: 240 },
      { n: 'Despegue explosivo', torso: 12, cadera: 8, rodilla: 4, punta: 38, hombro: 150, codo: 15, dx: 5, dy: 2, ms: 220 },
      { n: 'En el aire', torso: 22, cadera: 100, rodilla: 115, punta: 15, hombro: 105, codo: 25, dx: 52, dy: 50, ms: 220 },
      { n: 'Cae suave', torso: 36, cadera: 86, rodilla: 90, hombro: 55, codo: 30, dx: 86, dy: 30, pausa: 800, ms: 500, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas hacia afuera' } },
      { n: 'De pie arriba', torso: 0, cadera: 0, rodilla: 0, hombro: 0, codo: 10, dx: 86, dy: 30, pausa: 300, ms: 700 },
      { n: 'Baja caminando', torso: 20, cadera: 85, rodilla: 120, cadera2: -10, rodilla2: 0, punta2: 35, hombro: 25, codo: 15, hombro2: -20, dx: 86, dy: 30, pausa: 150, ms: 550, punto: { zona: 'pies', txt: 'Baja del cajón caminando, nunca saltando' } },
      { n: 'Un pie en el piso', apoyo: 2, torso: 8, cadera: 55, rodilla: 85, cadera2: 0, rodilla2: 5, hombro: -15, hombro2: 15, codo: 15, dx: 48, dy: 0, ms: 450 },
      { n: 'Vuelve a tu marca', apoyo: 2, torso: 0, cadera: 0, rodilla: 0, hombro: 0, codo: 10, dx: 48, dy: 0, pausa: 300, ms: 800 },
    ] },
  goblet: { vistas: ['lado', 'frente'], x0: 128, mano: 'goblet', juntas: true, ancho: 15,
    poses: [
      { n: 'De pie, pecho alto', torso: 4, cadera: 4, rodilla: 0, hombro: 6, codo: 152, pausa: 600, ms: 1500, punto: { zona: 'espalda', txt: 'Pecho alto, mancuerna pegada al pecho' } },
      { n: 'Bajando en 3 segundos', torso: 18, cadera: 56, rodilla: 62, hombro: 20, codo: 150, ms: 1500, punto: { zona: 'rodilla', txt: 'Rodillas siguen la dirección de los pies' } },
      { n: 'Abajo', torso: 32, cadera: 112, rodilla: 118, hombro: 34, codo: 148, pausa: 450, ms: 550, punto: { zona: 'pies', txt: 'Talones pegados al piso' } },
      { n: 'Sube rápido', torso: 14, cadera: 45, rodilla: 50, hombro: 16, codo: 150, ms: 300 },
    ] },
  rdl: { vistas: ['lado'], x0: 128, mano: 'mancuernas',
    poses: [
      { n: 'De pie', torso: 0, cadera: 0, rodilla: 8, hombro: 0, codo: 0, pausa: 600, ms: 900 },
      { n: 'Cadera atrás', torso: 30, cadera: 48, rodilla: 18, hombro: 26, codo: 0, ms: 900, punto: { zona: 'cadera', txt: 'La cadera va atrás, no hacia abajo' } },
      { n: 'Abajo, espalda recta', torso: 66, cadera: 96, rodilla: 24, hombro: 58, codo: 0, pausa: 500, ms: 700, punto: { zona: 'espalda', txt: 'Espalda recta todo el tiempo' } },
      { n: 'Sube apretando el glúteo', torso: 28, cadera: 45, rodilla: 17, hombro: 24, codo: 0, ms: 600, punto: { zona: 'manos', txt: 'Mancuernas pegadas a las piernas' } },
    ] },
  // ── Saltos ─────────────────────────────────────────────────
  svertical: { vistas: ['lado', 'frente'], x0: 120,
    poses: [
      { n: 'De pie', hombro: 0, codo: 10, pausa: 400, ms: 500 },
      { n: 'Brazos atrás y carga', torso: 38, cadera: 82, rodilla: 85, hombro: -55, codo: 10, pausa: 100, ms: 220 },
      { n: 'Despegue', torso: 8, cadera: 5, rodilla: 2, punta: 40, hombro: 165, codo: 10, dy: 2, ms: 200 },
      { n: 'Arriba', torso: 4, cadera: 6, rodilla: 6, punta: 30, hombro: 175, codo: 5, dy: 24, ms: 260 },
      { n: 'Cae suave', torso: 30, cadera: 70, rodilla: 75, hombro: 40, codo: 20, pausa: 450, ms: 600, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas alineadas con los pies' } },
    ] },
  scmpared: { como: 'svertical' },
  longitud: { vistas: ['lado'], x0: 30,
    poses: [
      { n: 'De pie', hombro: 0, codo: 10, pausa: 400, ms: 500 },
      { n: 'Brazos atrás y carga', torso: 45, cadera: 88, rodilla: 82, hombro: -60, codo: 10, pausa: 100, ms: 220 },
      { n: 'Extensión total', torso: 42, cadera: 12, rodilla: 4, punta: 45, hombro: 160, codo: 10, dx: 10, dy: 3, ms: 220 },
      { n: 'En el aire', torso: 20, cadera: 95, rodilla: 90, punta: 10, hombro: 120, codo: 20, dx: 70, dy: 30, ms: 260 },
      { n: 'Clava la caída', torso: 38, cadera: 88, rodilla: 84, hombro: 70, codo: 20, dx: 120, pausa: 1000, ms: 500, punto: { zona: 'rodilla', txt: 'Clava la caída 2 s, pecho no tan adelante' } },
      { n: 'De pie', hombro: 0, codo: 10, dx: 120, pausa: 300, ms: 900 },
    ] },
  longUna: { como: 'longitud' },
  cuclillas: { como: 'longitud' },
  sstream: { vistas: ['lado'], x0: 120, dyMax: 0,
    poses: [
      { n: 'Streamline', hombro: 180, codo: 0, pausa: 400, ms: 450 },
      { n: 'Carga sin abrir los brazos', torso: 25, cadera: 62, rodilla: 66, hombro: 180, codo: 0, pausa: 100, ms: 220 },
      { n: 'Salto vertical', torso: 2, cadera: 2, rodilla: 2, punta: 40, hombro: 180, codo: 0, dy: 16, ms: 260 },
      { n: 'Cae suave', torso: 25, cadera: 58, rodilla: 62, hombro: 180, codo: 0, pausa: 400, ms: 500, punto: { zona: 'manos', txt: 'Brazos juntos arriba todo el salto' } },
    ] },
  squatJump: { vistas: ['lado', 'frente'], x0: 120,
    poses: [
      { n: 'De pie', hombro: 40, codo: 90, pausa: 300, ms: 500 },
      { n: 'Pausa abajo 2 s', torso: 34, cadera: 92, rodilla: 98, hombro: 50, codo: 80, pausa: 1400, ms: 200, punto: { zona: 'cadera', txt: 'Pausa 2 s abajo, sin rebotar' } },
      { n: 'Salto explosivo', torso: 4, cadera: 4, rodilla: 4, punta: 40, hombro: 30, codo: 70, dy: 40, ms: 300 },
      { n: 'Cae suave', torso: 28, cadera: 65, rodilla: 70, hombro: 45, codo: 80, pausa: 400, ms: 600, punto: { zona: 'rodilla', txt: 'Cae suave, rodillas alineadas' } },
    ] },
  sjSinBrazos: { como: 'squatJump' },
  sjCasa: { como: 'squatJump' },
  cajonSentado: { como: 'squatJump' },
  pogo: { vistas: ['lado'], x0: 120,
    poses: [
      { n: 'Contacto corto', torso: 3, cadera: 5, rodilla: 8, punta: 22, hombro: 20, codo: 80, ms: 170 },
      { n: 'Rebote', torso: 2, cadera: 2, rodilla: 2, punta: 45, hombro: 15, codo: 80, dy: 10, ms: 170, punto: { zona: 'pies', txt: 'Piernas casi rectas, rebotes cortos' } },
    ] },

  // ── Flexiones ──────────────────────────────────────────────
  flexExpl: { vistas: ['lado'], x0: 40,
    poses: [
      { n: 'Plancha', giro: 74, punta: 14, hombro: 90, codo: 0, pausa: 300, ms: 900 },
      { n: 'Baja controlado', giro: 80, punta: 10, hombro: 40, codo: 95, pausa: 150, ms: 250, punto: { zona: 'cadera', txt: 'Cadera alineada, sin dejarla caer' } },
      { n: 'Empuja explosivo', giro: 62, punta: 18, hombro: 105, codo: 0, ms: 250 },
    ] },
  flexCasa: { como: 'flexExpl' },
  flexPalmada: { como: 'flexExpl' },
  flexRapidas: { como: 'flexExpl' },

  // ── Máquinas de pierna ─────────────────────────────────────
  prensa: { vistas: ['lado'], ancla: 'cadera', x0: 82, y0: 140,
    equipo: [{ tipo: 'rect', x: 44, y: 147, w: 52, h: 6 }, { tipo: 'linea', x1: 66, y1: 153, x2: 66, y2: 182 }, { tipo: 'respaldo' }, { tipo: 'carro', riel: 135 }],
    poses: [
      { n: 'Piernas casi extendidas', torso: -50, cadera: 85, rodilla: 6, punta: -135, hombro: 75, codo: 10, pausa: 400, ms: 1600 },
      { n: 'Baja a 90°', torso: -50, cadera: 130, rodilla: 92, punta: -135, hombro: 75, codo: 10, pausa: 300, ms: 900, punto: { zona: 'cadera', txt: 'La cadera no se despega del asiento' } },
      { n: 'Empuja sin bloquear', torso: -50, cadera: 92, rodilla: 14, punta: -135, hombro: 75, codo: 10, ms: 400, punto: { zona: 'rodilla', txt: 'Sin bloquear las rodillas arriba' } },
    ] },
  smith: { vistas: ['lado', 'frente'], x0: 128, mano: 'barra', ancho: 15,
    poses: [
      { n: 'De pie, barra en la espalda', torso: 4, cadera: 4, hombro: -62, codo: 150, pausa: 500, ms: 1500 },
      { n: 'Abajo', torso: 30, cadera: 108, rodilla: 115, hombro: -40, codo: 150, pausa: 300, ms: 600, punto: { zona: 'pies', txt: 'Talones pegados al piso' } },
    ] },
  sentBarra: { como: 'smith' },
  // ── Activación ─────────────────────────────────────────────
  mtobillo: { vistas: ['lado'], x0: 150, equipo: [{ tipo: 'muro', x: 172 }],
    poses: [
      { n: 'Pie cerca de la pared', torso: 6, cadera: 28, rodilla: 30, cadera2: -24, rodilla2: 18, punta2: 35, hombro: 70, codo: 30, pausa: 300, ms: 900 },
      { n: 'Rodilla hacia la pared', torso: 8, cadera: 48, rodilla: 78, cadera2: -24, rodilla2: 22, punta2: 40, hombro: 75, codo: 40, pausa: 400, ms: 900, punto: { zona: 'pies', txt: 'El talón no se despega del piso' } },
    ] },
  ytw: { vistas: ['frente'], x0: 120, brazosF: true,
    poses: [
      { n: 'Y', hF: 150, cF: 0, pausa: 500, ms: 600 },
      { n: 'T', hF: 90, cF: 0, pausa: 500, ms: 600, punto: { zona: 'hombro', txt: 'Hombros lejos de las orejas' } },
      { n: 'W', hF: 45, cF: 135, pausa: 500, ms: 700 },
    ] },
  ytwInclinado: { como: 'ytw' },
  puente: { vistas: ['lado'], x0: 168,
    poses: [
      { n: 'Abajo', torso: -95, cadera: 55, rodilla: 145, hombro: 0, codo: 0, pausa: 300, ms: 700 },
      { n: 'Arriba 2 s', torso: -112, cadera: 0, rodilla: 112, hombro: 0, codo: 0, pausa: 1200, ms: 700, punto: { zona: 'cadera', txt: 'Aprieta el glúteo arriba, sin arquear la espalda' } },
    ] },
  puentePies: { como: 'puente' },
  puente1: { vistas: ['lado'], x0: 168, apoyo: 2,
    poses: [
      { n: 'Abajo, una pierna arriba', torso: -95, cadera: 50, rodilla: 0, cadera2: 55, rodilla2: 145, hombro: 0, codo: 0, pausa: 300, ms: 700 },
      { n: 'Arriba con la cadera nivelada', torso: -112, cadera: 0, rodilla: 0, cadera2: 0, rodilla2: 112, hombro: 0, codo: 0, pausa: 900, ms: 700, punto: { zona: 'cadera', txt: 'Empuja con el talón, cadera nivelada' } },
    ] },
  hipMaq: { vistas: ['lado'], x0: 172, equipo: [{ tipo: 'banco', x: 58, ancho: 44, alto: 32 }, { tipo: 'rodillo', en: 'cadera', dy: -8 }],
    poses: [
      { n: 'Abajo', torso: -55, cadera: 70, rodilla: 125, hombro: 0, codo: 0, pausa: 300, ms: 800 },
      { n: 'Arriba, recto', torso: -90, cadera: 0, rodilla: 90, hombro: 0, codo: 0, pausa: 700, ms: 800, punto: { zona: 'cadera', txt: 'Sube con el glúteo, no arqueando la espalda' } },
    ] },
  hipthrust: { como: 'hipMaq' },
  aductorMaq: { vistas: ['frente'], ancla: 'cadera', x0: 120, y0: 140, juntas: true,
    equipo: [{ tipo: 'rect', x: 96, y: 144, w: 48, h: 6 }, { tipo: 'linea', x1: 120, y1: 150, x2: 120, y2: 182 }, { tipo: 'almohadillas' }],
    poses: [
      { n: 'Piernas abiertas', cadera: 90, rodilla: 90, hombro: 10, codo: 20, ancho: 30, pausa: 300, ms: 900 },
      { n: 'Cierra controlado', cadera: 90, rodilla: 90, hombro: 10, codo: 20, ancho: 10, pausa: 300, ms: 1300, punto: { zona: 'rodilla', txt: 'Cierra controlado y abre lento' } },
    ] },
  sumo: { vistas: ['frente', 'lado'], x0: 128, mano: 'goblet', juntas: true, ancho: 26,
    poses: [
      { n: 'De pie, pies abiertos', torso: 5, cadera: 5, hombro: 0, codo: 0, pausa: 400, ms: 1300 },
      { n: 'Abajo', torso: 22, cadera: 92, rodilla: 96, hombro: 18, codo: 0, pausa: 300, ms: 800, punto: { zona: 'rodilla', txt: 'Rodillas hacia afuera, siguiendo a los pies' } },
    ] },

  // ── Core y prevención ──────────────────────────────────────
  copen: { vistas: ['lado'], x0: 104, apoyo: 'cuerpo', equipo: [{ tipo: 'banco', x: 158, ancho: 52, alto: 38 }],
    poses: [
      { n: 'Cadera abajo', giro: -95, cadera: -18, hombro: -100, codo: 90, pausa: 300, ms: 700 },
      { n: 'Cadera arriba, cuerpo recto', giro: -100, cadera: 0, hombro: -100, codo: 90, pausa: 1500, ms: 700, punto: { zona: 'cadera', txt: 'Cuerpo en línea, la cadera no cae' } },
    ] },
  copenRod: { como: 'copen' },
  copenSofa: { como: 'copen' },
  pallof: { vistas: ['frente'], x0: 120, juntas: true, equipo: [{ tipo: 'torre', x: 26 }, { tipo: 'cable', x: 30, y: 96, lado: 0 }],
    poses: [
      { n: 'Manos al pecho', torso: 0, cadera: 8, rodilla: 12, hombro: 25, codo: 120, ancho: 15, pausa: 300, ms: 700 },
      { n: 'Empuja al frente', torso: 0, cadera: 8, rodilla: 12, hombro: 85, codo: 0, ancho: 15, pausa: 900, ms: 700, punto: { zona: 'espalda', txt: 'El torso no gira hacia la polea' } },
    ] },
  // ── Sesión B ───────────────────────────────────────────────
  slam: { vistas: ['lado'], x0: 112, mano: 'balon',
    poses: [
      { n: 'Balón arriba en streamline', rodilla: 4, punta: 20, hombro: 172, codo: 10, pausa: 300, ms: 260 },
      { n: 'Lánzalo al piso con todo', torso: 42, cadera: 52, rodilla: 30, hombro: 20, codo: 5, ms: 450, punto: { zona: 'espalda', txt: 'El golpe sale del abdomen, no solo de los brazos' } },
      { n: 'Recógelo con la espalda recta', torso: 50, cadera: 92, rodilla: 75, hombro: 42, codo: 5, pausa: 300, ms: 700, punto: { zona: 'espalda', txt: 'Espalda recta al recoger' } },
    ] },
  slamCuerda: { como: 'slam' },
  slamSuave: { como: 'slam' },
  pechoPared: { vistas: ['lado'], x0: 104, mano: 'balon', equipo: [{ tipo: 'muro', x: 196 }],
    poses: [
      { n: 'Balón en el pecho', torso: 5, cadera: 10, rodilla: 12, hombro: 22, codo: 132, pausa: 300, ms: 200 },
      { n: 'Lanza fuerte', torso: 8, cadera: 10, rodilla: 10, hombro: 88, codo: 0, bal: 0, ms: 380, punto: { zona: 'codo', txt: 'Codos cerca del cuerpo, no abiertos' } },
      { n: 'Atrapa y repite', torso: 5, cadera: 12, rodilla: 14, hombro: 70, codo: 50, pausa: 150, ms: 300 },
    ] },
  jalon: { vistas: ['lado'], ancla: 'cadera', x0: 106, y0: 136, mano: 'barra',
    equipo: [{ tipo: 'rect', x: 80, y: 140, w: 46, h: 6 }, { tipo: 'linea', x1: 103, y1: 146, x2: 103, y2: 182 }, { tipo: 'torre', x: 150, y0: 8 }, { tipo: 'cable', x: 150, y: 14 }, { tipo: 'rodillo', en: 'rodilla', dy: -8, dx: -4 }],
    poses: [
      { n: 'Brazos arriba', torso: -8, cadera: 92, rodilla: 95, hombro: 168, codo: 12, pausa: 300, ms: 700 },
      { n: 'Barra al pecho alto', torso: -16, cadera: 98, rodilla: 95, hombro: 22, codo: 138, pausa: 300, ms: 1200, punto: { zona: 'codo', txt: 'Codos abajo y atrás, pecho alto' } },
    ] },
  remoPolea: { vistas: ['lado'], ancla: 'cadera', x0: 74, y0: 150,
    equipo: [{ tipo: 'rect', x: 44, y: 154, w: 60, h: 6 }, { tipo: 'linea', x1: 74, y1: 160, x2: 74, y2: 182 }, { tipo: 'rect', x: 172, y: 128, w: 6, h: 40 }, { tipo: 'torre', x: 212, y0: 110 }, { tipo: 'cable', x: 212, y: 146 }],
    poses: [
      { n: 'Brazos estirados', torso: 8, cadera: 88, rodilla: 25, punta: -10, hombro: 82, codo: 0, pausa: 300, ms: 700 },
      { n: 'Jala con los codos', torso: -4, cadera: 82, rodilla: 25, punta: -10, hombro: -25, codo: 105, pausa: 500, ms: 1000, punto: { zona: 'espalda', txt: 'Pecho alto, aprieta los omóplatos' } },
    ] },
  remoMaq: { como: 'remoPolea' },
  remoCasa: { como: 'remoPolea' },
  pulloverPolea: { vistas: ['lado'], x0: 104, equipo: [{ tipo: 'torre', x: 208, y0: 12 }, { tipo: 'cable', x: 208, y: 22, agarre: 'cuerda' }],
    poses: [
      { n: 'Brazos arriba', torso: 22, cadera: 22, rodilla: 12, hombro: 150, codo: 12, pausa: 300, ms: 1000 },
      { n: 'Baja hasta los muslos', torso: 24, cadera: 24, rodilla: 12, hombro: 12, codo: 10, pausa: 300, ms: 1100, punto: { zona: 'codo', txt: 'Brazos casi rectos, como el barrido de la brazada' } },
    ] },
  pullover: { como: 'pulloverPolea' },
  rotExtPolea: { vistas: ['frente'], x0: 120, brazosF: true, rotF: 2, equipo: [{ tipo: 'torre', x: 26 }, { tipo: 'cable', x: 30, y: 118, lado: 1 }],
    poses: [
      { n: 'Codo pegado, mano al frente', hF: 4, hF2: 6, rF2: 5, pausa: 300, ms: 1000 },
      { n: 'Gira hacia afuera', hF: 4, hF2: 6, rF2: 80, pausa: 300, ms: 1100, punto: { zona: 'codo', txt: 'El codo no se separa del cuerpo' } },
    ] },
  rotExt: { como: 'rotExtPolea' },
  rotExtManc: { como: 'rotExtPolea' },
  facepull: { vistas: ['lado'], x0: 96, equipo: [{ tipo: 'torre', x: 210, y0: 40 }, { tipo: 'cable', x: 210, y: 76, agarre: 'cuerda' }],
    poses: [
      { n: 'Brazos al frente', torso: -4, cadera: 8, rodilla: 10, hombro: 92, codo: 0, pausa: 300, ms: 900 },
      { n: 'Jala hacia la cara', torso: -4, cadera: 8, rodilla: 10, hombro: 100, codo: 125, pausa: 500, ms: 900, punto: { zona: 'codo', txt: 'Codos altos y abre las manos al final' } },
    ] },
  hollow: { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Acostado', giro: -90, hombro: 175, pausa: 300, ms: 900 },
      { n: 'Hollow: aguanta', giro: -90, torso: 16, cadera: 36, hombro: 162, cabeza: 8, pausa: 1800, ms: 800, punto: { zona: 'espalda', txt: 'Espalda baja pegada al piso' } },
    ] },
  hollowRod: { como: 'hollow' },
  dominadas: { vistas: ['lado'], ancla: 'cadera', x0: 116, y0: 106, equipo: [{ tipo: 'barraFija', x1: 70, x2: 170, y: 24 }],
    poses: [
      { n: 'Colgado, brazos estirados', torso: 0, cadera: 12, rodilla: 35, hombro: 176, codo: 0, pausa: 400, ms: 900, punto: { zona: 'hombro', txt: 'Empieza con los brazos estirados' } },
      { n: 'Pecho a la barra', torso: -10, cadera: 14, rodilla: 40, hombro: 12, codo: 150, dy: 44, pausa: 200, ms: 1500, punto: { zona: 'cadera', txt: 'Sin balanceo; baja en 3 s' } },
    ] },
  domAsist: { como: 'dominadas' },
  remoInv: { vistas: ['lado'], x0: 210, equipo: [{ tipo: 'barraFija', x1: 112, x2: 168, y: 100 }],
    poses: [
      { n: 'Colgado bajo la barra', giro: -68, punta: -60, hombro: 92, codo: 0, pausa: 300, ms: 900 },
      { n: 'Pecho a la barra', giro: -58, punta: -50, hombro: 40, codo: 105, pausa: 300, ms: 900, punto: { zona: 'cadera', txt: 'Cuerpo recto, la cadera no cae' } },
    ] },
  // ── Sesión C ───────────────────────────────────────────────
  patinador: { vistas: ['frente'], x0: 120,
    poses: [
      { n: 'Sobre la pierna izquierda', apoyo: 1, lat: -32, torso: 25, cadera: 45, rodilla: 50, cadera2: 70, rodilla2: 110, ancho: 6, hF: 30, hF2: 20, pausa: 500, ms: 260 },
      { n: 'Salto lateral', apoyo: 1, lat: 0, torso: 15, cadera: 20, rodilla: 25, cadera2: 20, rodilla2: 30, ancho: 10, dy: 18, ms: 260 },
      { n: 'Cae en la otra pierna, estable', apoyo: 2, lat: 32, torso: 25, cadera: 70, rodilla: 110, cadera2: 45, rodilla2: 50, ancho: 6, pausa: 600, ms: 260, punto: { zona: 'rodilla', txt: 'Rodilla alineada al caer, quieto 1 s' } },
      { n: 'Salto de vuelta', apoyo: 2, lat: 0, torso: 15, cadera: 20, rodilla: 30, cadera2: 20, rodilla2: 25, ancho: 10, dy: 18, ms: 260 },
    ] },
  pasosBanda: { como: 'patinador' },
  rotacional: { vistas: ['frente'], x0: 120, mano: 'balon', brazosF: true, equipo: [{ tipo: 'muro', x: 10 }],
    poses: [
      { n: 'Balón a la cadera derecha', torso: 10, cadera: 20, rodilla: 25, hF: -40, cF: 0, hF2: 35, cF2: 0, ancho: 16, pausa: 300, ms: 300 },
      { n: 'Gira y lanza a la pared', torso: 5, cadera: 10, rodilla: 12, hF: 75, cF: 0, hF2: -35, cF2: 0, ancho: 16, bal: 0, pausa: 200, ms: 600, punto: { zona: 'cadera', txt: 'El giro empieza en la cadera, no en los brazos' } },
    ] },
  rotBanda: { como: 'rotacional' },
  bulgara: { vistas: ['lado'], x0: 168, mano: 'mancuernas', equipo: [{ tipo: 'banco', x: 62, ancho: 50, alto: 40 }],
    poses: [
      { n: 'Arriba, pie atrás en el banco', torso: 8, cadera: 22, rodilla: 8, cadera2: -25, rodilla2: 60, punta2: -20, hombro: 0, codo: 0, pausa: 300, ms: 1300 },
      { n: 'Baja vertical', torso: 12, cadera: 78, rodilla: 92, cadera2: -5, rodilla2: 125, punta2: -40, hombro: 0, codo: 0, pausa: 300, ms: 800, punto: { zona: 'rodilla', txt: 'Baja como un ascensor, rodilla alineada' } },
    ] },
  bulgaraSofa: { como: 'bulgara' },
  zancada: { vistas: ['lado'], x0: 150, mano: 'mancuernas',
    poses: [
      { n: 'De pie', torso: 4, hombro: 0, codo: 0, pausa: 300, ms: 900 },
      { n: 'Paso atrás y baja', torso: 8, cadera: 80, rodilla: 86, cadera2: -15, rodilla2: 52, punta2: 60, hombro: 0, codo: 0, pausa: 300, ms: 700, punto: { zona: 'rodilla', txt: 'Rodilla de adelante alineada con el pie' } },
    ] },
  stepup: { como: 'zancada' },
  pressMil: { vistas: ['lado', 'frente'], x0: 128, mano: 'mancuernas', brazosF: true,
    poses: [
      { n: 'Mancuernas en los hombros', torso: 0, rodilla: 5, hombro: 18, codo: 152, hF: 90, cF: 90, pausa: 300, ms: 700 },
      { n: 'Empuja arriba', torso: 0, rodilla: 5, hombro: 172, codo: 4, hF: 168, cF: 6, pausa: 300, ms: 1000, punto: { zona: 'espalda', txt: 'Abdomen apretado, sin arquear la espalda' } },
    ] },
  landmine: { como: 'pressMil' },
  superman: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo', equipo: [{ tipo: 'colchoneta', x: 30, ancho: 180 }],
    poses: [
      { n: 'Boca abajo en streamline', giro: 90, hombro: 178, pausa: 300, ms: 800 },
      { n: 'Despega pecho y piernas', giro: 90, torso: -14, cadera: -18, hombro: 175, cabeza: -4, pausa: 1500, ms: 800, punto: { zona: 'cabeza', txt: 'Mira al piso, no hacia arriba' } },
    ] },
  birddog: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo',
    poses: [
      { n: 'En cuatro apoyos', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: 90, codo: 0, pausa: 300, ms: 800 },
      { n: 'Brazo y pierna contrarios', giro: 90, cadera: 90, rodilla: 90, punta: 90, cadera2: 0, rodilla2: 0, punta2: 60, hombro: 178, hombro2: 90, codo: 0, pausa: 900, ms: 800, punto: { zona: 'espalda', txt: 'Espalda quieta, sin arquear' } },
    ] },
  deadbug: { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', equipo: [{ tipo: 'colchoneta', x: 40, ancho: 170 }],
    poses: [
      { n: 'Brazos al techo, rodillas a 90°', giro: -90, cadera: 90, rodilla: 90, hombro: 90, codo: 0, pausa: 300, ms: 900 },
      { n: 'Baja brazo y pierna contrarios', giro: -90, cadera: 90, rodilla: 90, cadera2: 15, rodilla2: 0, hombro: 170, hombro2: 90, codo: 0, pausa: 400, ms: 900, punto: { zona: 'espalda', txt: 'Espalda baja pegada al piso' } },
      { n: 'Vuelve', giro: -90, cadera: 90, rodilla: 90, hombro: 90, codo: 0, pausa: 200, ms: 900 },
      { n: 'Cambia de lado', giro: -90, cadera: 15, rodilla: 0, cadera2: 90, rodilla2: 90, hombro: 90, hombro2: 170, codo: 0, pausa: 400, ms: 900 },
    ] },

  // ── Movilidad ──────────────────────────────────────────────
  toracica: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo',
    poses: [
      { n: 'Codo hacia el piso', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: 70, codo: 140, hombro2: 90, codo2: 0, pausa: 300, ms: 1000 },
      { n: 'Codo hacia el techo', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: -95, codo: 140, hombro2: 90, codo2: 0, cabeza: -15, pausa: 800, ms: 1000, punto: { zona: 'codo', txt: 'Gira la espalda alta, no la cadera' } },
    ] },
  gatoCamello: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo',
    poses: [
      { n: 'Gato: espalda redonda', giro: 92, cadera: 92, rodilla: 92, punta: 90, hombro: 92, codo: 0, cabeza: 35, pausa: 600, ms: 1400 },
      { n: 'Camello: mira al frente', giro: 86, cadera: 86, rodilla: 86, punta: 90, hombro: 86, codo: 0, cabeza: -30, pausa: 600, ms: 1400 },
    ] },
  rana: { vistas: ['lado'], x0: 110, apoyo: 'cuerpo',
    poses: [
      { n: 'En cuatro apoyos, rodillas abiertas', giro: 90, cadera: 90, rodilla: 90, punta: 90, hombro: 90, codo: 0, pausa: 400, ms: 1500 },
      { n: 'Cadera atrás', giro: 90, cadera: 135, rodilla: 135, punta: 90, hombro: 150, codo: 0, pausa: 1500, ms: 1500, punto: { zona: 'cadera', txt: 'Despacio, sin forzar' } },
    ] },
  dorsalPared: { vistas: ['lado'], x0: 120, equipo: [{ tipo: 'muro', x: 206 }],
    poses: [
      { n: 'Manos en la pared', torso: 35, cadera: 35, rodilla: 6, hombro: 145, codo: 0, pausa: 400, ms: 1500 },
      { n: 'Baja el pecho', torso: 78, cadera: 84, rodilla: 10, hombro: 178, codo: 0, pausa: 1500, ms: 1500, punto: { zona: 'hombro', txt: 'Siente el estiramiento bajo la axila' } },
    ] },
  dorsalPuerta: { como: 'dorsalPared' },
  respPared: { vistas: ['lado'], ancla: 'cadera', x0: 150, y0: 176, equipo: [{ tipo: 'muro', x: 156 }, { tipo: 'colchoneta', x: 40, ancho: 120 }],
    poses: [
      { n: 'Inhala 4 s por la nariz', giro: -90, cadera: 88, rodilla: 0, punta: 0, hombro: 30, codo: 60, torso: 1, ms: 4000 },
      { n: 'Bota el aire en 6 s', giro: -90, cadera: 88, rodilla: 0, punta: 0, hombro: 30, codo: 60, torso: -1, ms: 6000, punto: { zona: 'espalda', txt: 'Respira lento: 4 s adentro, 6 s afuera' } },
    ] },
  circBrazos: { vistas: ['frente'], x0: 120, brazosF: true,
    poses: [
      { n: 'Brazos abajo', hF: 20, ms: 450 },
      { n: 'Al frente', hF: 90, ms: 450 },
      { n: 'Arriba', hF: 170, ms: 450 },
      { n: 'Atrás y abajo', hF: 90, ms: 450 },
    ] },
  movGeneral: { como: 'circBrazos' },
  salidaImag: { como: 'sstream' },
  streamPared: { vistas: ['frente'], x0: 120, brazosF: true,
    poses: [
      { n: 'W contra la pared', hF: 80, cF: 100, pausa: 300, ms: 1000 },
      { n: 'Sube a streamline', hF: 172, cF: 4, pausa: 400, ms: 1000, punto: { zona: 'manos', txt: 'Brazos pegados a la pared, espalda baja también' } },
    ] },

  // ── Plan B en casa ─────────────────────────────────────────
  cardio: { vistas: ['lado'], x0: 120,
    poses: [
      { n: 'Zancada', apoyo: 1, torso: 10, cadera: 35, rodilla: 25, cadera2: -20, rodilla2: 75, punta2: 30, hombro: -30, codo: 90, hombro2: 35, codo2: 90, ms: 260 },
      { n: 'Cambia de pierna', apoyo: 2, torso: 10, cadera: -20, rodilla: 75, punta: 30, cadera2: 35, rodilla2: 25, hombro: 35, codo: 90, hombro2: -30, codo2: 90, ms: 260 },
    ] },
  cuerda: { como: 'pogo' },
  brazadaBanda: { vistas: ['lado'], x0: 96, equipo: [{ tipo: 'poste', x: 214, y: 110 }, { tipo: 'banda', x: 214, y: 112 }],
    poses: [
      { n: 'Brazos estirados al frente', torso: 45, cadera: 45, rodilla: 15, hombro: 132, codo: 0, pausa: 200, ms: 500 },
      { n: 'Barrido hacia adentro', torso: 45, cadera: 45, rodilla: 15, hombro: 72, codo: 95, ms: 350, punto: { zona: 'codo', txt: 'Codos altos en el barrido' } },
      { n: 'Recobro rápido al frente', torso: 45, cadera: 45, rodilla: 15, hombro: 112, codo: 60, ms: 250 },
    ] },
  libreBanda: { como: 'pulloverPolea' },
  patadaSeco: { vistas: ['lado'], ancla: 'cadera', x0: 112, y0: 132, equipo: [{ tipo: 'rect', x: 110, y: 136, w: 110, h: 10 }, { tipo: 'linea', x1: 210, y1: 146, x2: 210, y2: 182 }, { tipo: 'linea', x1: 118, y1: 146, x2: 118, y2: 182 }],
    poses: [
      { n: 'Piernas estiradas', giro: 90, torso: 0, cadera: 0, rodilla: 0, punta: 90, hombro: 150, codo: 30, pausa: 300, ms: 700 },
      { n: 'Talones al glúteo', giro: 90, cadera: 20, rodilla: 120, punta: 0, hombro: 150, codo: 30, ms: 600 },
      { n: 'Patada y junta los pies', giro: 90, cadera: -5, rodilla: 0, punta: 90, hombro: 150, codo: 30, pausa: 500, ms: 500, punto: { zona: 'pies', txt: 'Termina juntando bien los pies' } },
    ] },
  // ── Los que faltaban ───────────────────────────────────────
  m9090: { vistas: ['frente'], ancla: 'cadera', x0: 120, y0: 170, ancho: 10,
    poses: [
      { n: 'Rodillas a la izquierda', cadera: 120, rodilla: 140, hombro: -20, rodLat: -24, pausa: 400, ms: 1100 },
      { n: 'Rodillas a la derecha', cadera: 120, rodilla: 140, hombro: -20, rodLat: 24, pausa: 400, ms: 1100, punto: { zona: 'espalda', txt: 'Pecho alto, gira sin apoyar las manos' } },
    ] },
  sentRapida: { vistas: ['lado', 'frente'], x0: 128, ancho: 14,
    poses: [
      { n: 'De pie', torso: 2, hombro: 80, codo: 0, pausa: 200, ms: 600 },
      { n: 'Abajo', torso: 26, cadera: 96, rodilla: 100, hombro: 88, codo: 0, ms: 350, punto: { zona: 'pies', txt: 'Talones abajo, sube rápido' } },
    ] },
  hiper: { vistas: ['lado'], ancla: 'cadera', x0: 128, y0: 104, equipo: [{ tipo: 'rodillo', en: 'cadera', dy: 6, dx: 4 }, { tipo: 'linea', x1: 132, y1: 116, x2: 132, y2: 182 }, { tipo: 'linea', x1: 74, y1: 150, x2: 132, y2: 116 }],
    poses: [
      { n: 'Abajo', giro: 60, torso: 75, cadera: 75, hombro: 25, codo: 140, pausa: 300, ms: 1000 },
      { n: 'Sube hasta quedar recto', giro: 60, torso: 0, hombro: 25, codo: 140, pausa: 500, ms: 1000, punto: { zona: 'espalda', txt: 'Hasta quedar recto, sin pasarte' } },
    ] },
  balonRod: { vistas: ['lado'], x0: 168, equipo: [{ tipo: 'objeto', en: 'rodilla', dy: 0, r: 6 }],
    poses: [
      { n: 'Aprieta el balón', torso: -95, cadera: 55, rodilla: 145, hombro: 0, codo: 0, pausa: 2000, ms: 400, punto: { zona: 'rodilla', txt: 'Aprieta fuerte, respirando normal' } },
      { n: 'Suelta', torso: -95, cadera: 55, rodilla: 145, hombro: 0, codo: 0, pausa: 800, ms: 400 },
    ] },
  // ── Fuerza (máquinas y mancuernas) ─────────────────────────
  curlFem: { vistas: ['lado'], ancla: 'cadera', x0: 96, y0: 128,
    equipo: [{ tipo: 'rect', x: 70, y: 132, w: 52, h: 6 }, { tipo: 'linea', x1: 94, y1: 138, x2: 94, y2: 182 }, { tipo: 'respaldo' }, { tipo: 'rodillo', en: 'rodilla', dx: -10, dy: -8 }, { tipo: 'rodillo', en: 'tobillo', dx: 0, dy: 7 }],
    poses: [
      { n: 'Piernas estiradas', torso: -12, cadera: 92, rodilla: 8, punta: 0, hombro: 25, codo: 40, pausa: 300, ms: 450 },
      { n: 'Talones al glúteo, explosivo', torso: -12, cadera: 92, rodilla: 105, punta: 0, hombro: 25, codo: 40, pausa: 200, ms: 1500, punto: { zona: 'cadera', txt: 'Sube rápido, baja lento; la cadera no se despega' } },
    ] },
  talones: { vistas: ['lado'], x0: 132, dy: 0, puntas: true, equipo: [{ tipo: 'rect', x: 112, y: 168, w: 26, h: 14, r: 2 }, { tipo: 'rodillo', en: 'hombro', dy: -6 }],
    poses: [
      { n: 'Talones abajo', punta: -18, hombro: 150, codo: 160, dy: 14, pausa: 300, ms: 450 },
      { n: 'Sube explosivo en puntas', punta: 40, hombro: 150, codo: 160, dy: 14, pausa: 400, ms: 1200, punto: { zona: 'pies', txt: 'Sube rápido y baja lento hasta estirar' } },
    ] },
  prensaUna: { como: 'prensa' },
  pressPecho: { vistas: ['lado'], ancla: 'cadera', x0: 92, y0: 130, mano: 'barra',
    equipo: [{ tipo: 'rect', x: 66, y: 134, w: 46, h: 6 }, { tipo: 'linea', x1: 88, y1: 140, x2: 88, y2: 182 }, { tipo: 'respaldo' }],
    poses: [
      { n: 'Agarres al pecho', torso: -6, cadera: 92, rodilla: 92, hombro: -12, codo: 110, pausa: 300, ms: 450 },
      { n: 'Empuja explosivo', torso: -6, cadera: 92, rodilla: 92, hombro: 86, codo: 6, pausa: 200, ms: 1500, punto: { zona: 'hombro', txt: 'Hombros pegados al respaldo, sin bloquear los codos' } },
    ] },
  pressHombroMaq: { vistas: ['lado'], ancla: 'cadera', x0: 100, y0: 130, mano: 'barra',
    equipo: [{ tipo: 'rect', x: 74, y: 134, w: 46, h: 6 }, { tipo: 'linea', x1: 96, y1: 140, x2: 96, y2: 182 }, { tipo: 'respaldo' }],
    poses: [
      { n: 'Agarres a los hombros', torso: -6, cadera: 92, rodilla: 92, hombro: 22, codo: 150, pausa: 300, ms: 450 },
      { n: 'Empuja arriba explosivo', torso: -6, cadera: 92, rodilla: 92, hombro: 170, codo: 6, pausa: 200, ms: 1500, punto: { zona: 'espalda', txt: 'Espalda pegada al respaldo, sin arquear' } },
    ] },
  remoMano: { vistas: ['lado'], x0: 112, mano: 'mancuernas', equipo: [{ tipo: 'banco', x: 62, ancho: 82, alto: 34 }],
    poses: [
      { n: 'Brazo estirado', torso: 80, cadera: 85, rodilla: 10, cadera2: 80, rodilla2: 90, punta2: 180, hombro: 80, codo: 0, hombro2: 80, codo2: 0, pausa: 300, ms: 450 },
      { n: 'Jala el codo atrás, explosivo', torso: 80, cadera: 85, rodilla: 10, cadera2: 80, rodilla2: 90, punta2: 180, hombro: 15, codo: 100, hombro2: 80, codo2: 0, pausa: 200, ms: 1300, punto: { zona: 'espalda', txt: 'Espalda recta, sin girar el torso' } },
    ] },

  balanceo: { vistas: ['lado'], x0: 128, apoyo: 2, equipo: [{ tipo: 'muro', x: 64 }],
    poses: [
      { n: 'Pierna atrás', torso: 4, cadera: -28, rodilla: 10, punta: 10, cadera2: 0, rodilla2: 0, punta2: 0, hombro: -60, codo: 20, hombro2: -95, codo2: 0, ms: 600 },
      { n: 'Pierna adelante', torso: 0, cadera: 65, rodilla: 5, punta: 0, cadera2: 0, rodilla2: 0, punta2: 0, hombro: 40, codo: 20, hombro2: -95, codo2: 0, ms: 600, punto: { zona: 'espalda', txt: 'Suelta y controlada, sin arquear la espalda' } },
    ] },

  plancha: { vistas: ['lado'], x0: 40, equipo: [{ tipo: 'colchoneta', x: 26, ancho: 180 }],
    poses: [
      { n: 'Plancha: cuerpo recto', giro: 80, punta: 12, hombro: 80, codo: 92, pausa: 1500, ms: 600, punto: { zona: 'cadera', txt: 'Cadera alineada, ni caída ni muy arriba' } },
      { n: 'Aguanta respirando', giro: 80, punta: 12, hombro: 80, codo: 92, cabeza: 4, pausa: 1500, ms: 600 },
    ] },
  planchaLat: { vistas: ['lado'], x0: 120, apoyo: 'cuerpo', equipo: [{ tipo: 'colchoneta', x: 26, ancho: 180 }],
    poses: [
      { n: 'Cadera abajo', giro: -80, cadera: -15, hombro: -80, codo: 90, pausa: 300, ms: 700 },
      { n: 'Cadera arriba, cuerpo recto', giro: -76, cadera: 0, hombro: -76, codo: 90, pausa: 1500, ms: 700, punto: { zona: 'cadera', txt: 'Cuerpo en línea, la cadera no cae' } },
    ] },
};
