import React from 'react';
import { ACCESSORIES, toggleAccessory } from '@/components/game/accessories';
import { sfx } from '@/lib/sfx';
import { cn } from '@/lib/utils';

export default function AccessoryPicker({ value = [], onChange }) {
  return (
    <div>
      <p className="mt-5 font-display text-lg font-extrabold text-white">Disfrázalo a tu gusto</p>
      <p className="mt-1 text-xs text-white/50">
        Sombreros, lentes, bigotes y más para tu agente secreto.
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {ACCESSORIES.map((item) => {
          const active = value.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                sfx.tap();
                onChange(toggleAccessory(value, item.id));
              }}
              aria-pressed={active}
              className={cn(
                'rounded-2xl border-2 px-2 py-2 transition',
                active
                  ? 'border-amber-300 bg-amber-300/20'
                  : 'border-white/15 bg-white/[0.05] hover:border-white/30'
              )}
            >
              <span className="block text-lg leading-none">{item.emoji}</span>
              <span className="mt-1 block text-[9px] font-bold uppercase leading-tight tracking-wider text-white/60">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
