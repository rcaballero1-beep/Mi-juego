import React, { useId } from 'react';

export const ACCESSORIES = [
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

export function toggleAccessory(current = [], id) {
  if (current.includes(id)) return current.filter((item) => item !== id);
  const target = ACCESSORIES.find((item) => item.id === id);
  const withoutSlot = target ? current.filter((item) => ACCESSORIES.find((a) => a.id === item)?.slot !== target.slot) : current;
  return [...withoutSlot, id];
}

export function parseAccessories(value) {
  if (!value) return [];
  return String(value).split(',').filter(Boolean);
}

export function AccessoryShapes({ ids = [] }) {
  const maskId = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <g>
      {ids.includes('copa') && (
        <g>
          <ellipse cx="100" cy="60" rx="38" ry="9" fill="#1F2937" />
          <rect x="76" y="10" width="48" height="48" rx="4" fill="#111827" />
          <rect x="76" y="40" width="48" height="9" fill="#F472B6" />
        </g>
      )}

      {ids.includes('corona') && (
        <g>
          <path
            d="M64 64 L62 40 L80 52 L100 32 L120 52 L138 40 L136 64 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="100" cy="46" r="4" fill="#FDE68A" />
          <circle cx="76" cy="52" r="3" fill="#FDE68A" />
          <circle cx="124" cy="52" r="3" fill="#FDE68A" />
        </g>
      )}

      {ids.includes('fiesta') && (
        <g>
          <path d="M100 6 L132 62 L68 62 Z" fill="#F472B6" stroke="#BE185D" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="100" cy="8" r="7" fill="#FDE68A" />
          <circle cx="100" cy="34" r="4" fill="#FDE68A" />
          <circle cx="90" cy="50" r="4" fill="#7DD3FC" />
        </g>
      )}

      {ids.includes('lentes') && (
        <g>
          <g fill="#111827" fillOpacity="0.92">
            <rect x="50" y="84" width="42" height="26" rx="12" />
            <rect x="108" y="84" width="42" height="26" rx="12" />
            <rect x="90" y="92" width="20" height="7" rx="3" />
          </g>
          <path d="M60 92 L72 104" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
          <path d="M118 92 L130 104" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {ids.includes('nariz') && (
        <g>
          <circle cx="100" cy="118" r="11" fill="#EF4444" />
          <circle cx="96" cy="114" r="3.5" fill="#ffffff" fillOpacity="0.5" />
        </g>
      )}

      {ids.includes('bigote') && (
        <path
          d="M78 128 Q88 118 98 126 Q100 129 102 126 Q112 118 122 128 Q112 137 100 132 Q88 137 78 128 Z"
          fill="#3B0764"
        />
      )}

      {ids.includes('vaquero') && (
        <g>
          <path
            d="M68 62 C68 34 80 26 100 26 C120 26 132 34 132 62 Z"
            fill="#C2410C"
            stroke="#7C2D12"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <ellipse cx="100" cy="62" rx="56" ry="11" fill="#9A3412" stroke="#7C2D12" strokeWidth="3" />
          <rect x="68" y="50" width="64" height="9" fill="#FBBF24" />
          <circle cx="100" cy="42" r="5" fill="#FDE68A" />
        </g>
      )}

      {ids.includes('gorra') && (
        <g>
          <path d="M66 62 C66 32 134 32 134 62 Z" fill="#2563EB" stroke="#1E3A8A" strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="100" cy="62" rx="46" ry="9" fill="#1E3A8A" />
          <circle cx="100" cy="46" r="8" fill="#FBBF24" />
          <path d="M100 40 l2 4.4 4.8 .6-3.5 3.3 1 4.7-4.3-2.4-4.3 2.4 1-4.7-3.5-3.3 4.8-.6z" fill="#FEF3C7" />
        </g>
      )}

      {ids.includes('monoculo') && (
        <g>
          <circle cx="124" cy="98" r="29" fill="#FDE68A" fillOpacity="0.14" stroke="#FBBF24" strokeWidth="5" />
          <path d="M146 118 C158 128 160 144 150 158" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M112 86 L126 100" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {ids.includes('antifaz') && (
        <g>
          <mask id={`mask-${maskId}`}>
            <rect x="0" y="0" width="200" height="200" fill="#ffffff" />
            <ellipse cx="76" cy="98" rx="24" ry="26" fill="#000000" />
            <ellipse cx="124" cy="98" rx="24" ry="26" fill="#000000" />
          </mask>
          <path
            d="M40 82 C40 64 160 64 160 82 L160 106 C160 122 138 126 124 118 C114 112 108 108 100 108 C92 108 86 112 76 118 C62 126 40 122 40 106 Z"
            fill="#312E81"
            stroke="#1E1B4B"
            strokeWidth="3"
            mask={`url(#mask-${maskId})`}
          />
          <path d="M42 88 C66 74 90 74 100 82" stroke="#A5B4FC" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )}

      {ids.includes('barba') && (
        <g>
          <path
            d="M72 118 C74 152 86 168 100 168 C114 168 126 152 128 118 C120 134 110 128 100 124 C90 128 80 134 72 118 Z"
            fill="#F8FAFC"
            stroke="#E2E8F0"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M100 134 Q94 148 100 158 Q106 148 100 134 Z" fill="#E2E8F0" />
        </g>
      )}
    </g>
  );
}
