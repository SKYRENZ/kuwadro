"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CameraView from '@/components/CameraView';

const LAYOUTS = [
  { id: 'solo', name: 'Solo', count: 1 },
  { id: '2-picture', name: 'Duo', count: 2 },
  { id: '4-picture', name: 'Quad', count: 4 },
];

const CaptureContent = () => {
  const searchParams = useSearchParams();
  const layoutId = searchParams.get('layout') || 'solo';
  
  const selectedLayout = LAYOUTS.find(l => l.id === layoutId) || LAYOUTS[0];

  return (
    <div className="h-screen bg-[#EFE6D5] flex flex-col items-center py-4 px-4 font-sans text-[#3D2314] relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#EFE6D5] via-[#E2D2B8] to-[#C9B390] z-0 opacity-80 pointer-events-none"></div>
      <div className="fixed inset-0 opacity-[0.05] mix-blend-multiply z-0 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      <div className="z-10 w-full max-w-5xl flex items-center justify-between mb-2">
        <button 
          onClick={() => window.location.href = '/choose-layout'}
          className="text-[#FFE8D1] bg-[#8B4513] font-bold border-2 border-[#3D2314] px-3 py-1.5 hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0_0_#3D2314] hover:shadow-[1px_1px_0_0_#3D2314] transition-all flex gap-2 items-center rounded-sm text-sm"
        >
          <span>←</span> New Frame
        </button>
        <h1 className="text-4xl font-black text-[#3D2314] tracking-tight uppercase drop-shadow-sm" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
          {selectedLayout.name}
        </h1>
        <div className="w-[100px] flex justify-end">
          <div className="bg-[#D97732] text-[#FFE8D1] px-2 py-0.5 rounded-sm text-[10px] font-black border-2 border-[#3D2314] uppercase shadow-[1px_1px_0px_0px_#3D2314]">
            {selectedLayout.count} {selectedLayout.count === 1 ? 'SHOT' : 'SHOTS'}
          </div>
        </div>
      </div>

      <div className="z-10 flex-1 w-full flex flex-col items-center justify-center">
        <CameraView layout={selectedLayout} />
      </div>
    </div>
  );
};

const CapturePage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EFE6D5] flex items-center justify-center text-[#3D2314] font-bold">Loading session...</div>}>
      <CaptureContent />
    </Suspense>
  );
};

export default CapturePage;
