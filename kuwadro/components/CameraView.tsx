"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { startCameraStream, captureFrame, stopCameraStream } from '@/lib/camera';
import { generatePrintImage, downloadImage } from '@/lib/print';

interface CameraViewProps {
  layout: {
    id: string;
    name: string;
    count: number;
  };
}

const CameraView = ({ layout }: CameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Guard for missing layout
  if (!layout) {
    return <div className="p-8 text-[#FFE8D1]">Initializing layout...</div>;
  }
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const isComplete = capturedImages.length === layout.count;

  // Boot camera on mount or when retaking
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

    if (!isComplete) {
      init();
    } else {
      stopCameraStream(streamRef.current);
      streamRef.current = null;
    }

    return () => {
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
      }
    };
  }, [isComplete]);

  // Runs the countdown, then captures
  const handleCapture = useCallback(() => {
    if (countdown !== null || isComplete) return;

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
  }, [countdown, isComplete]);

  const doCapture = () => {
    if (!videoRef.current) return;

    // Flash effect
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500);

    const dataUrl = captureFrame(videoRef.current);
    setCapturedImages(prev => [...prev, dataUrl]);
  };

  const handleRetake = () => {
    setCapturedImages([]);
  };

  const handleDownload = async () => {
    if (capturedImages.length === 0) return;

    setIsSaving(true);
    try {
      const compositeUrl = await generatePrintImage(capturedImages, layout.id, layout.name);
      downloadImage(compositeUrl, `kuwadro-${layout.id}-${Date.now()}.png`);
    } catch (err) {
      console.error('Failed to generate print:', err);
      alert('Something went wrong while saving your photo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (capturedImages.length === 0) return;
    setIsSharing(true);

    try {
      // 1. Generate the composite image
      const compositeUrl = await generatePrintImage(capturedImages, layout.id, layout.name);

      // 2. Upload it securely to Cloudinary via Next API route
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: compositeUrl }),
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error || 'Failed to upload photo for sharing.');
      }

      const uploadData = await uploadRes.json();
      const cloudinaryUrl = uploadData.url;

      // 3. Formulate the dynamic target page URL to be shared
      let baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kuwadro.vercel.app';
      if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
        baseUrl = 'https://kuwadro.vercel.app';
      }

      const shareLandingUrl = `${baseUrl}/share?img=${encodeURIComponent(cloudinaryUrl)}`;
      const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLandingUrl)}`;
      
      window.open(fbShareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    } catch (err: any) {
      console.error('Sharing failed:', err);
      alert(err.message || 'Something went wrong while uploading your photo.');
    } finally {
      setIsSharing(false);
    }
  };

  const renderLayoutOverlay = (images: (string | null)[], isPreview: boolean = false) => {
    let gridClass = "grid-cols-1 grid-rows-1";
    if (layout.id === '2-picture') gridClass = "grid-cols-2 grid-rows-1";
    if (layout.id === '4-picture') gridClass = "grid-cols-2 grid-rows-2";

    return (
      <div className={`grid w-full h-full gap-3 p-4 bg-[#3D2314] ${gridClass}`}>
        {Array.from({ length: layout.count }).map((_, i) => (
          <div key={i} className={`relative aspect-[4/3] bg-[#EFE6D5]/10 border-2 border-[#EFE6D5]/20 overflow-hidden flex items-center justify-center ${layout.id === 'solo' ? 'h-full' : ''}`}>
            {images[i] ? (
              <img src={images[i]!} alt={`Shot ${i + 1}`} className="w-full h-full object-cover" />
            ) : (isPreview && i === capturedImages.length) ? (
              <div className="absolute inset-0 bg-[#D97732]/20 animate-pulse flex items-center justify-center">
                <span className="text-[#FFE8D1] font-bold text-sm tracking-widest uppercase">Next Shot</span>
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 text-[#FFE8D1]">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            )}

            {/* Slot Number */}
            <div className="absolute top-2 left-2 w-6 h-6 bg-[#3D2314] text-[#FFE8D1] text-[10px] font-black flex items-center justify-center rounded-full border border-[#FFE8D1]/30">
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center relative min-h-[500px]">

      {/* ───── SIDE PREVIEW FRAME (Elegant Sidebar) ───── */}
      {!isComplete && (
        <div className="w-40 xl:w-48 shrink-0 lg:absolute lg:left-0 lg:top-4 animate-in slide-in-from-left duration-700 mb-8 lg:mb-0 z-20">
          <div className="bg-[#E2D2B8] p-2 border-2 border-[#3D2314] shadow-[4px_4px_0px_0px_#3D2314] rounded-sm transform lg:-rotate-1">
            <div className="text-[10px] font-black text-[#3D2314] uppercase tracking-[0.2em] mb-2 opacity-80 text-center">Your Frame</div>
            <div className="scale-100 origin-top">
              {renderLayoutOverlay(capturedImages, true)}
            </div>
          </div>
        </div>
      )}

      <div className={`relative w-full max-w-2xl rounded-sm overflow-hidden bg-[#3D2314] border-[6px] border-[#3D2314] shadow-[16px_16px_0px_0px_#3D2314] flex flex-col items-center justify-center ${isComplete ? 'min-h-auto' : 'min-h-[360px] md:min-h-[440px]'}`}>

        {/* Camera denied message */}
        {hasPermission === false && (
          <div className="p-8 text-center text-[#FFE8D1] font-bold text-xl">
            <p>Please grant camera access to use the photo booth.</p>
          </div>
        )}

        {/* ───── LIVE CAMERA VIEW ───── */}
        {!isComplete ? (
          <div className="relative w-full aspect-video md:aspect-[4/3] flex items-center justify-center overflow-hidden">
            {/* Flash overlay */}
            {isFlashing && (
              <div className="absolute inset-0 z-50 bg-white animate-pulse pointer-events-none" />
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${hasPermission === false ? 'hidden' : 'block'}`}
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

            {/* Viewfinder elements */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-[#3D2314]/10 z-10" />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-60 z-10">
              <div className={`w-16 h-16 border-2 rounded-full transition-all duration-300 ${countdown !== null ? 'border-[#D97732] scale-125' : 'border-[#FFE8D1]/80'}`} />
            </div>

            {/* REC badge with shot count */}
            <div className="absolute top-3 right-3 bg-[#D97732] text-[#FFE8D1] px-2 py-0.5 rounded-sm text-[10px] font-black tracking-widest border-2 border-[#3D2314] uppercase shadow-[1px_1px_0px_0px_#3D2314] flex items-center gap-1.5 z-10">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_6px_1px_rgba(220,38,38,0.8)]" />
              SHOT {capturedImages.length + 1} / {layout.count}
            </div>

            {/* ──── CAPTURE BUTTON ──── */}
            <button
              onClick={handleCapture}
              disabled={countdown !== null || hasPermission === false}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 group disabled:opacity-50 disabled:cursor-not-allowed"
              title="Take Photo"
            >
              <div className="w-[88px] h-[88px] rounded-full bg-[#3D2314] border-[6px] border-[#FFE8D1] shadow-[4px_4px_0px_0px_#D97732] flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
                <div className="w-[36px] h-[36px] bg-[#D97732] rounded-full border-2 border-[#FFE8D1]" />
              </div>
            </button>
          </div>
        ) : (
          /* ───── FINAL LAYOUT PREVIEW ───── */
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-lg mx-auto p-2">
              <div className="bg-[#FFE8D1] p-2.5 shadow-2xl border-x-[8px] border-t-[8px] border-b-[36px] border-[#FFE8D1] relative">
                {renderLayoutOverlay(capturedImages)}
                {/* Branding on the bottom of the "print" */}
                <div className="absolute bottom-[-36px] left-0 w-full flex justify-between px-4 items-center">
                  <div className="flex flex-col">
                    <span className="text-[#3D2314] font-black text-xl tracking-tighter italic uppercase leading-none">Kuwadro</span>
                    <span className="text-[#3D2314]/60 font-mono text-[8px] mt-1">kuwadro.vercel.app</span>
                  </div>
                  <span className="text-[#3D2314]/40 font-mono text-[10px]">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full p-6 bg-[#3D2314] flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 z-20 mt-4">
              <button
                onClick={handleRetake}
                className="w-full sm:w-auto bg-[#D97732] hover:bg-[#c96622] text-[#FFE8D1] border-2 border-[#FFE8D1] px-8 py-3 font-bold uppercase tracking-wider shadow-[6px_6px_0_0_#FFE8D1] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_#FFE8D1] text-base text-center"
              >
                Session Retake
              </button>
              <button
                onClick={handleDownload}
                disabled={isSaving}
                className="w-full sm:w-auto bg-[#FFE8D1] hover:bg-[#f5ddc5] text-[#3D2314] border-2 border-[#3D2314] px-8 py-3 font-bold uppercase tracking-wider shadow-[6px_6px_0_0_#3D2314] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_#3D2314] text-base disabled:opacity-50 text-center"
              >
                {isSaving ? 'Processing...' : 'Save to Device'}
              </button>
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="w-full sm:w-auto bg-[#1877F2] hover:bg-[#166fe5] text-[#FFE8D1] border-2 border-[#FFE8D1] px-8 py-3 font-bold uppercase tracking-wider shadow-[6px_6px_0_0_#FFE8D1] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_#FFE8D1] text-base flex items-center justify-center gap-2 text-center disabled:opacity-55"
              >
                <svg className="w-5 h-5 fill-current animate-pulse" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {isSharing ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;
