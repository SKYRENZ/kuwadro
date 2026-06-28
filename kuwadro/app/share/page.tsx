import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const params = await props.searchParams;
  const imgUrl = (params.img as string) || '';

  return {
    title: 'Shared Frame | Kuwadro',
    description: 'Check out this photo booth captured moment on Kuwadro!',
    openGraph: {
      title: 'Shared Frame | Kuwadro',
      description: 'Check out this photo booth captured moment on Kuwadro!',
      url: `https://kuwadro.vercel.app/share?img=${encodeURIComponent(imgUrl)}`,
      siteName: 'Kuwadro',
      images: imgUrl ? [{ url: imgUrl, width: 1200, height: 900 }] : [],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function SharePage(props: Props) {
  const params = await props.searchParams;
  const imgUrl = (params.img as string) || '';

  return (
    <div className="min-h-screen bg-[#EFE6D5] flex flex-col items-center justify-between py-8 px-4 font-sans text-[#3D2314] relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#EFE6D5] via-[#E2D2B8] to-[#C9B390] z-0 opacity-80 pointer-events-none"></div>
      <div className="fixed inset-0 opacity-[0.05] mix-blend-multiply z-0 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      {/* Header */}
      <div className="z-10 w-full max-w-2xl flex flex-col items-center text-center mt-4 mb-6">
        <h1 className="text-4xl md:text-5xl font-black text-[#3D2314] tracking-tight uppercase drop-shadow-sm mb-2" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
          Kuwadro
        </h1>
        <p className="text-sm font-serif italic text-[#6B4E31]">
          A memory captured in time.
        </p>
      </div>

      {/* Photo Frame Container */}
      <div className="z-10 w-full max-w-xl flex-1 flex items-center justify-center p-2">
        {imgUrl ? (
          <div className="bg-[#FFE8D1] p-4 shadow-[12px_12px_0px_0px_#3D2314] border-4 border-[#3D2314] rounded-sm transform rotate-1 hover:rotate-0 transition-transform duration-300 w-full max-w-md mx-auto">
            <div className="aspect-[4/3] bg-[#3D2314] overflow-hidden border-2 border-[#3D2314] relative">
              <img 
                src={imgUrl} 
                alt="Shared Frame" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 flex justify-between items-center px-1">
              <div className="flex flex-col">
                <span className="text-[#3D2314] font-black text-lg tracking-tighter italic uppercase leading-none">Kuwadro</span>
                <span className="text-[#3D2314]/60 font-mono text-[8px] mt-1">kuwadro.vercel.app</span>
              </div>
              <span className="text-[#3D2314]/40 font-mono text-[9px]">Captured Moment</span>
            </div>
          </div>
        ) : (
          <div className="bg-[#FFE8D1] p-8 border-4 border-[#3D2314] text-center max-w-sm rounded-sm shadow-md">
            <p className="font-bold text-lg text-[#3D2314] mb-4">No image found.</p>
            <p className="text-sm text-[#6B4E31]">Please make sure you followed a correct shared link.</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="z-10 w-full max-w-md flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-8 mb-4 px-4">
        <Link
          href="/choose-layout"
          className="w-full text-center bg-[#D97732] hover:bg-[#c96622] text-[#FFE8D1] border-2 border-[#FFE8D1] px-6 py-3 font-bold uppercase tracking-wider shadow-[4px_4px_0_0_#3D2314] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm rounded-sm"
        >
          Take your own shot
        </Link>
        {imgUrl && (
          <a
            href={imgUrl}
            download="kuwadro-shared-frame.png"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-[#FFE8D1] hover:bg-[#f5ddc5] text-[#3D2314] border-2 border-[#3D2314] px-6 py-3 font-bold uppercase tracking-wider shadow-[4px_4px_0_0_#3D2314] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm rounded-sm"
          >
            Save image
          </a>
        )}
      </div>
    </div>
  );
}
