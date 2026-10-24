/* Cosmitrón · Aventura Galáctica — versión independiente en HTML, CSS y JS */
(function () {
  'use strict';

  /* ============================ utilidades ============================ */
  function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function normalize(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[.,;:!?¡¿"'()]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fmt(seconds) {
    const total = Math.max(0, seconds || 0);
    return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
  }

  /* ============================ datos ============================ */
  const PLANETS = [
    {
      id: 'chispa', name: 'Planeta Chispa', short: 'Chispa', subject: 'Matemáticas', emoji: '🔥',
      color: '#FDBA74', deep: '#C2410C', tagline: 'Volcanes que escupen números',
      intro: '¡Uf, qué calor! Este planeta tiene volcanes que escupen cuentas. Si las resuelves, la puerta estelar se abre.',
      rounds: 5, seconds: 0,
    },
    {
      id: 'palabra', name: 'Planeta Palabra', short: 'Palabra', subject: 'Lengua', emoji: '📚',
      color: '#C4B5FD', deep: '#5B21B6', tagline: 'Un mundo hecho de letras que flotan',
      intro: 'Aquí las letras flotan como burbujas. Ordena oraciones y descubre palabras para encender el motor.',
      rounds: 5, seconds: 0,
    },
    {
      id: 'burbuja', name: 'Planeta Burbuja', short: 'Burbuja', subject: 'Ciencias Naturales', emoji: '🌱',
      color: '#6EE7B7', deep: '#047857', tagline: 'Selvas, animales y agua que brilla',
      intro: '¡Mira tanta vida! Este planeta está lleno de animales y plantas. Demuestra lo que sabes de la naturaleza.',
      rounds: 5, seconds: 0,
    },
    {
      id: 'acertijo', name: 'Planeta Acertijo', short: 'Acertijo', subject: 'Acertijos y lógica', emoji: '🧩',
      color: '#F9A8D4', deep: '#9D174D', tagline: 'Un laberinto de adivinanzas',
      intro: 'Las rocas de este planeta hablan en adivinanzas. Piensa con calma y ¡adivina la respuesta!',
      rounds: 5, seconds: 0,
    },
    {
      id: 'ritmo', name: 'Planeta Ritmo', short: 'Ritmo', subject: 'Matemáticas exprés', emoji: '⚡',
      color: '#7DD3FC', deep: '#0369A1', tagline: 'Cuentas a toda velocidad',
      intro: '¡Cuidado! Aquí el tiempo corre rapidísimo. Resuelve la mayor cantidad de cuentas antes de que se acabe el reloj.',
      rounds: 8, seconds: 45,
    },
    {
      id: 'silueta', name: 'Planeta Silueta', short: 'Silueta', subject: 'Formas y lógica', emoji: '🔷',
      color: '#FDE68A', deep: '#B45309', tagline: 'Figuras gigantes de cristal',
      intro: 'Todo en este planeta tiene forma de figura geométrica. Une, cuenta y mide para seguir tu camino.',
      rounds: 5, seconds: 0,
    },
    {
      id: 'tierra', name: 'Planeta Tierra', short: 'Tierra', subject: 'Desafío final', emoji: '🌍',
      color: '#86EFAC', deep: '#0F766E', tagline: '¡Tu casa, al fin!',
      intro: '¡Lo lograste, casi! La Tierra está ahí abajo. Resuelve el último desafío contra el reloj para aterrizar.',
      rounds: 8, seconds: 120, final: true,
    },
  ];

  const ACCESSORIES = [
    { id: 'corona', label: 'Corona', emoji: '👑', slot: 'cabeza' },
    { id: 'copa', label: 'Sombrero de copa', emoji: '🎩', slot: 'cabeza' },
    { id: 'fiesta', label: 'Gorro de fiesta', emoji: '🥳', slot: 'cabeza' },
    { id: 'vaquero', label: 'Sombrero vaquero', emoji: '🤠', slot: 'cabeza' },
    { id: 'gorra', label: 'Gorra de capitán', emoji: '🧢', slot: 'cabeza' },
    { id: 'lentes', label: 'Lentes de sol', emoji: '🕶️', slot: 'cara' },
    { id: 'monoculo', label: 'Monóculo', emoji: '🧐', slot: 'cara' },
    { id: 'antifaz', label: 'Antifaz de héroe', emoji: '🦸', slot: 'cara' },
    { id: 'nariz', label: 'Nariz de payaso', emoji: '🔴', slot: 'cara' },
    { id: 'bigote', label: 'Bigote', emoji: '🥸', slot: 'boca' },
    { id: 'barba', label: 'Barba de sabio', emoji: '🧙', slot: 'boca' },
  ];

  const TIERS = [
    { id: 'facil', ages: '6 a 8 años', label: 'Explorador novato', emoji: '🌱' },
    { id: 'astro', ages: '9 a 11 años', label: 'Astro experto', emoji: '🚀' },
  ];

  const MISSION =
    'Agente Cosmitrón, tu misión es secreta: la Tierra perdió sus colores y solo tú puedes salvarla. Cruza los siete planetas, resuelve los retos y reúne el código secreto antes de que se apague la última estrella.';

  /* ---------- generadores de matemáticas ---------- */
  const FRIENDS = ['Lumi', 'Nova', 'Tito', 'Kira', 'Zum', 'Cosmitrón'];

  function numericChoice(prompt, answer, extra) {
    const values = [String(answer)];
    const offsets = shuffle([1, -1, 2, -2, 3, -3, 10, -10]);
    for (let i = 0; i < offsets.length; i++) {
      const candidate = answer + offsets[i];
      if (candidate >= 0 && values.indexOf(String(candidate)) === -1 && values.length < 4) {
        values.push(String(candidate));
      }
    }
    const options = shuffle(values);
    const result = { type: 'choice', prompt: prompt, options: options, answer: options.indexOf(String(answer)) };
    if (extra) Object.keys(extra).forEach(function (k) { result[k] = extra[k]; });
    return result;
  }

  function mathSum(tier, asChoice) {
    const easy = tier === 'facil';
    const a = easy ? rnd(2, 9) : rnd(14, 58);
    const b = easy ? rnd(2, 9) : rnd(11, 39);
    const result = a + b;
    const prompt = '¿Cuánto es ' + a + ' + ' + b + '?';
    const explanation = a + ' + ' + b + ' = ' + result + '.';
    return asChoice ? numericChoice(prompt, result, { explanation: explanation })
      : { type: 'input', prompt: prompt, answer: String(result), explanation: explanation };
  }

  function mathSub(tier, asChoice) {
    const easy = tier === 'facil';
    const a = easy ? rnd(10, 19) : rnd(45, 98);
    const b = easy ? rnd(2, 9) : rnd(9, 39);
    const result = a - b;
    const prompt = '¿Cuánto es ' + a + ' − ' + b + '?';
    const explanation = a + ' − ' + b + ' = ' + result + '.';
    return asChoice ? numericChoice(prompt, result, { explanation: explanation })
      : { type: 'input', prompt: prompt, answer: String(result), explanation: explanation };
  }

  function mathMul(tier) {
    const a = rnd(2, tier === 'facil' ? 5 : 9);
    const b = rnd(2, tier === 'facil' ? 5 : 9);
    return numericChoice('¿Cuánto es ' + a + ' × ' + b + '?', a * b, {
      explanation: a + ' × ' + b + ' = ' + a * b + '.',
    });
  }

  function mathDiv(tier) {
    const divisor = rnd(2, tier === 'facil' ? 5 : 8);
    const quotient = rnd(2, tier === 'facil' ? 5 : 9);
    const total = divisor * quotient;
    return numericChoice('¿Cuánto es ' + total + ' ÷ ' + divisor + '?', quotient, {
      explanation: divisor + ' × ' + quotient + ' = ' + total + ', así que ' + total + ' ÷ ' + divisor + ' = ' + quotient + '.',
    });
  }

  function mathWord(tier, name) {
    if (tier === 'facil') {
      const templates = [
        function () {
          const a = rnd(6, 14), b = rnd(3, 9);
          return { prompt: name + ' guarda ' + a + ' estrellas en su mochila y encuentra ' + b + ' más en el planeta. ¿Cuántas estrellas tiene ahora?', answer: String(a + b), explanation: a + ' + ' + b + ' = ' + (a + b) + ' estrellas.' };
        },
        function () {
          const a = rnd(5, 12), b = rnd(3, 8);
          return { prompt: name + ' ve ' + a + ' lunas pequeñas y de pronto aparecen ' + b + ' más. ¿Cuántas lunas hay en el cielo?', answer: String(a + b), explanation: a + ' + ' + b + ' = ' + (a + b) + ' lunas.' };
        },
        function () {
          const a = rnd(12, 20), b = rnd(3, 9);
          return { prompt: 'Había ' + a + ' cristales de luz y ' + name + ' usa ' + b + ' para el motor. ¿Cuántos cristales quedan?', answer: String(a - b), explanation: a + ' − ' + b + ' = ' + (a - b) + ' cristales.' };
        },
        function () {
          const friend = pick(FRIENDS), a = rnd(7, 15), b = rnd(4, 9);
          return { prompt: friend + ' le regala ' + a + ' semillas espaciales a ' + name + ' y luego le da ' + b + ' más. ¿Cuántas semillas tiene ' + name + '?', answer: String(a + b), explanation: a + ' + ' + b + ' = ' + (a + b) + ' semillas.' };
        },
      ];
      const chosen = pick(templates)();
      return { type: 'input', prompt: chosen.prompt, answer: chosen.answer, explanation: chosen.explanation };
    }

    const templates = [
      function () {
        const boxes = rnd(3, 9), perBox = rnd(3, 8);
        return { prompt: 'Cada caja tiene ' + perBox + ' cristales. Si ' + name + ' carga ' + boxes + ' cajas, ¿cuántos cristales lleva en total?', answer: String(boxes * perBox), explanation: boxes + ' × ' + perBox + ' = ' + (boxes * perBox) + ' cristales.' };
      },
      function () {
        const pots = rnd(3, 8), perPot = rnd(2, 9);
        return { prompt: name + ' reparte ' + (pots * perPot) + ' semillas en ' + pots + ' macetas, poniendo la misma cantidad en cada una. ¿Cuántas semillas van en cada maceta?', answer: String(perPot), explanation: (pots * perPot) + ' ÷ ' + pots + ' = ' + perPot + ' semillas por maceta.' };
      },
      function () {
        const start = rnd(60, 95), used = rnd(12, 39);
        return { prompt: 'El tanque tenía ' + start + ' litros de combustible y ' + name + ' gasta ' + used + ' en el despegue. ¿Cuántos litros quedan?', answer: String(start - used), explanation: start + ' − ' + used + ' = ' + (start - used) + ' litros.' };
      },
      function () {
        const trips = rnd(4, 9), seats = rnd(4, 9);
        return { prompt: 'El cohete lleva ' + seats + ' pasajeros en cada viaje. ¿Cuántos pasajeros lleva ' + name + ' en ' + trips + ' viajes?', answer: String(trips * seats), explanation: trips + ' × ' + seats + ' = ' + (trips * seats) + ' pasajeros.' };
      },
    ];
    const chosen = pick(templates)();
    return { type: 'input', prompt: chosen.prompt, answer: chosen.answer, explanation: chosen.explanation };
  }

  function buildMathChallenges(tier, count, format, name) {
    const easy = tier === 'facil';
    const operations = easy ? ['suma', 'resta', 'resta'] : ['suma', 'resta', 'multi', 'division'];
    const challenges = [];
    for (let i = 0; i < count; i++) {
      const kind = i === count - 1 ? 'problema' : pick(operations);
      const asChoice = format === 'choice' ? true : i % 2 === 0;
      if (kind === 'suma') challenges.push(mathSum(tier, asChoice));
      else if (kind === 'resta') challenges.push(mathSub(tier, asChoice));
      else if (kind === 'multi') challenges.push(mathMul(tier));
      else if (kind === 'division') challenges.push(mathDiv(tier));
      else challenges.push(mathWord(tier, name));
    }
    return challenges;
  }

  /* ---------- bancos de retos ---------- */
  const PALABRA = {
    facil: [
      { type: 'choice', prompt: '¿Cuál palabra está bien escrita?', options: ['escuela', 'eskuela', 'escuvela', 'escvela'], answer: 0, explanation: 'Se escribe «escuela», con c y con u.' },
      { type: 'order', prompt: 'Toca las palabras en orden para formar la oración.', tokens: ['Cosmitrón', 'viaja', 'en', 'cohete'], answer: 'Cosmitrón viaja en cohete', hint: 'La oración empieza con el nombre del monstruo.', explanation: 'La oración correcta es: Cosmitrón viaja en cohete.' },
      { type: 'truefalse', prompt: 'La primera palabra de una oración se escribe con mayúscula.', answer: true, explanation: 'Sí. Toda oración empieza con mayúscula y termina con punto.' },
      { type: 'choice', prompt: '¿Cuál es el plural de «estrella»?', options: ['estrellas', 'estrellaes', 'estrella', 'estrellitas'], answer: 0, explanation: 'Agregando una «s» obtenemos «estrellas».' },
      { type: 'choice', prompt: '¿Qué palabra significa lo mismo que «feliz»?', options: ['contento', 'triste', 'enojado', 'cansado'], answer: 0, explanation: '«Contento» es un sinónimo de «feliz».' },
    ],
    astro: [
      { type: 'choice', prompt: '¿Cuál oración está escrita correctamente?', options: ['Mañana visitaremos Marte.', 'mañana visitaremos marte.', 'Mañana visitaremos marte', 'mañana Visitaremos Marte.'], answer: 0, explanation: 'Empieza con mayúscula, los nombres propios van con mayúscula y termina en punto.' },
      { type: 'order', prompt: 'Ordena las palabras para formar una oración con sentido.', tokens: ['El', 'monstruo', 'rosado', 'descubrió', 'un', 'planeta', 'nuevo'], answer: 'El monstruo rosado descubrió un planeta nuevo', hint: 'Primero el sujeto, después la acción.', explanation: 'La oración correcta es: El monstruo rosado descubrió un planeta nuevo.' },
      { type: 'truefalse', prompt: 'Las palabras agudas llevan tilde cuando terminan en vocal, en n o en s.', answer: true, explanation: 'Correcto: por ejemplo «canción», «café» y «compás».' },
      { type: 'choice', prompt: '¿Cuál es un sinónimo de «enorme»?', options: ['gigante', 'pequeño', 'diminuto', 'corto'], answer: 0, explanation: '«Gigante» significa lo mismo que «enorme».' },
      { type: 'choice', prompt: '¿Cuál de estas palabras es un verbo?', options: ['saltar', 'estrella', 'rápido', 'azul'], answer: 0, explanation: '«Saltar» es una acción, por lo tanto es un verbo.' },
    ],
  };

  const BURBUJA = {
    facil: [
      { type: 'pairs', prompt: 'Une cada animal con el lugar donde vive.', pairs: [['Pez', 'Agua'], ['Pájaro', 'Nido'], ['Abeja', 'Colmena'], ['Topo', 'Madriguera']], explanation: 'Cada animal tiene un hogar diferente y especial.' },
      { type: 'choice', prompt: '¿Qué necesitan las plantas para crecer?', options: ['Agua y luz del sol', 'Solo piedras', 'Nada en absoluto', 'Solo viento'], answer: 0, explanation: 'Las plantas necesitan agua, luz y tierra para crecer.' },
      { type: 'truefalse', prompt: 'El Sol es una estrella.', answer: true, explanation: 'Sí. El Sol es la estrella más cercana a la Tierra.' },
      { type: 'choice', prompt: '¿Cuál de estos animales es un mamífero?', options: ['Delfín', 'Tiburón', 'Pulpo', 'Rana'], answer: 0, explanation: 'El delfín respira aire y alimenta a sus crías con leche: es un mamífero.' },
      { type: 'input', prompt: '¿En qué estado está el agua cuando se congela?', answer: 'sólido', accept: ['solido', 'hielo'], hint: 'Puede ser líquida, gaseosa o…', explanation: 'Cuando el agua se congela pasa al estado sólido: se convierte en hielo.' },
    ],
    astro: [
      { type: 'pairs', prompt: 'Une cada órgano con el sistema al que pertenece.', pairs: [['Corazón', 'Circulatorio'], ['Pulmones', 'Respiratorio'], ['Cerebro', 'Nervioso'], ['Estómago', 'Digestivo']], explanation: 'Cada órgano trabaja dentro de un sistema del cuerpo humano.' },
      { type: 'choice', prompt: '¿Qué planeta es conocido como el planeta rojo?', options: ['Marte', 'Venus', 'Júpiter', 'Neptuno'], answer: 0, explanation: 'Marte se ve rojizo por el óxido de hierro de su superficie.' },
      { type: 'truefalse', prompt: 'La Luna produce su propia luz.', answer: false, explanation: 'La Luna no tiene luz propia: refleja la luz del Sol.' },
      { type: 'input', prompt: '¿Cuántos planetas tiene el sistema solar?', answer: '8', accept: ['ocho'], explanation: 'Son ocho: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno.' },
      { type: 'choice', prompt: '¿Qué gas respiramos las personas para vivir?', options: ['Oxígeno', 'Helio', 'Metano', 'Hidrógeno'], answer: 0, explanation: 'Nuestro cuerpo necesita oxígeno para obtener energía.' },
    ],
  };

  const ACERTIJO = {
    facil: [
      { type: 'choice', prompt: 'Tengo hojas pero no soy árbol, tengo lomo pero no soy animal. ¿Qué soy?', options: ['Un libro', 'Una silla', 'Una nube', 'Un zapato'], answer: 0, explanation: 'El libro tiene hojas de papel y lomo como los animales.' },
      { type: 'order', prompt: 'Ordena las letras y descubre el animal escondido.', tokens: ['A', 'G', 'T', 'O'], answer: 'gato', join: '', hint: 'Es un animal que dice «miau».', explanation: 'Las letras forman la palabra GATO.' },
      { type: 'choice', prompt: 'Vuela sin alas y silba sin boca. ¿Qué es?', options: ['El viento', 'El Sol', 'La Luna', 'Una nube'], answer: 0, explanation: 'El viento se mueve y suena, pero no tiene alas ni boca.' },
      { type: 'input', prompt: 'Si hoy es martes, ¿qué día será mañana?', answer: 'miércoles', accept: ['miercoles'], explanation: 'Después del martes viene el miércoles.' },
      { type: 'choice', prompt: 'Cuanto más grande es, menos se ve. ¿Qué es?', options: ['La oscuridad', 'Una estrella', 'Una montaña', 'Un espejo'], answer: 0, explanation: 'Cuanta más oscuridad hay, menos se ve. ¡Buen acertijo!' },
    ],
    astro: [
      { type: 'input', prompt: 'Soy un número de dos cifras. Si me das la vuelta sigo siendo el mismo y soy mayor que 80. ¿Quién soy?', answer: '88', hint: 'Tiene las dos cifras iguales.', explanation: 'El 88 se lee igual al derecho y al revés.' },
      { type: 'input', prompt: 'Un caracol sube 3 metros cada día y no resbala nunca. ¿Cuántos días tarda en salir de un pozo de 12 metros?', answer: '4', accept: ['cuatro'], explanation: '12 ÷ 3 = 4 días.' },
      { type: 'choice', prompt: 'Ana es más alta que Beto y Beto es más alto que Carla. ¿Quién es el más alto?', options: ['Ana', 'Beto', 'Carla', 'No se puede saber'], answer: 0, explanation: 'Ana es la más alta de los tres.' },
      { type: 'order', prompt: 'Ordena los planetas del más cercano al más lejano del Sol.', tokens: ['Mercurio', 'Venus', 'Tierra', 'Marte'], answer: 'Mercurio Venus Tierra Marte', explanation: 'El orden es Mercurio, Venus, Tierra y Marte.' },
      { type: 'choice', prompt: '¿Cuántos meses del año tienen 28 días?', options: ['Todos los meses', 'Solo uno', 'Ninguno', 'Solo dos'], answer: 0, explanation: 'Todos los meses tienen al menos 28 días.' },
    ],
  };

  const SILUETA = {
    facil: [
      { type: 'choice', prompt: '¿Cuántos lados tiene un triángulo?', options: ['3', '4', '5', '2'], answer: 0, explanation: 'El triángulo tiene tres lados y tres vértices.' },
      { type: 'pairs', prompt: 'Une cada figura con un objeto que tenga esa forma.', pairs: [['Círculo', 'Rueda'], ['Cuadrado', 'Ventana'], ['Triángulo', 'Vela de barco'], ['Rectángulo', 'Puerta']], explanation: 'Las figuras geométricas están en todas partes.' },
      { type: 'choice', prompt: '¿Qué figura tiene cuatro lados iguales?', options: ['Cuadrado', 'Triángulo', 'Círculo', 'Óvalo'], answer: 0, explanation: 'El cuadrado tiene cuatro lados iguales y cuatro esquinas.' },
      { type: 'input', prompt: 'Si tienes 3 cajas y en cada una hay 2 estrellas, ¿cuántas estrellas hay?', answer: '6', accept: ['seis'], explanation: '3 × 2 = 6 estrellas.' },
      { type: 'truefalse', prompt: 'Un círculo tiene esquinas.', answer: false, explanation: 'El círculo es completamente redondo: no tiene esquinas.' },
    ],
    astro: [
      { type: 'choice', prompt: '¿Cuánto suman los ángulos interiores de un triángulo?', options: ['180°', '90°', '360°', '100°'], answer: 0, explanation: 'Los tres ángulos de cualquier triángulo suman 180°.' },
      { type: 'input', prompt: 'Un cuadrado tiene lados de 5 cm. ¿Cuál es su perímetro en centímetros?', answer: '20', hint: 'Suma sus cuatro lados.', explanation: '5 × 4 = 20 cm de perímetro.' },
      { type: 'pairs', prompt: 'Une cada figura con su cantidad de lados.', pairs: [['Triángulo', '3 lados'], ['Cuadrado', '4 lados'], ['Pentágono', '5 lados'], ['Hexágono', '6 lados']], explanation: 'Los nombres de las figuras cuentan sus lados en griego.' },
      { type: 'choice', prompt: '¿Qué figura tiene todos sus puntos a la misma distancia del centro?', options: ['Círculo', 'Cuadrado', 'Rombo', 'Trapecio'], answer: 0, explanation: 'En el círculo, el radio siempre mide lo mismo.' },
      { type: 'input', prompt: 'Un tren sale con 24 pasajeros y bajan 9 en la primera estación. ¿Cuántos pasajeros quedan?', answer: '15', explanation: '24 − 9 = 15 pasajeros.' },
    ],
  };

  const BANK = { palabra: PALABRA, burbuja: BURBUJA, acertijo: ACERTIJO, silueta: SILUETA };

  function buildChallenges(planetId, tier, playerName) {
    const name = playerName || 'explorador';
    if (planetId === 'chispa') return buildMathChallenges(tier, 5, 'mixed', name);
    if (planetId === 'ritmo') return buildMathChallenges(tier, 8, 'choice', name);
    if (planetId === 'tierra') {
      const math = buildMathChallenges(tier, 3, 'mixed', name);
      const lengua = shuffle(BANK.palabra[tier]).slice(0, 2);
      const ciencias = shuffle(BANK.burbuja[tier]).slice(0, 2);
      const logica = [pick(BANK.acertijo[tier])];
      return shuffle(math.concat(lengua, ciencias, logica));
    }
    return shuffle(BANK[planetId] ? BANK[planetId][tier] : BANK.palabra[tier]);
  }

  /* ============================ estado ============================ */
  const KEY = 'cosmitron-independiente-v1';
  const stored = (function () {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  })();

  const app = {
    name: stored.name || '',
    tier: stored.tier || 'facil',
    accessories: Array.isArray(stored.accessories) ? stored.accessories : [],
    points: stored.points || 0,
    progress: stored.progress || {},
    best: Array.isArray(stored.best) ? stored.best : [],
    sound: stored.sound !== false,
  };

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(app)); } catch (e) { /* sin almacenamiento */ }
  }

  let view = 'start';
  let editing = false;
  let rankingOpen = false;
  let session = null;
  const draft = { name: app.name, tier: app.tier, accessories: app.accessories.slice() };

  /* ============================ sonido y voz ============================ */
  let audioCtx = null;

  function beep(freq, duration, type) {
    if (!app.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audioCtx = audioCtx || new Ctx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) { /* sin audio */ }
  }

  const sfx = {
    tap: function () { beep(520, 0.07); },
    ok: function () { beep(660, 0.1); setTimeout(function () { beep(880, 0.14); }, 90); },
    bad: function () { beep(190, 0.2, 'triangle'); },
    flip: function () { beep(430, 0.06); },
    star: function () { beep(990, 0.12); },
  };

  function speak(text) {
    if (!text || !app.sound || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.pitch = 1.5;
      utterance.rate = 1.02;
      window.speechSynthesis.speak(utterance);
    } catch (e) { /* sin voz */ }
  }

  /* ============================ personaje ============================ */
  let svgId = 0;

  function accessoryShapes(ids) {
    const has = function (id) { return ids.indexOf(id) !== -1; };
    let out = '';

    if (has('copa')) {
      out += '<g><ellipse cx="100" cy="60" rx="38" ry="9" fill="#1F2937"/><rect x="76" y="10" width="48" height="48" rx="4" fill="#111827"/><rect x="76" y="40" width="48" height="9" fill="#F472B6"/></g>';
    }
    if (has('corona')) {
      out += '<g><path d="M64 64 L62 40 L80 52 L100 32 L120 52 L138 40 L136 64 Z" fill="#FBBF24" stroke="#B45309" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="46" r="4" fill="#FDE68A"/><circle cx="76" cy="52" r="3" fill="#FDE68A"/><circle cx="124" cy="52" r="3" fill="#FDE68A"/></g>';
    }
    if (has('fiesta')) {
      out += '<g><path d="M100 6 L132 62 L68 62 Z" fill="#F472B6" stroke="#BE185D" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="8" r="7" fill="#FDE68A"/><circle cx="100" cy="34" r="4" fill="#FDE68A"/><circle cx="90" cy="50" r="4" fill="#7DD3FC"/></g>';
    }
    if (has('vaquero')) {
      out += '<g><path d="M68 62 C68 34 80 26 100 26 C120 26 132 34 132 62 Z" fill="#C2410C" stroke="#7C2D12" stroke-width="3" stroke-linejoin="round"/><ellipse cx="100" cy="62" rx="56" ry="11" fill="#9A3412" stroke="#7C2D12" stroke-width="3"/><rect x="68" y="50" width="64" height="9" fill="#FBBF24"/><circle cx="100" cy="42" r="5" fill="#FDE68A"/></g>';
    }
    if (has('gorra')) {
      out += '<g><path d="M66 62 C66 32 134 32 134 62 Z" fill="#2563EB" stroke="#1E3A8A" stroke-width="3" stroke-linejoin="round"/><ellipse cx="100" cy="62" rx="46" ry="9" fill="#1E3A8A"/><circle cx="100" cy="46" r="8" fill="#FBBF24"/><path d="M100 40 l2 4.4 4.8 .6-3.5 3.3 1 4.7-4.3-2.4-4.3 2.4 1-4.7-3.5-3.3 4.8-.6z" fill="#FEF3C7"/></g>';
    }
    if (has('lentes')) {
      out += '<g><g fill="#111827" fill-opacity="0.92"><rect x="50" y="84" width="42" height="26" rx="12"/><rect x="108" y="84" width="42" height="26" rx="12"/><rect x="90" y="92" width="20" height="7" rx="3"/></g><path d="M60 92 L72 104" stroke="#ffffff" stroke-opacity="0.5" stroke-width="4" stroke-linecap="round"/><path d="M118 92 L130 104" stroke="#ffffff" stroke-opacity="0.5" stroke-width="4" stroke-linecap="round"/></g>';
    }
    if (has('monoculo')) {
      out += '<g><circle cx="124" cy="98" r="29" fill="#FDE68A" fill-opacity="0.14" stroke="#FBBF24" stroke-width="5"/><path d="M146 118 C158 128 160 144 150 158" stroke="#FBBF24" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M112 86 L126 100" stroke="#ffffff" stroke-opacity="0.6" stroke-width="4" stroke-linecap="round"/></g>';
    }
    if (has('antifaz')) {
      out += '<g><path d="M40 82 C40 64 160 64 160 82 L160 106 C160 122 138 126 124 118 C114 112 108 108 100 108 C92 108 86 112 76 118 C62 126 40 122 40 106 Z" fill="#312E81" stroke="#1E1B4B" stroke-width="3"/><ellipse cx="76" cy="98" rx="20" ry="23" fill="#ffffff"/><ellipse cx="124" cy="98" rx="20" ry="23" fill="#ffffff"/><circle cx="79" cy="103" r="9" fill="#2A0A47"/><circle cx="121" cy="103" r="9" fill="#2A0A47"/><path d="M42 88 C66 74 90 74 100 82" stroke="#A5B4FC" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
    }
    if (has('nariz')) {
      out += '<g><circle cx="100" cy="118" r="11" fill="#EF4444"/><circle cx="96" cy="114" r="3.5" fill="#ffffff" fill-opacity="0.5"/></g>';
    }
    if (has('bigote')) {
      out += '<path d="M78 128 Q88 118 98 126 Q100 129 102 126 Q112 118 122 128 Q112 137 100 132 Q88 137 78 128 Z" fill="#3B0764"/>';
    }
    if (has('barba')) {
      out += '<g><path d="M72 118 C74 152 86 168 100 168 C114 168 126 152 128 118 C120 134 110 128 100 124 C90 128 80 134 72 118 Z" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="3" stroke-linejoin="round"/><path d="M100 134 Q94 148 100 158 Q106 148 100 134 Z" fill="#E2E8F0"/></g>';
    }
    return out;
  }

  function monsterSVG(accessories, mood) {
    svgId += 1;
    const bodyId = 'body' + svgId;
    const shineId = 'shine' + svgId;
    const mouth = mood === 'cheer' ? '<path d="M82 126 Q100 160 118 126 Z" fill="#9D174D"/>' : '<path d="M84 130 Q100 144 116 130" fill="none" stroke="#9D174D" stroke-width="4.5" stroke-linecap="round"/>';
    return (
      '<svg viewBox="0 0 200 200" class="monster-svg" aria-hidden="true">' +
      '<defs><radialGradient id="' + bodyId + '" cx="34%" cy="24%" r="82%">' +
      '<stop offset="0%" stop-color="#FFD3E8"/><stop offset="45%" stop-color="#F9A8D4"/>' +
      '<stop offset="78%" stop-color="#F472B6"/><stop offset="100%" stop-color="#BE185D"/></radialGradient>' +
      '<radialGradient id="' + shineId + '" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>' +
      '<path d="M78 60 C73 44 68 36 60 28" stroke="#F9A8D4" stroke-width="6" stroke-linecap="round" fill="none"/>' +
      '<path d="M122 60 C127 44 132 36 140 28" stroke="#F9A8D4" stroke-width="6" stroke-linecap="round" fill="none"/>' +
      '<circle cx="58" cy="24" r="7" fill="#FDE68A"/><circle cx="142" cy="24" r="7" fill="#7DD3FC"/>' +
      '<ellipse cx="78" cy="172" rx="21" ry="11" fill="#BE185D"/><ellipse cx="122" cy="172" rx="21" ry="11" fill="#BE185D"/>' +
      '<ellipse cx="34" cy="120" rx="13" ry="23" fill="#F472B6" transform="rotate(-22 34 120)"/>' +
      '<ellipse cx="166" cy="120" rx="13" ry="23" fill="#F472B6" transform="rotate(22 166 120)"/>' +
      '<ellipse cx="100" cy="114" rx="66" ry="60" fill="url(#' + bodyId + ')"/>' +
      '<ellipse cx="100" cy="136" rx="40" ry="28" fill="#ffffff" opacity="0.16"/>' +
      '<ellipse cx="66" cy="76" rx="18" ry="14" fill="url(#' + shineId + ')" opacity="0.5"/>' +
      '<ellipse cx="52" cy="124" rx="11" ry="7" fill="#FB7185" opacity="0.4"/>' +
      '<ellipse cx="148" cy="124" rx="11" ry="7" fill="#FB7185" opacity="0.4"/>' +
      '<ellipse cx="76" cy="98" rx="23" ry="27" fill="#ffffff"/><ellipse cx="124" cy="98" rx="23" ry="27" fill="#ffffff"/>' +
      '<circle cx="79" cy="103" r="10.5" fill="#2A0A47"/><circle cx="121" cy="103" r="10.5" fill="#2A0A47"/>' +
      '<circle cx="74" cy="96" r="4" fill="#ffffff"/><circle cx="116" cy="96" r="4" fill="#ffffff"/>' +
      mouth +
      accessoryShapes(accessories || []) +
      '</svg>'
    );
  }

  /* ============================ helpers de vista ============================ */
  function planetStars(id) {
    return (app.progress[id] || {}).stars || 0;
  }

  function isUnlocked(index) {
    if (index === 0) return true;
    return planetStars(PLANETS[index - 1].id) > 0;
  }

  function starsMarkup(count) {
    let out = '';
    for (let i = 0; i < 3; i++) out += i < count ? '★' : '☆';
    return out;
  }

  function topbarHTML() {
    return (
      '<div class="topbar"><div class="brand"><span class="brand-dot"></span> Aventura Galáctica</div>' +
      '<div class="top-actions">' +
      '<button class="icon-btn" data-action="ranking" aria-label="Mejores puntuaciones">🏆</button>' +
      '<button class="icon-btn" data-action="sound" aria-label="Sonido">' + (app.sound ? '🔊' : '🔇') + '</button>' +
      '</div></div>'
    );
  }

  function boardHTML() {
    if (!app.best.length) return '';
    return (
      '<div class="board"><h3>🏆 Mejores puntuaciones</h3><ol>' +
      app.best.map(function (row, i) {
        return '<li><span class="rank">' + (i + 1) + '</span><b>' + esc(row.name) + '</b>' +
          '<span class="score">★ ' + row.points + '</span></li>';
      }).join('') +
      '</ol></div>'
    );
  }

  /* ============================ inicio ============================ */
  function missionHTML() {
    return (
      '<section class="mission"><div class="mission-head"><span>🛡️</span><p>Misión secreta</p></div>' +
      '<p>Cosmitrón es un agente secreto con una sola misión: <strong>salvar el mundo</strong>. La Tierra está perdiendo sus colores y solo tú puedes ayudarlo a llegar antes de que se apague la última estrella.</p>' +
      '<button class="btn btn-mini" data-action="listen">🔊 Escuchar la misión</button></section>'
    );
  }

  function startHTML() {
    const showContinue = Boolean(app.name) && !editing;

    const hero =
      '<section class="hero">' +
      '<button class="monster-btn" data-action="hello" aria-label="Escuchar a Cosmitrón">' + monsterSVG(draft.accessories) + '</button>' +
      '<p class="eyebrow">Cosmitrón presenta</p>' +
      '<h1 class="title"><span class="shine">Aventura</span><br>Galáctica</h1>' +
      '<p class="lead">Cosmitrón es un monstruo rosado con una misión secreta: llegar a la Tierra y salvar el mundo.</p>' +
      '</section>';

    let cardBody;
    if (showContinue) {
      const completed = PLANETS.filter(function (p) { return planetStars(p.id) > 0; }).length;
      cardBody =
        '<p class="label">¡Hola, ' + esc(app.name) + '!</p>' +
        '<p class="hint">' + completed + ' de ' + PLANETS.length + ' planetas · ' + app.points + ' puntos</p>' +
        '<button class="btn btn-primary wide" data-action="continue">Continuar aventura →</button>' +
        '<button class="link" data-action="restart">Empezar de nuevo</button>';
    } else {
      cardBody =
        '<label class="label" for="player-name">¿Cómo te llamas, comandante?</label>' +
        '<p class="hint">Cosmitrón usará tu nombre durante toda la aventura.</p>' +
        '<input id="player-name" type="text" maxlength="14" autocomplete="off" placeholder="Tu nombre" value="' + esc(draft.name) + '" />' +
        '<p class="label" style="margin-top:18px">¿Cuántos años tienes?</p>' +
        '<div class="grid-2">' +
        TIERS.map(function (tier) {
          return '<button class="pick' + (draft.tier === tier.id ? ' active' : '') + '" data-action="tier" data-id="' + tier.id + '">' +
            '<span class="emoji">' + tier.emoji + '</span>' +
            '<p class="pick-title">' + tier.ages + '</p>' +
            '<p class="pick-sub">' + tier.label + '</p></button>';
        }).join('') +
        '</div>' +
        '<p class="label" style="margin-top:18px">Disfrázalo a tu gusto</p>' +
        '<p class="hint">Sombreros, lentes, bigotes y más para tu agente secreto.</p>' +
        '<div class="grid-3">' +
        ACCESSORIES.map(function (item) {
          const active = draft.accessories.indexOf(item.id) !== -1;
          return '<button class="acc' + (active ? ' active' : '') + '" data-action="acc" data-id="' + item.id + '" aria-pressed="' + active + '">' +
            '<span class="emoji">' + item.emoji + '</span><small>' + item.label + '</small></button>';
        }).join('') +
        '</div>' +
        '<button class="btn btn-primary wide" data-action="start"' + (draft.name.trim() ? '' : ' disabled') + '>🚀 ¡Despegar!</button>' +
        (app.name ? '<button class="link" data-action="cancel-edit">Volver</button>' : '');
    }

    const ranking = rankingOpen
      ? '<div class="card">' + (app.best.length ? boardHTML() : '<p class="hint center">Todavía no hay partidas terminadas. ¡Llega a la Tierra para aparecer aquí!</p>') + '</div>'
      : '';

    const steps =
      '<div class="steps">' +
      '<div class="step"><span class="emoji">🧭</span><p>Viaja</p><small>Avanza por 7 planetas hasta llegar a la Tierra.</small></div>' +
      '<div class="step"><span class="emoji">⭐</span><p>Resuelve</p><small>Matemáticas, lengua, ciencias y acertijos.</small></div>' +
      '<div class="step"><span class="emoji">🏆</span><p>Suma</p><small>Gana puntos y estrellas para desbloquear el salto.</small></div>' +
      '</div>';

    return topbarHTML() + hero + missionHTML() + '<div class="card">' + cardBody + '</div>' + ranking + steps +
      '<p class="foot">El progreso se guarda en este dispositivo</p>';
  }

  /* ============================ mapa ============================ */
  function mapHTML() {
    const totalStars = PLANETS.reduce(function (sum, p) { return sum + planetStars(p.id); }, 0);
    const list = PLANETS.map(function (planet, index) {
      const unlocked = isUnlocked(index);
      const stars = planetStars(planet.id);
      return (
        '<button class="planet' + (unlocked ? '' : ' locked') + '" data-action="open" data-planet="' + planet.id + '"' +
        (unlocked ? '' : ' disabled') + '>' +
        '<span class="orb" style="background:radial-gradient(circle at 32% 28%,' + planet.color + ',' + planet.deep + ');color:' + planet.color + '">' + planet.emoji + '</span>' +
        '<span class="planet-text"><p class="planet-name">' + planet.name + '</p>' +
        '<p class="planet-sub">' + planet.subject + '</p></span>' +
        (unlocked
          ? '<span class="planet-stars">' + (stars ? starsMarkup(stars) : '· · ·') + '</span>'
          : '<span class="lock">🔒</span>') +
        '</button>'
      );
    }).join('');

    return (
      topbarHTML() +
      '<h1 class="title sm">Mapa galáctico</h1>' +
      '<p class="lead">Hola, ' + esc(app.name || 'comandante') + '. Elige tu próximo salto.</p>' +
      '<div class="points-row" style="margin-top:12px"><span class="pill">🪐 ' + app.points + ' puntos</span>' +
      '<span class="pill star">★ ' + totalStars + '/' + PLANETS.length * 3 + '</span></div>' +
      '<div class="planets">' + list + '</div>' +
      '<button class="btn btn-ghost wide" data-action="home">Volver al inicio</button>'
    );
  }

  /* ============================ partida ============================ */
  function prepareChallenge(ch) {
    if (ch.type === 'order' && !ch.prepared) {
      ch.original = ch.tokens.slice();
      ch.tokens = shuffle(ch.original.map(function (text, id) { return { id: id, text: text }; }));
      ch.selected = [];
      ch.prepared = true;
    }
    if (ch.type === 'pairs' && !ch.prepared) {
      const flat = [];
      ch.pairs.forEach(function (pair, index) {
        flat.push({ id: index * 2, label: pair[0], pid: index });
        flat.push({ id: index * 2 + 1, label: pair[1], pid: index });
      });
      ch.cards = shuffle(flat);
      ch.open = [];
      ch.matched = [];
      ch.wrong = false;
      ch.prepared = true;
    }
  }

  function briefHTML() {
    const p = session.planet;
    return (
      '<div class="hero">' +
      '<div class="monster-btn" style="pointer-events:none">' + monsterSVG(app.accessories) + '</div>' +
      '<p class="eyebrow">' + esc(app.name || 'comandante') + ' · ' + (p.final ? 'desafío final' : p.subject) + '</p>' +
      '<h1 class="title sm">' + esc(p.name) + '</h1>' +
      '</div>' +
      '<div class="card">' +
      '<p class="label" style="color:#f9a8d4;letter-spacing:.2em;font-size:11px;text-transform:uppercase">Cosmitrón dice</p>' +
      '<p style="margin:8px 0 0;font-size:15px;line-height:1.55">' + esc(p.intro) + '</p>' +
      '<div class="points-row" style="margin-top:14px">' +
      '<span class="pill">' + p.rounds + ' retos</span>' +
      '<span class="pill">' + (p.seconds ? '⏱ ' + p.seconds + ' segundos' : 'Sin reloj') + '</span>' +
      '</div>' +
      '<button class="btn btn-primary wide" data-action="begin">▶ ¡Empezar!</button>' +
      '<button class="link" data-action="map">Volver al mapa</button>' +
      '</div>'
    );
  }

  function challengeBody(ch) {
    if (ch.type === 'choice') {
      return '<div class="options">' + ch.options.map(function (option, index) {
        return '<button class="option" data-action="choice" data-i="' + index + '">' + esc(option) + '</button>';
      }).join('') + '</div>';
    }

    if (ch.type === 'truefalse') {
      return '<div class="options">' +
        '<button class="option" data-action="tf" data-value="true">✅ Verdadero</button>' +
        '<button class="option" data-action="tf" data-value="false">❌ Falso</button></div>';
    }

    if (ch.type === 'input') {
      return '<form class="answer-form" autocomplete="off">' +
        '<input type="text" name="answer" placeholder="Escribe tu respuesta" autocomplete="off" />' +
        '<button class="btn btn-primary" type="submit">Comprobar</button></form>' +
        (ch.hint ? '<p class="hint center" style="margin-top:10px">' + esc(ch.hint) + '</p>' : '');
    }

    if (ch.type === 'order') {
      const built = ch.selected.length
        ? ch.selected.map(function (id, index) {
            const token = ch.tokens.filter(function (t) { return t.id === id; })[0];
            return '<button class="token ghost" data-action="unpick" data-i="' + index + '">' + esc(token ? token.text : '') + '</button>';
          }).join('')
        : '<span class="empty">Toca las palabras en orden…</span>';

      return '<div class="built">' + built + '</div>' +
        '<div class="tokens">' + ch.tokens.map(function (token) {
          const used = ch.selected.indexOf(token.id) !== -1;
          return '<button class="token' + (used ? ' used' : '') + '" data-action="pick" data-id="' + token.id + '"' +
            (used ? ' disabled' : '') + '>' + esc(token.text) + '</button>';
        }).join('') + '</div>' +
        '<button class="btn btn-primary wide" data-action="check-order"' +
        (ch.selected.length === ch.tokens.length ? '' : ' disabled') + '>Comprobar</button>' +
        (ch.hint ? '<p class="hint center" style="margin-top:10px">' + esc(ch.hint) + '</p>' : '');
    }

    if (ch.type === 'pairs') {
      return '<div class="pairs">' + ch.cards.map(function (card, index) {
        const isOpen = ch.open.indexOf(card.id) !== -1;
        const isMatched = ch.matched.indexOf(card.id) !== -1;
        return '<button class="pair' + (isMatched ? ' matched' : isOpen ? ' open' : '') + '" data-action="flip" data-i="' + index + '">' +
          (isOpen || isMatched ? esc(card.label) : '<span class="glyph">✦</span>') + '</button>';
      }).join('') + '</div>' +
        '<p class="muted center" style="margin-top:12px">' + (ch.matched.length / 2) + ' de ' + (ch.cards.length / 2) + ' pares encontrados</p>';
    }

    return '';
  }

  function feedbackHTML() {
    const fb = session && session.feedback;
    if (!fb) return '';
    return (
      '<div class="feedback"><div class="feedback-card ' + (fb.ok ? 'ok' : 'bad') + '">' +
      '<div class="feedback-emoji">' + (fb.ok ? '🎉' : '🙈') + '</div>' +
      '<h2>' + (fb.ok ? '¡Correcto!' : 'Casi…') + '</h2>' +
      (fb.text ? '<p>' + esc(fb.text) + '</p>' : '') +
      (fb.gain ? '<span class="gain">+' + fb.gain + ' puntos</span>' : '') +
      '<button class="btn btn-primary wide" data-action="next">Continuar</button>' +
      '</div></div>'
    );
  }

  function planetHTML() {
    const p = session.planet;
    const ch = session.list[session.index];

    const dots = session.list.map(function (_, index) {
      const cls = index < session.index ? ' done' : index === session.index ? ' now' : '';
      return '<span class="dot' + cls + '"></span>';
    }).join('');

    return (
      '<div class="hud">' +
      '<button class="icon-btn" data-action="leave" aria-label="Volver al mapa">←</button>' +
      '<div><p class="hud-planet">' + esc(p.name) + '</p>' +
      '<p class="hud-sub">Reto ' + (session.index + 1) + ' de ' + session.list.length + '</p></div>' +
      '<div class="hud-right">' +
      (p.seconds ? '<span class="pill">⏱ <span id="timer">' + fmt(session.timeLeft) + '</span></span>' : '') +
      '<span class="pill star">★ ' + session.earned + '</span>' +
      '</div></div>' +
      '<div class="dots">' + dots + '</div>' +
      '<div class="card challenge"><p class="prompt">' + esc(ch.prompt) + '</p>' + challengeBody(ch) + '</div>' +
      feedbackHTML()
    );
  }

  function resultHTML() {
    const r = session.result;
    const p = session.planet;
    const index = PLANETS.map(function (x) { return x.id; }).indexOf(p.id);
    const next = PLANETS[index + 1];
    const canNext = next && planetStars(p.id) > 0;

    return (
      '<div class="card center">' +
      '<p class="eyebrow">' + (r.final ? 'Misión cumplida' : 'Planeta completado') + '</p>' +
      '<h1 class="title sm">' + (r.final ? '¡Llegaste a la Tierra, ' + esc(app.name || 'comandante') + '!' : esc(p.name)) + '</h1>' +
      '<div class="result-stars" style="color:#FBBF24">' + starsMarkup(r.stars) + '</div>' +
      '<p class="hint">' + (r.final
        ? 'Cosmitrón cruzó toda la galaxia resolviendo retos y ya está en casa. ¡Salvaste el mundo!'
        : (r.stars > 0 ? '¡Buen trabajo! Ya puedes saltar al siguiente planeta.' : 'Necesitas al menos una estrella para abrir el próximo salto.')) + '</p>' +
      '<div class="metrics">' +
      '<div class="metric"><b>' + r.correct + '/' + r.total + '</b><span>Aciertos</span></div>' +
      '<div class="metric"><b>★ ' + r.earned + '</b><span>Puntos</span></div>' +
      '<div class="metric"><b>' + app.points + '</b><span>Total</span></div>' +
      '</div>' +
      (r.bonus ? '<p class="hint" style="margin-top:10px;color:#7DD3FC">+' + r.bonus + ' puntos extra por el tiempo que sobró</p>' : '') +
      (r.final ? boardHTML() : '') +
      (canNext ? '<button class="btn btn-primary wide" data-action="open" data-planet="' + next.id + '">Ir a ' + esc(next.short) + ' →</button>' : '') +
      '<button class="btn btn-ghost wide" data-action="map">Volver al mapa</button>' +
      '<button class="link" data-action="home">Volver al inicio</button>' +
      '</div>'
    );
  }

  /* ============================ render ============================ */
  function render() {
    let body;
    if (view === 'map') body = mapHTML();
    else if (view === 'brief') body = briefHTML();
    else if (view === 'planet') body = planetHTML();
    else if (view === 'result') body = resultHTML();
    else body = startHTML();

    document.getElementById('app').innerHTML = '<div class="inner">' + body + '</div>';
  }

  function syncTimer() {
    const node = document.getElementById('timer');
    if (node && session) node.textContent = fmt(session.timeLeft);
  }

  /* ============================ flujo del juego ============================ */
  function openPlanet(id) {
    const planet = PLANETS.filter(function (p) { return p.id === id; })[0];
    if (!planet) return;
    clearInterval(session && session.timer);
    session = {
      planet: planet,
      list: buildChallenges(id, app.tier, app.name),
      index: 0,
      correct: 0,
      streak: 0,
      earned: 0,
      feedback: null,
      timeLeft: planet.seconds || 0,
      timer: null,
    };
    view = 'brief';
    sfx.tap();
    render();
  }

  function beginPlanet() {
    if (!session) return;
    prepareChallenge(session.list[0]);
    view = 'planet';
    render();
    startTimer();
    speak(session.planet.intro);
  }

  function startTimer() {
    if (!session || !session.planet.seconds) return;
    clearInterval(session.timer);
    session.timeLeft = session.planet.seconds;
    syncTimer();
    session.timer = setInterval(function () {
      session.timeLeft -= 1;
      syncTimer();
      if (session.timeLeft <= 0) {
        clearInterval(session.timer);
        finishPlanet();
      }
    }, 1000);
  }

  function answerChallenge(ok, explanation) {
    const ch = session.list[session.index];
    const text = explanation || ch.explanation || '';

    if (ok) {
      session.correct += 1;
      session.streak += 1;
      const gain = 100 + Math.min(session.streak - 1, 3) * 20;
      session.earned += gain;
      session.feedback = { ok: true, text: text, gain: gain };
      sfx.ok();
    } else {
      session.streak = 0;
      session.feedback = { ok: false, text: text, gain: 0 };
      sfx.bad();
      speak('Casi, sigue intentando.');
    }
    render();
  }

  function nextChallenge() {
    session.feedback = null;
    session.index += 1;
    if (session.index >= session.list.length) {
      finishPlanet();
      return;
    }
    prepareChallenge(session.list[session.index]);
    render();
  }

  function finishPlanet() {
    if (!session || session.result) return;
    clearInterval(session.timer);
    const planet = session.planet;
    const total = session.list.length;
    const ratio = session.correct / total;
    const stars = ratio >= 0.85 ? 3 : ratio >= 0.6 ? 2 : ratio > 0 ? 1 : 0;
    let earned = session.earned;
    let bonus = 0;

    if (planet.seconds && session.correct > 0) {
      bonus = Math.max(0, session.timeLeft) * 3;
      earned += bonus;
    }

    app.points += earned;
    const previous = app.progress[planet.id] || { stars: 0, best: 0 };
    app.progress[planet.id] = { stars: Math.max(previous.stars || 0, stars), best: Math.max(previous.best || 0, earned) };

    if (planet.final) {
      app.best = app.best
        .concat([{ name: app.name || 'comandante', points: app.points, stars: stars, date: Date.now() }])
        .sort(function (a, b) { return b.points - a.points; })
        .slice(0, 10);
    }

    save();
    session.result = { stars: stars, correct: session.correct, total: total, earned: earned, bonus: bonus, final: Boolean(planet.final) };
    view = 'result';
    if (planet.final) speak('¡Misión cumplida, comandante! Llegamos a la Tierra.');
    else sfx.star();
    render();
  }

  function leavePlanet() {
    clearInterval(session && session.timer);
    session = null;
    view = 'map';
    render();
  }

  function goHome() {
    clearInterval(session && session.timer);
    session = null;
    editing = false;
    rankingOpen = false;
    view = 'start';
    render();
  }

  function toggleAccessory(id) {
    const target = ACCESSORIES.filter(function (item) { return item.id === id; })[0];
    if (!target) return;
    const index = draft.accessories.indexOf(id);
    if (index !== -1) {
      draft.accessories.splice(index, 1);
    } else {
      draft.accessories = draft.accessories.filter(function (current) {
        const meta = ACCESSORIES.filter(function (item) { return item.id === current; })[0];
        return !meta || meta.slot !== target.slot;
      });
      draft.accessories.push(id);
    }
    sfx.tap();
    render();
  }

  function startGame() {
    const clean = draft.name.trim().slice(0, 14);
    if (!clean) return;
    app.name = clean;
    app.tier = draft.tier;
    app.accessories = draft.accessories.slice();
    save();
    view = 'map';
    speak('¡Allá vamos, ' + clean + '! Soy Cosmitrón y esta es una misión secreta para salvar el mundo.');
    render();
  }

  /* ============================ eventos ============================ */
  document.addEventListener('click', function (event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.getAttribute('data-action');

    if (action === 'sound') {
      app.sound = !app.sound;
      save();
      render();
      return;
    }

    if (action === 'ranking') {
      rankingOpen = !rankingOpen;
      sfx.tap();
      render();
      return;
    }

    if (action === 'listen') {
      speak(MISSION);
      return;
    }

    if (action === 'hello') {
      speak(pick(['¡Hola! Soy Cosmitrón.', '¡Qué bueno verte, comandante!', 'Esta es una misión secreta para salvar el mundo.']));
      sfx.tap();
      return;
    }

    if (action === 'tier') {
      draft.tier = target.getAttribute('data-id');
      sfx.tap();
      render();
      return;
    }

    if (action === 'acc') {
      toggleAccessory(target.getAttribute('data-id'));
      return;
    }

    if (action === 'start') {
      startGame();
      return;
    }

    if (action === 'continue') {
      view = 'map';
      render();
      return;
    }

    if (action === 'restart') {
      editing = true;
      draft.name = '';
      draft.accessories = app.accessories.slice();
      draft.tier = app.tier;
      render();
      return;
    }

    if (action === 'cancel-edit') {
      editing = false;
      draft.name = app.name;
      render();
      return;
    }

    if (action === 'home') {
      goHome();
      return;
    }

    if (action === 'map') {
      leavePlanet();
      return;
    }

    if (action === 'open') {
      openPlanet(target.getAttribute('data-planet'));
      return;
    }

    if (action === 'begin') {
      beginPlanet();
      return;
    }

    if (action === 'leave') {
      leavePlanet();
      return;
    }

    if (action === 'next') {
      nextChallenge();
      return;
    }

    if (!session) return;
    const ch = session.list[session.index];
    if (session.feedback || !ch) return;

    if (action === 'choice') {
      const index = Number(target.getAttribute('data-i'));
      answerChallenge(index === ch.answer);
      return;
    }

    if (action === 'tf') {
      const value = target.getAttribute('data-value') === 'true';
      answerChallenge(value === ch.answer);
      return;
    }

    if (action === 'pick') {
      const id = Number(target.getAttribute('data-id'));
      if (ch.selected.indexOf(id) === -1) {
        ch.selected.push(id);
        sfx.tap();
        render();
      }
      return;
    }

    if (action === 'unpick') {
      const index = Number(target.getAttribute('data-i'));
      ch.selected.splice(index, 1);
      sfx.tap();
      render();
      return;
    }

    if (action === 'check-order') {
      const joiner = typeof ch.join === 'string' ? ch.join : ' ';
      const built = ch.selected
        .map(function (id) {
          const token = ch.tokens.filter(function (t) { return t.id === id; })[0];
          return token ? token.text : '';
        })
        .join(joiner);
      answerChallenge(normalize(built) === normalize(ch.answer));
      return;
    }

    if (action === 'flip') {
      if (ch.wrong || ch.open.length >= 2) return;
      const index = Number(target.getAttribute('data-i'));
      const card = ch.cards[index];
      if (!card) return;
      if (ch.open.indexOf(card.id) !== -1 || ch.matched.indexOf(card.id) !== -1) return;

      sfx.flip();
      ch.open.push(card.id);

      if (ch.open.length === 2) {
        const first = ch.cards.filter(function (c) { return c.id === ch.open[0]; })[0];
        const second = ch.cards.filter(function (c) { return c.id === ch.open[1]; })[0];
        if (first && second && first.pid === second.pid) {
          ch.matched.push(first.id, second.id);
          ch.open = [];
          sfx.star();
          if (ch.matched.length === ch.cards.length) {
            setTimeout(function () {
              if (session && session.list[session.index] === ch && !session.feedback) {
                answerChallenge(true);
              }
            }, 420);
            return;
          }
        } else {
          ch.wrong = true;
          setTimeout(function () {
            ch.open = [];
            ch.wrong = false;
            if (view === 'planet' && session && session.list[session.index] === ch) render();
          }, 780);
        }
      }
      render();
    }
  });

  document.addEventListener('submit', function (event) {
    const form = event.target;
    if (!form.classList || !form.classList.contains('answer-form')) return;
    event.preventDefault();
    if (!session || session.feedback) return;

    const ch = session.list[session.index];
    const input = form.querySelector('input[name="answer"]');
    const value = normalize(input ? input.value : '');
    if (!value) return;

    const accepted = [ch.answer].concat(ch.accept || []).map(normalize);
    answerChallenge(accepted.indexOf(value) !== -1);
  });

  document.addEventListener('input', function (event) {
    if (event.target && event.target.id === 'player-name') {
      draft.name = event.target.value;
      const button = document.querySelector('[data-action="start"]');
      if (button) button.disabled = !draft.name.trim();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && document.activeElement && document.activeElement.id === 'player-name') {
      startGame();
    }
  });

  render();
})();
