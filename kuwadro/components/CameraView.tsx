"use client";

import React, { useRef, useEffect, useState } from 'react';

export default function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Error accessing the camera: ", err);
        setHasPermission(false);
      }
    };

    startCamera();

    // Cleanup when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-sm overflow-hidden bg-[#E2D2B8] border-4 border-[#3D2314] shadow-[8px_8px_0px_0px_#3D2314] flex flex-col items-center justify-center min-h-[480px]">
      {hasPermission === false && (
        <div className="p-8 text-center text-[#3D2314] font-bold text-xl">
          <p>Please grant camera access to use the photo booth.</p>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-auto object-cover transform -scale-x-100 ${hasPermission === false ? 'hidden' : 'block'}`}
      />
      
      {/* Retro Viewfinder Overlay Elements */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-[#3D2314]/10"></div>
      
      {/* Center focus indicator */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60">
        <div className="w-16 h-16 border-2 border-[#FFE8D1]/80 rounded-full"></div>
        <div className="absolute w-32 h-[1px] bg-[#FFE8D1]/40"></div>
        <div className="absolute h-32 w-[1px] bg-[#FFE8D1]/40"></div>
      </div>
      
      {/* REC badge */}
      <div className="absolute top-4 right-4 bg-[#D97732] text-[#FFE8D1] px-3 py-1 rounded-sm text-xs font-bold tracking-widest border-2 border-[#3D2314] uppercase shadow-[2px_2px_0px_0px_#3D2314] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
        REC
      </div>
    </div>
  );
}
