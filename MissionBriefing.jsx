import React from 'react';
import { ShieldCheck, Volume2 } from 'lucide-react';
import { speak } from '@/lib/voice';

export const MISSION_STORY =
  'Agente Cosmitrón, tu misión es secreta: la Tierra perdió sus colores y solo tú puedes salvarla. Cruza los siete planetas, resuelve los retos y reúne el código secreto antes de que se apague la última estrella.';

export default function MissionBriefing() {
  return (
    <div className="anim-pop mt-6 w-full rounded-[1.75rem] border border-amber-300/25 bg-amber-300/[0.07] p-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-300/20 text-amber-200">
          <ShieldCheck className="h-4 w-4" />
        </span>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-amber-200">
          Misión secreta
        </p>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-white/75">
        Cosmitrón es un agente secreto con una sola misión:{' '}
        <span className="font-extrabold text-white">salvar el mundo</span>. La Tierra está perdiendo
        sus colores y solo tú puedes ayudarlo a llegar antes de que se apague la última estrella.
      </p>

      <button
        type="button"
        onClick={() => speak(MISSION_STORY)}
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white/80 transition hover:bg-white/20 hover:text-white"
      >
        <Volume2 className="h-3.5 w-3.5" /> Escuchar la misión
      </button>
    </div>
  );
}
