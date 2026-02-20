import React from 'react';
import { Check } from 'lucide-react';
import { BackgroundOption } from '../types';

interface BackgroundSelectorProps {
  value: BackgroundOption;
  onChange: (option: BackgroundOption) => void;
}

const OPTIONS: { id: BackgroundOption; label: string; description: string }[] = [
  {
    id: 'white',
    label: 'Fond blanc',
    description: 'Packshot classique sur fond blanc',
  },
  {
    id: 'black',
    label: 'Fond noir',
    description: 'Rendu premium sur fond sombre',
  },
  {
    id: 'transparent',
    label: 'Fond transparent',
    description: 'PNG transparent, tout support',
  },
];

function SwatchPreview({ option }: { option: BackgroundOption }) {
  if (option === 'transparent') {
    return (
      <div
        className="w-full h-full rounded-md"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #d1d5db 25%, transparent 25%), linear-gradient(-45deg, #d1d5db 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d1d5db 75%), linear-gradient(-45deg, transparent 75%, #d1d5db 75%)',
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
          backgroundColor: '#f3f4f6',
        }}
      />
    );
  }
  return (
    <div
      className={`w-full h-full rounded-md ${
        option === 'white'
          ? 'bg-white border border-gray-200'
          : 'bg-gray-900'
      }`}
    />
  );
}

export function BackgroundSelector({ value, onChange }: BackgroundSelectorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-200">
        Type de fond
      </h3>
      <div className="grid grid-cols-3 gap-2.5">
        {OPTIONS.map((opt) => {
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`group relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-150 text-left
                ${isActive
                  ? 'border-fuseau-accent bg-fuseau-accent/[0.04] shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 relative">
                <SwatchPreview option={opt.id} />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-fuseau-accent rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div className="text-center min-w-0">
                <p className={`text-xs font-semibold truncate ${isActive ? 'text-fuseau-accent' : 'text-gray-700'}`}>
                  {opt.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight hidden sm:block">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
