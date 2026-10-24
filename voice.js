import { isSoundOn } from '@/lib/sfx';

const LINES = {
  hello: ['¡Hola! Soy Cosmitrón.', '¡Qué bueno verte, comandante!', '¡Vamos a explorar la galaxia!'],
  correct: ['¡Muy bien!', '¡Genial!', '¡Lo lograste!', '¡Eres increíble!'],
  wrong: ['Casi, sigue intentando.', 'No pasa nada, vamos otra vez.', 'Uy, casi casi.'],
  start: ['¡Allá vamos!', '¡Despegamos!'],
  level: ['¡Planeta superado!', '¡Lo hiciste genial!'],
  finish: ['¡Llegamos a la Tierra!', '¡Misión cumplida, comandante!'],
  mission: [
    'Agente, tengo una misión secreta: salvar el mundo.',
    'Shhh, es secreto: la galaxia necesita nuestra ayuda para salvar el mundo.',
    'Misión secreta activada: cruzaremos la galaxia para salvar el mundo.',
  ],
};

export function randomLine(kind) {
  const list = LINES[kind] || LINES.hello;
  return list[Math.floor(Math.random() * list.length)];
}

function pickVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  const spanish = voices.filter((voice) => String(voice.lang || '').toLowerCase().startsWith('es'));
  return (
    spanish.find((voice) => /mujer|female|monica|paulina|helena|sabina|marisol/i.test(voice.name)) ||
    spanish[0] ||
    voices[0] ||
    null
  );
}

export function speechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text) {
  if (!text || !speechAvailable() || !isSoundOn()) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'es-ES';
    utterance.pitch = 1.5;
    utterance.rate = 1.02;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    // el navegador no permite voz: el juego sigue sin audio
  }
}

export function stopSpeaking() {
  if (!speechAvailable()) return;
  window.speechSynthesis.cancel();
}
