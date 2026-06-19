"use client";

import React from 'react';

type LayoutType = 'solo' | '2-picture' | '4-picture';

interface LayoutOption {
  id: string;
  name: string;
  count: number;
  locked: boolean;
}

const LAYOUTS: LayoutOption[] = [
  { id: 'solo', name: 'Solo', count: 1, locked: false },
  { id: '2-picture', name: 'Duo', count: 2, locked: false },
  { id: '4-picture', name: 'Quad', count: 4, locked: false },
  { id: 'strip', name: 'Strip', count: 3, locked: true },
  { id: 'grid-6', name: 'Classic 6', count: 6, locked: true },
  { id: 'mosaic', name: 'Mosaic', count: 9, locked: true },
];

interface LayoutSelectorProps {
  onSelect: (layout: LayoutOption) => void;
}

const LayoutSelector = ({ onSelect }: LayoutSelectorProps) => {
  return (
    <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-serif italic text-[#6B4E31] mb-2">Choose your frame</h2>
        <div className="h-1 w-24 bg-[#D97732] mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            disabled={layout.locked}
            onClick={() => !layout.locked && onSelect(layout)}
            className={`
              relative group flex flex-col items-center p-6 border-4 rounded-sm transition-all duration-300
              ${layout.locked 
                ? 'bg-[#1a1a1a] border-black/40 opacity-90 cursor-not-allowed scale-[0.98]' 
                : 'bg-[#E2D2B8] border-[#3D2314] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_#3D2314] shadow-[8px_8px_0px_0px_#3D2314] active:translate-x-[6px] active:translate-y-[6px] active:shadow-[2px_2px_0px_0px_#3D2314]'}
            `}
          >
            {/* Visual Preview of Layout */}
            <div className={`
              w-full aspect-[4/3] border-2 mb-4 grid gap-2 p-2 transition-colors duration-300
              ${layout.locked ? 'bg-black/20 border-white/5' : 'bg-[#3D2314]/5 border-[#3D2314]/20'}
              ${layout.id === 'solo' ? 'grid-cols-1' : ''}
              ${layout.id === '2-picture' ? 'grid-cols-2' : ''}
              ${layout.id === '4-picture' ? 'grid-cols-2 grid-rows-2' : ''}
              ${layout.id === 'strip' ? 'grid-cols-1 grid-rows-3' : ''}
              ${layout.id === 'grid-6' ? 'grid-cols-3 grid-rows-2' : ''}
              ${layout.id === 'mosaic' ? 'grid-cols-3 grid-rows-3' : ''}
            `}>
              {Array.from({ length: layout.count }).map((_, i) => (
                <div key={i} className="bg-[#3D2314]/10 border border-[#3D2314]/20 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center">
              <span className={`text-xl font-black uppercase tracking-wider ${layout.locked ? 'text-white/20' : 'text-[#3D2314]'}`}>
                {layout.name}
              </span>
              {layout.locked && (
                <span className="text-[10px] font-bold bg-white/5 text-white/30 px-2 py-0.5 mt-1 rounded-full uppercase tracking-tighter border border-white/10">
                  Coming Soon
                </span>
              )}
            </div>

            {/* Hover Indicator */}
            {!layout.locked && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-4 h-4 bg-[#D97732] rounded-full border-2 border-[#3D2314]"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LayoutSelector;
