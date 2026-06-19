"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LayoutSelector from '@/components/LayoutSelector';

const ChooseLayoutPage = () => {
  const router = useRouter();

  const handleSelect = (layout: { id: string }) => {
    router.push(`/capture?layout=${layout.id}`);
  };

  return (
    <div className="min-h-screen bg-[#EFE6D5] flex flex-col items-center py-10 px-4 font-sans text-[#3D2314] relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#EFE6D5] via-[#E2D2B8] to-[#C9B390] z-0 opacity-80 pointer-events-none"></div>
      <div className="fixed inset-0 opacity-[0.05] mix-blend-multiply z-0 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      <div className="z-10 w-full max-w-4xl flex items-center justify-between mb-8">
        <button 
          onClick={() => window.location.href = '/'}
          className="text-[#FFE8D1] bg-[#8B4513] font-bold border-2 border-[#3D2314] px-4 py-2 hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0_0_#3D2314] hover:shadow-[2px_2px_0_0_#3D2314] transition-all flex gap-2 items-center rounded-sm"
        >
          <span>←</span> Back
        </button>
        <h1 className="text-4xl font-black text-[#3D2314] tracking-tight uppercase drop-shadow-sm" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
          Choose Layout
        </h1>
        <div className="w-[100px]"></div>
      </div>

      <div className="z-10 flex-1 w-full flex flex-col items-center justify-center">
        <LayoutSelector onSelect={handleSelect} />
        <p className="mt-8 text-[#6B4E31] font-serif italic text-lg opacity-90 text-center max-w-sm">
          Select a frame style to begin your photo session.
        </p>
      </div>
    </div>
  );
};

export default ChooseLayoutPage;
