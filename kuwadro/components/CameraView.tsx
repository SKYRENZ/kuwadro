"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { startCameraStream, captureFrame, stopCameraStream } from '@/lib/camera';

export default function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Boot camera on mount
  useEffect(() => {
    const init = async () => {
      try {
        if (videoRef.current) {
          streamRef.current = await startCameraStream(videoRef.current);
          setHasPermission(true);
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        setHasPermission(false);
      }
    };

    if (!capturedImage) {
      init();
    }

    return () => {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    };
  }, [capturedImage]);

  // Runs the 3-second countdown, then captures
  const handleCapture = useCallback(() => {
    if (countdown !== null) return; // prevent double-clicks

    let count = 3;
    setCountdown(count);

    const timer = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(timer);
        setCountdown(null);
        doCapture();
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [countdown]);

  const doCapture = () => {
    if (!videoRef.current) return;

    // Flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500);

    const dataUrl = captureFrame(videoRef.current);
    stopCameraStream(streamRef.current);
    streamRef.current = null;
    setCapturedImage(dataUrl);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-sm overflow-hidden bg-[#E2D2B8] border-4 border-[#3D2314] shadow-[8px_8px_0px_0px_#3D2314] flex flex-col items-center justify-center min-h-[480px]">
      
      {/* Camera denied message */}
      {hasPermission === false && (
        <div className="p-8 text-center text-[#3D2314] font-bold text-xl">
          <p>Please grant camera access to use the photo booth.</p>
        </div>
      )}

      {/* ───── LIVE CAMERA VIEW ───── */}
      {!capturedImage ? (
        <>
          {/* Flash overlay */}
          {isFlashing && (
            <div className="absolute inset-0 z-50 bg-white animate-pulse pointer-events-none" />
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-auto object-cover transform -scale-x-100 ${hasPermission === false ? 'hidden' : 'block'}`}
          />

          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 backdrop-blur-sm">
              <span
                className="text-[12rem] font-black text-[#FFE8D1] drop-shadow-[0_8px_8px_rgba(0,0,0,0.9)] animate-pulse"
                style={{ fontFamily: 'ui-serif, Georgia, serif' }}
              >
                {countdown}
              </span>
            </div>
          )}

          {/* Viewfinder border */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-[#3D2314]/10 z-10" />

          {/* Center reticle */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60 z-10">
            <div className={`w-16 h-16 border-2 rounded-full transition-all duration-300 ${countdown !== null ? 'border-[#D97732] scale-125' : 'border-[#FFE8D1]/80'}`} />
            <div className={`absolute w-32 h-[1px] transition-colors ${countdown !== null ? 'bg-[#D97732]' : 'bg-[#FFE8D1]/40'}`} />
            <div className={`absolute h-32 w-[1px] transition-colors ${countdown !== null ? 'bg-[#D97732]' : 'bg-[#FFE8D1]/40'}`} />
          </div>

          {/* REC badge */}
          <div className="absolute top-4 right-4 bg-[#D97732] text-[#FFE8D1] px-3 py-1 rounded-sm text-xs font-black tracking-widest border-2 border-[#3D2314] uppercase shadow-[2px_2px_0px_0px_#3D2314] flex items-center gap-2 z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_2px_rgba(220,38,38,0.8)]" />
            REC
          </div>

          {/* ──── CAPTURE BUTTON ──── */}
          <button
            onClick={handleCapture}
            disabled={countdown !== null || hasPermission === false}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Take Photo"
          >
            <div className="w-[72px] h-[72px] rounded-full bg-[#3D2314] border-4 border-[#FFE8D1] shadow-[4px_4px_0px_0px_#D97732] flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
              <div className="w-[28px] h-[28px] bg-[#D97732] rounded-full border-2 border-[#FFE8D1]" />
            </div>
          </button>
        </>
      ) : (
        /* ───── CAPTURED IMAGE VIEW ───── */
        <>
          {isFlashing && (
            <div className="absolute inset-0 z-50 bg-white opacity-0 transition-opacity duration-500 pointer-events-none" />
          )}

          <img src={capturedImage} alt="Captured photo" className="w-full h-auto object-cover" />

          {/* Action buttons */}
          <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-[#3D2314] via-[#3D2314]/80 to-transparent flex justify-center gap-6 z-20">
            <button
              onClick={handleRetake}
              className="bg-[#D97732] hover:bg-[#c96622] text-[#FFE8D1] border-2 border-[#FFE8D1] px-8 py-3 font-bold uppercase tracking-wider shadow-[4px_4px_0_0_#FFE8D1] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#FFE8D1]"
            >
              Retake
            </button>
            <button
              onClick={() => alert('Save functionality coming next!')}
              className="bg-[#FFE8D1] hover:bg-[#f5ddc5] text-[#3D2314] border-2 border-[#3D2314] px-8 py-3 font-bold uppercase tracking-wider shadow-[4px_4px_0_0_#3D2314] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#3D2314]"
            >
              Keep Layout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
