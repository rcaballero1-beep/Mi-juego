import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import { AccessoryShapes } from '@/components/game/accessories';

const MOUTHS = {
  happy: 'M84 130 Q100 144 116 130',
  cheer: 'M82 126 Q100 160 118 126 Z',
  think: 'M88 136 Q100 140 112 136',
  oops: 'M88 142 Q100 130 112 142',
};

export default function Monster({ mood = 'happy', floating = true, accessories = [], className }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bodyId = `body-${uid}`;
  const shineId = `shine-${uid}`;
  const mouth = MOUTHS[mood] || MOUTHS.happy;

  return (
    <div
      className={cn('relative select-none', floating && 'anim-float', className)}
      style={{ filter: 'drop-shadow(0 16px 28px rgba(236,72,153,0.35))' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <radialGradient id={bodyId} cx="34%" cy="24%" r="82%">
            <stop offset="0%" stopColor="#FFD3E8" />
            <stop offset="45%" stopColor="#F9A8D4" />
            <stop offset="78%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#BE185D" />
          </radialGradient>
          <radialGradient id={shineId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* antenas */}
        <path d="M78 60 C73 44 68 36 60 28" stroke="#F9A8D4" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M122 60 C127 44 132 36 140 28" stroke="#F9A8D4" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="58" cy="24" r="7" fill="#FDE68A" />
        <circle cx="142" cy="24" r="7" fill="#7DD3FC" />

        {/* pies */}
        <ellipse cx="78" cy="172" rx="21" ry="11" fill="#BE185D" />
        <ellipse cx="122" cy="172" rx="21" ry="11" fill="#BE185D" />

        {/* brazos */}
        <ellipse cx="34" cy="120" rx="13" ry="23" fill="#F472B6" transform="rotate(-22 34 120)" />
        <ellipse cx="166" cy="120" rx="13" ry="23" fill="#F472B6" transform="rotate(22 166 120)" />

        {/* cuerpo */}
        <ellipse cx="100" cy="114" rx="66" ry="60" fill={`url(#${bodyId})`} />
        <ellipse cx="100" cy="136" rx="40" ry="28" fill="#ffffff" opacity="0.16" />
        <ellipse cx="66" cy="76" rx="18" ry="14" fill={`url(#${shineId})`} opacity="0.5" />

        {/* mejillas */}
        <ellipse cx="52" cy="124" rx="11" ry="7" fill="#FB7185" opacity="0.4" />
        <ellipse cx="148" cy="124" rx="11" ry="7" fill="#FB7185" opacity="0.4" />

        {/* ojos */}
        <g className="anim-blink">
          <ellipse cx="76" cy="98" rx="23" ry="27" fill="#ffffff" />
          <ellipse cx="124" cy="98" rx="23" ry="27" fill="#ffffff" />
          <circle cx="79" cy="103" r="10.5" fill="#2A0A47" />
          <circle cx="121" cy="103" r="10.5" fill="#2A0A47" />
          <circle cx="74" cy="96" r="4" fill="#ffffff" />
          <circle cx="116" cy="96" r="4" fill="#ffffff" />
        </g>

        {/* boca */}
        {mood === 'cheer' ? (
          <path d={mouth} fill="#9D174D" stroke="#9D174D" strokeWidth="3" strokeLinejoin="round" />
        ) : (
          <path d={mouth} fill="none" stroke="#9D174D" strokeWidth="4.5" strokeLinecap="round" />
        )}

        {mood === 'cheer' && (
          <>
            <path d="M34 62 l3.4 7.4 8 1-6 5.6 1.6 8-7-4-7 4 1.6-8-6-5.6 8-1z" fill="#FDE68A" className="anim-twinkle" />
            <path d="M170 70 l2.6 5.6 6 .8-4.4 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.2 6-.8z" fill="#7DD3FC" className="anim-twinkle" />
          </>
        )}

        <AccessoryShapes ids={accessories} />
      </svg>
    </div>
  );
}
