const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function numericChoice(prompt, answer, extra = {}) {
  const values = new Set([String(answer)]);
  const offsets = shuffle([1, -1, 2, -2, 3, -3, 10, -10]);
  for (const offset of offsets) {
    const candidate = answer + offset;
    if (candidate >= 0 && !values.has(String(candidate)) && values.size < 4) {
      values.add(String(candidate));
    }
  }
  const options = shuffle([...values]);
  return {
    type: 'choice',
    prompt,
    options,
    answer: options.indexOf(String(answer)),
    ...extra,
  };
}

const FRIENDS = ['Lumi', 'Nova', 'Tito', 'Kira', 'Zum', 'Cosmitrón'];

function mathSum(tier, asChoice) {
  const easy = tier === 'facil';
  const a = easy ? rnd(2, 9) : rnd(14, 58);
  const b = easy ? rnd(2, 9) : rnd(11, 39);
  const result = a + b;
  const prompt = `¿Cuánto es ${a} + ${b}?`;
  const explanation = `${a} + ${b} = ${result}.`;
  return asChoice
    ? numericChoice(prompt, result, { explanation })
    : { type: 'input', prompt, answer: String(result), explanation };
}

function mathSub(tier, asChoice) {
  const easy = tier === 'facil';
  const a = easy ? rnd(10, 19) : rnd(45, 98);
  const b = easy ? rnd(2, 9) : rnd(9, 39);
  const result = a - b;
  const prompt = `¿Cuánto es ${a} − ${b}?`;
  const explanation = `${a} − ${b} = ${result}.`;
  return asChoice
    ? numericChoice(prompt, result, { explanation })
    : { type: 'input', prompt, answer: String(result), explanation };
}

function mathMul(tier) {
  const a = rnd(2, tier === 'facil' ? 5 : 9);
  const b = rnd(2, tier === 'facil' ? 5 : 9);
  const result = a * b;
  return numericChoice(`¿Cuánto es ${a} × ${b}?`, result, {
    explanation: `${a} × ${b} = ${result}.`,
  });
}

function mathDiv(tier) {
  const divisor = rnd(2, tier === 'facil' ? 5 : 8);
  const quotient = rnd(2, tier === 'facil' ? 5 : 9);
  const total = divisor * quotient;
  return numericChoice(`¿Cuánto es ${total} ÷ ${divisor}?`, quotient, {
    explanation: `${divisor} × ${quotient} = ${total}, así que ${total} ÷ ${divisor} = ${quotient}.`,
  });
}

function mathWord(tier, name) {
  if (tier === 'facil') {
    const templates = [
      () => {
        const a = rnd(6, 14);
        const b = rnd(3, 9);
        return {
          prompt: `${name} guarda ${a} estrellas en su mochila y encuentra ${b} más en el planeta. ¿Cuántas estrellas tiene ahora?`,
          answer: String(a + b),
          explanation: `${a} + ${b} = ${a + b} estrellas.`,
        };
      },
      () => {
        const a = rnd(5, 12);
        const b = rnd(3, 8);
        return {
          prompt: `${name} ve ${a} lunas pequeñas y de pronto aparecen ${b} más. ¿Cuántas lunas hay en el cielo?`,
          answer: String(a + b),
          explanation: `${a} + ${b} = ${a + b} lunas.`,
        };
      },
      () => {
        const a = rnd(12, 20);
        const b = rnd(3, 9);
        return {
          prompt: `Había ${a} cristales de luz y ${name} usa ${b} para el motor. ¿Cuántos cristales quedan?`,
          answer: String(a - b),
          explanation: `${a} − ${b} = ${a - b} cristales.`,
        };
      },
      () => {
        const friend = pick(FRIENDS);
        const a = rnd(7, 15);
        const b = rnd(4, 9);
        return {
          prompt: `${friend} le regala ${a} semillas espaciales a ${name} y luego le da ${b} más. ¿Cuántas semillas tiene ${name}?`,
          answer: String(a + b),
          explanation: `${a} + ${b} = ${a + b} semillas.`,
        };
      },
    ];
    const chosen = pick(templates)();
    return { type: 'input', ...chosen };
  }

  const templates = [
    () => {
      const boxes = rnd(3, 9);
      const perBox = rnd(3, 8);
      return {
        prompt: `Cada caja tiene ${perBox} cristales. Si ${name} carga ${boxes} cajas, ¿cuántos cristales lleva en total?`,
        answer: String(boxes * perBox),
        explanation: `${boxes} × ${perBox} = ${boxes * perBox} cristales.`,
      };
    },
    () => {
      const pots = rnd(3, 8);
      const perPot = rnd(2, 9);
      return {
        prompt: `${name} reparte ${pots * perPot} semillas en ${pots} macetas, poniendo la misma cantidad en cada una. ¿Cuántas semillas van en cada maceta?`,
        answer: String(perPot),
        explanation: `${pots * perPot} ÷ ${pots} = ${perPot} semillas por maceta.`,
      };
    },
    () => {
      const start = rnd(60, 95);
      const used = rnd(12, 39);
      return {
        prompt: `El tanque tenía ${start} litros de combustible y ${name} gasta ${used} en el despegue. ¿Cuántos litros quedan?`,
        answer: String(start - used),
        explanation: `${start} − ${used} = ${start - used} litros.`,
      };
    },
    () => {
      const trips = rnd(4, 9);
      const seats = rnd(4, 9);
      return {
        prompt: `El cohete lleva ${seats} pasajeros en cada viaje. ¿Cuántos pasajeros lleva ${name} en ${trips} viajes?`,
        answer: String(trips * seats),
        explanation: `${trips} × ${seats} = ${trips * seats} pasajeros.`,
      };
    },
  ];
  const chosen = pick(templates)();
  return { type: 'input', ...chosen };
}

export function buildMathChallenges(tier, count, format, name) {
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

const PALABRA = {
  facil: [
    {
      type: 'choice',
      prompt: '¿Cuál palabra está bien escrita?',
      options: ['escuela', 'eskuela', 'escuvela', 'escvela'],
      answer: 0,
      explanation: 'Se escribe «escuela», con c y con u.',
    },
    {
      type: 'order',
      prompt: 'Toca las palabras en orden para formar la oración.',
      tokens: ['Cosmitrón', 'viaja', 'en', 'cohete'],
      answer: 'Cosmitrón viaja en cohete',
      hint: 'La oración empieza con el nombre del monstruo.',
      explanation: 'La oración correcta es: Cosmitrón viaja en cohete.',
    },
    {
      type: 'truefalse',
      prompt: 'La primera palabra de una oración se escribe con mayúscula.',
      answer: true,
      explanation: 'Sí. Toda oración empieza con mayúscula y termina con punto.',
    },
    {
      type: 'choice',
      prompt: '¿Cuál es el plural de «estrella»?',
      options: ['estrellas', 'estrellaes', 'estrella', 'estrellitas'],
      answer: 0,
      explanation: 'Agregando una «s» obtenemos «estrellas».',
    },
    {
      type: 'choice',
      prompt: '¿Qué palabra significa lo mismo que «feliz»?',
      options: ['contento', 'triste', 'enojado', 'cansado'],
      answer: 0,
      explanation: '«Contento» es un sinónimo de «feliz».',
    },
  ],
  astro: [
    {
      type: 'choice',
      prompt: '¿Cuál oración está escrita correctamente?',
      options: [
        'Mañana visitaremos Marte.',
        'mañana visitaremos marte.',
        'Mañana visitaremos marte',
        'mañana Visitaremos Marte.',
      ],
      answer: 0,
      explanation: 'Empieza con mayúscula, los nombres propios van con mayúscula y termina en punto.',
    },
    {
      type: 'order',
      prompt: 'Ordena las palabras para formar una oración con sentido.',
      tokens: ['El', 'monstruo', 'rosado', 'descubrió', 'un', 'planeta', 'nuevo'],
      answer: 'El monstruo rosado descubrió un planeta nuevo',
      hint: 'Primero el sujeto, después la acción.',
      explanation: 'La oración correcta es: El monstruo rosado descubrió un planeta nuevo.',
    },
    {
      type: 'truefalse',
      prompt: 'Las palabras agudas llevan tilde cuando terminan en vocal, en n o en s.',
      answer: true,
      explanation: 'Correcto: por ejemplo «canción», «café» y «compás».',
    },
    {
      type: 'choice',
      prompt: '¿Cuál es un sinónimo de «enorme»?',
      options: ['gigante', 'pequeño', 'diminuto', 'corto'],
      answer: 0,
      explanation: '«Gigante» significa lo mismo que «enorme».',
    },
    {
      type: 'choice',
      prompt: '¿Cuál de estas palabras es un verbo?',
      options: ['saltar', 'estrella', 'rápido', 'azul'],
      answer: 0,
      explanation: '«Saltar» es una acción, por lo tanto es un verbo.',
    },
  ],
};

const BURBUJA = {
  facil: [
    {
      type: 'pairs',
      prompt: 'Une cada animal con el lugar donde vive.',
      pairs: [
        ['Pez', 'Agua'],
        ['Pájaro', 'Nido'],
        ['Abeja', 'Colmena'],
        ['Topo', 'Madriguera'],
      ],
      explanation: 'Cada animal tiene un hogar diferente y especial.',
    },
    {
      type: 'choice',
      prompt: '¿Qué necesitan las plantas para crecer?',
      options: ['Agua y luz del sol', 'Solo piedras', 'Nada en absoluto', 'Solo viento'],
      answer: 0,
      explanation: 'Las plantas necesitan agua, luz y tierra para crecer.',
    },
    {
      type: 'truefalse',
      prompt: 'El Sol es una estrella.',
      answer: true,
      explanation: 'Sí. El Sol es la estrella más cercana a la Tierra.',
    },
    {
      type: 'choice',
      prompt: '¿Cuál de estos animales es un mamífero?',
      options: ['Delfín', 'Tiburón', 'Pulpo', 'Rana'],
      answer: 0,
      explanation: 'El delfín respira aire y alimenta a sus crías con leche: es un mamífero.',
    },
    {
      type: 'input',
      prompt: '¿En qué estado está el agua cuando se congela?',
      answer: 'sólido',
      accept: ['solido', 'hielo'],
      hint: 'Puede ser líquida, gaseosa o…',
      explanation: 'Cuando el agua se congela pasa al estado sólido: se convierte en hielo.',
    },
  ],
  astro: [
    {
      type: 'pairs',
      prompt: 'Une cada órgano con el sistema al que pertenece.',
      pairs: [
        ['Corazón', 'Circulatorio'],
        ['Pulmones', 'Respiratorio'],
        ['Cerebro', 'Nervioso'],
        ['Estómago', 'Digestivo'],
      ],
      explanation: 'Cada órgano trabaja dentro de un sistema del cuerpo humano.',
    },
    {
      type: 'choice',
      prompt: '¿Qué planeta es conocido como el planeta rojo?',
      options: ['Marte', 'Venus', 'Júpiter', 'Neptuno'],
      answer: 0,
      explanation: 'Marte se ve rojizo por el óxido de hierro de su superficie.',
    },
    {
      type: 'truefalse',
      prompt: 'La Luna produce su propia luz.',
      answer: false,
      explanation: 'La Luna no tiene luz propia: refleja la luz del Sol.',
    },
    {
      type: 'input',
      prompt: '¿Cuántos planetas tiene el sistema solar?',
      answer: '8',
      accept: ['ocho'],
      explanation: 'Son ocho: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno.',
    },
    {
      type: 'choice',
      prompt: '¿Qué gas respiramos las personas para vivir?',
      options: ['Oxígeno', 'Helio', 'Metano', 'Hidrógeno'],
      answer: 0,
      explanation: 'Nuestro cuerpo necesita oxígeno para obtener energía.',
    },
  ],
};

const ACERTIJO = {
  facil: [
    {
      type: 'choice',
      prompt: 'Tengo hojas pero no soy árbol, tengo lomo pero no soy animal. ¿Qué soy?',
      options: ['Un libro', 'Una silla', 'Una nube', 'Un zapato'],
      answer: 0,
      explanation: 'El libro tiene hojas de papel y lomo como los animales.',
    },
    {
      type: 'order',
      prompt: 'Ordena las letras y descubre el animal escondido.',
      tokens: ['A', 'G', 'T', 'O'],
      answer: 'gato',
      join: '',
      hint: 'Es un animal que dice «miau».',
      explanation: 'Las letras forman la palabra GATO.',
    },
    {
      type: 'choice',
      prompt: 'Vuela sin alas y silba sin boca. ¿Qué es?',
      options: ['El viento', 'El Sol', 'La Luna', 'Una nube'],
      answer: 0,
      explanation: 'El viento se mueve y suena, pero no tiene alas ni boca.',
    },
    {
      type: 'input',
      prompt: 'Si hoy es martes, ¿qué día será mañana?',
      answer: 'miércoles',
      accept: ['miercoles'],
      explanation: 'Después del martes viene el miércoles.',
    },
    {
      type: 'choice',
      prompt: 'Cuanto más grande es, menos se ve. ¿Qué es?',
      options: ['La oscuridad', 'Una estrella', 'Una montaña', 'Un espejo'],
      answer: 0,
      explanation: 'Cuanta más oscuridad hay, menos se ve. ¡Buen acertijo!',
    },
  ],
  astro: [
    {
      type: 'input',
      prompt: 'Soy un número de dos cifras. Si me das la vuelta sigo siendo el mismo y soy mayor que 80. ¿Quién soy?',
      answer: '88',
      hint: 'Tiene las dos cifras iguales.',
      explanation: 'El 88 se lee igual al derecho y al revés.',
    },
    {
      type: 'input',
      prompt: 'Un caracol sube 3 metros cada día y no resbala nunca. ¿Cuántos días tarda en salir de un pozo de 12 metros?',
      answer: '4',
      accept: ['cuatro'],
      explanation: '12 ÷ 3 = 4 días.',
    },
    {
      type: 'choice',
      prompt: 'Ana es más alta que Beto y Beto es más alto que Carla. ¿Quién es el más alto?',
      options: ['Ana', 'Beto', 'Carla', 'No se puede saber'],
      answer: 0,
      explanation: 'Ana es la más alta de los tres.',
    },
    {
      type: 'order',
      prompt: 'Ordena los planetas del más cercano al más lejano del Sol.',
      tokens: ['Mercurio', 'Venus', 'Tierra', 'Marte'],
      answer: 'Mercurio Venus Tierra Marte',
      explanation: 'El orden es Mercurio, Venus, Tierra y Marte.',
    },
    {
      type: 'choice',
      prompt: '¿Cuántos meses del año tienen 28 días?',
      options: ['Todos los meses', 'Solo uno', 'Ninguno', 'Solo dos'],
      answer: 0,
      explanation: 'Todos los meses tienen al menos 28 días.',
    },
  ],
};

const SILUETA = {
  facil: [
    {
      type: 'choice',
      prompt: '¿Cuántos lados tiene un triángulo?',
      options: ['3', '4', '5', '2'],
      answer: 0,
      explanation: 'El triángulo tiene tres lados y tres vértices.',
    },
    {
      type: 'pairs',
      prompt: 'Une cada figura con un objeto que tenga esa forma.',
      pairs: [
        ['Círculo', 'Rueda'],
        ['Cuadrado', 'Ventana'],
        ['Triángulo', 'Vela de barco'],
        ['Rectángulo', 'Puerta'],
      ],
      explanation: 'Las figuras geométricas están en todas partes.',
    },
    {
      type: 'choice',
      prompt: '¿Qué figura tiene cuatro lados iguales?',
      options: ['Cuadrado', 'Triángulo', 'Círculo', 'Óvalo'],
      answer: 0,
      explanation: 'El cuadrado tiene cuatro lados iguales y cuatro esquinas.',
    },
    {
      type: 'input',
      prompt: 'Si tienes 3 cajas y en cada una hay 2 estrellas, ¿cuántas estrellas hay?',
      answer: '6',
      accept: ['seis'],
      explanation: '3 × 2 = 6 estrellas.',
    },
    {
      type: 'truefalse',
      prompt: 'Un círculo tiene esquinas.',
      answer: false,
      explanation: 'El círculo es completamente redondo: no tiene esquinas.',
    },
  ],
  astro: [
    {
      type: 'choice',
      prompt: '¿Cuánto suman los ángulos interiores de un triángulo?',
      options: ['180°', '90°', '360°', '100°'],
      answer: 0,
      explanation: 'Los tres ángulos de cualquier triángulo suman 180°.',
    },
    {
      type: 'input',
      prompt: 'Un cuadrado tiene lados de 5 cm. ¿Cuál es su perímetro en centímetros?',
      answer: '20',
      hint: 'Suma sus cuatro lados.',
      explanation: '5 × 4 = 20 cm de perímetro.',
    },
    {
      type: 'pairs',
      prompt: 'Une cada figura con su cantidad de lados.',
      pairs: [
        ['Triángulo', '3 lados'],
        ['Cuadrado', '4 lados'],
        ['Pentágono', '5 lados'],
        ['Hexágono', '6 lados'],
      ],
      explanation: 'Los nombres de las figuras cuentan sus lados en griego.',
    },
    {
      type: 'choice',
      prompt: '¿Qué figura tiene todos sus puntos a la misma distancia del centro?',
      options: ['Círculo', 'Cuadrado', 'Rombo', 'Trapecio'],
      answer: 0,
      explanation: 'En el círculo, el radio siempre mide lo mismo.',
    },
    {
      type: 'input',
      prompt: 'Un tren sale con 24 pasajeros y bajan 9 en la primera estación. ¿Cuántos pasajeros quedan?',
      answer: '15',
      explanation: '24 − 9 = 15 pasajeros.',
    },
  ],
};

const BANK = {
  palabra: PALABRA,
  burbuja: BURBUJA,
  acertijo: ACERTIJO,
  silueta: SILUETA,
};

export function buildChallenges(planetId, tier, playerName) {
  const name = playerName || 'explorador';
  switch (planetId) {
    case 'chispa':
      return buildMathChallenges(tier, 5, 'mixed', name);
    case 'ritmo':
      return buildMathChallenges(tier, 8, 'choice', name);
    case 'tierra': {
      const math = buildMathChallenges(tier, 3, 'mixed', name);
      const lengua = shuffle(BANK.palabra[tier]).slice(0, 2);
      const ciencias = shuffle(BANK.burbuja[tier]).slice(0, 2);
      const logica = [pick(BANK.acertijo[tier])];
      return shuffle([...math, ...lengua, ...ciencias, ...logica]);
    }
    default:
      return shuffle(BANK[planetId]?.[tier] || BANK.palabra[tier]);
  }
}
