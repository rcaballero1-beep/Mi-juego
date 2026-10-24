import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Rocket, Star, Trophy, Volume2, VolumeX } from 'lucide-react';
import StarField from '@/components/game/StarField';
import Monster from '@/components/game/Monster';
import GameButton from '@/components/game/GameButton';
import StarsRow from '@/components/game/StarsRow';
import AccessoryPicker from '@/components/game/AccessoryPicker';
import MissionBriefing from '@/components/game/MissionBriefing';
import { loadGame, startGame } from '@/lib/gameStore';
import { PLANETS } from '@/data/planets';
import { isSoundOn, toggleSound } from '@/lib/sfx';
import { randomLine, speak } from '@/lib/voice';
import { cn } from '@/lib/utils';

const TIERS = [
  { id: 'facil', ages: '6 a 8 años', label: 'Explorador novato', emoji: '🌱' },
  { id: 'astro', ages: '9 a 11 años', label: 'Astro experto', emoji: '🚀' },
];

const STEPS = [
  { icon: Compass, title: 'Viaja', text: 'Avanza por 7 planetas hasta llegar a la Tierra.' },
  { icon: Star, title: 'Resuelve', text: 'Retos de matemáticas, lengua, ciencias y acertijos.' },
  { icon: Trophy, title: 'Suma', text: 'Gana puntos, estrellas y desbloquea el siguiente salto.' },
];

export default function StartScreen() {
  const navigate = useNavigate();
  const [state] = useState(loadGame);
  const [sound, setSound] = useState(isSoundOn());
  const hasPlayer = Boolean(state.player?.name);
  const [mode, setMode] = useState(hasPlayer ? 'continue' : 'form');
  const [name, setName] = useState(state.player?.name || '');
  const [tier, setTier] = useState(state.player?.tier || 'facil');
  const [accessories, setAccessories] = useState(state.player?.accessories || []);

  function handleStart() {
    const clean = name.trim().slice(0, 14);
    if (!clean) return;
    startGame(clean, tier, accessories);
    speak(`¡Allá vamos, ${clean}! Soy Cosmitrón y esta es una misión secreta para salvar el mundo.`);
    navigate('/mapa');
  }

  const completed = PLANETS.filter((planet) => (state.progress[planet.id]?.stars || 0) > 0).length;

  return (
    <div className="relative min-h-screen text-white">
      <StarField density={90} />

      <button
        type="button"
        onClick={() => setSound(toggleSound())}
        aria-label={sound ? 'Silenciar sonidos' : 'Activar sonidos'}
        className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white/75 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
      >
        {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>

      <main className="mx-auto flex w-full max-w-lg flex-col items-center px-4 pb-14 pt-10">
        <div className="anim-pop flex flex-col items-center">
          <button
            type="button"
            onClick={() => speak(randomLine('hello'))}
            aria-label="Escuchar a Cosmitrón"
            className="transition active:scale-95"
          >
            <Monster accessories={accessories} className="h-40 w-40 sm:h-48 sm:w-48" />
          </button>
          <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.3em] text-pink-300">
            Cosmitrón presenta
          </p>
          <h1 className="mt-1 text-center font-display text-4xl font-extrabold leading-none sm:text-5xl">
            <span className="text-shine">Aventura</span>
            <br />
            <span className="text-white">Galáctica</span>
          </h1>
          <p className="mt-3 max-w-xs text-center text-sm leading-relaxed text-white/65">
            Cosmitrón es un monstruo rosado con una misión secreta: llegar a la Tierra y salvar el
            mundo.
          </p>
        </div>

        <MissionBriefing />

        <div className="anim-pop mt-7 w-full rounded-[2rem] border border-white/15 bg-white/[0.08] p-5 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-6">
          {mode === 'continue' ? (
            <>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-400 to-fuchsia-600 font-display text-xl font-extrabold text-white">
                  {state.player.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-xl font-extrabold text-white">
                    ¡Hola, {state.player.name}!
                  </p>
                  <p className="text-xs text-white/55">
                    {completed} de {PLANETS.length} planetas · {state.points} puntos
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/[0.05] px-4 py-3">
                <span className="text-xs font-bold uppercase tracking-widest text-white/45">Estrellas</span>
                <StarsRow count={Math.min(3, completed)} size="sm" />
              </div>

              <GameButton
                variant="primary"
                size="lg"
                className="mt-5 w-full"
                onClick={() => navigate('/mapa')}
              >
                Continuar aventura <ArrowRight className="h-5 w-5" />
              </GameButton>
              <button
                type="button"
                onClick={() => {
                  setMode('form');
                  setName('');
                }}
                className="mt-3 w-full text-center text-xs font-bold uppercase tracking-widest text-white/40 transition hover:text-white/70"
              >
                Empezar de nuevo
              </button>
            </>
          ) : (
            <>
              <label
                htmlFor="player-name"
                className="block font-display text-lg font-extrabold text-white"
              >
                ¿Cómo te llamas, comandante?
              </label>
              <p className="mt-1 text-xs text-white/50">Cosmitrón usará tu nombre durante toda la aventura.</p>
              <input
                id="player-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleStart();
                }}
                maxLength={14}
                autoComplete="off"
                placeholder="Tu nombre"
                className="mt-3 w-full rounded-2xl border-2 border-white/20 bg-[#0B0426]/70 px-4 py-3 font-display text-lg font-bold text-white placeholder:font-semibold placeholder:text-white/30 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-400/25"
              />

              <p className="mt-5 font-display text-lg font-extrabold text-white">¿Cuántos años tienes?</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {TIERS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTier(option.id)}
                    className={cn(
                      'rounded-2xl border-2 p-3 text-left transition',
                      tier === option.id
                        ? 'border-pink-400 bg-pink-400/20'
                        : 'border-white/15 bg-white/[0.05] hover:border-white/30'
                    )}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <p className="mt-1 font-display text-sm font-extrabold leading-tight text-white">
                      {option.ages}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-white/45">{option.label}</p>
                  </button>
                ))}
              </div>

              <AccessoryPicker value={accessories} onChange={setAccessories} />

              <GameButton
                variant="primary"
                size="lg"
                className="mt-5 w-full"
                disabled={!name.trim()}
                onClick={handleStart}
              >
                <Rocket className="h-5 w-5" /> ¡Despegar!
              </GameButton>

              {hasPlayer && (
                <button
                  type="button"
                  onClick={() => setMode('continue')}
                  className="mt-3 w-full text-center text-xs font-bold uppercase tracking-widest text-white/40 transition hover:text-white/70"
                >
                  Volver
                </button>
              )}
            </>
          )}
        </div>

        <div className="mt-8 grid w-full grid-cols-3 gap-2">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-sm"
            >
              <Icon className="mx-auto h-5 w-5 text-pink-300" />
              <p className="mt-2 font-display text-sm font-extrabold text-white">{title}</p>
              <p className="mt-1 text-[10px] leading-snug text-white/45">{text}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate('/ranking')}
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-300/10 px-5 py-2.5 font-display text-sm font-extrabold text-amber-200 transition hover:bg-amber-300/20"
        >
          <Trophy className="h-4 w-4" /> Ver las mejores puntuaciones
        </button>

        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-white/25">
          El progreso se guarda en este dispositivo
        </p>
      </main>
    </div>
  );
}
