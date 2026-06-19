import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#EFE6D5] overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Background decoration - Vintage radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#EFE6D5] via-[#E2D2B8] to-[#C9B390] z-0 opacity-80"></div>
      
      {/* Retro noise/grain overlay */}
      <div className="absolute inset-0 opacity-[0.05] mix-blend-multiply z-0 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>

      <div className="z-10 flex flex-col items-center text-center px-4">
        {/* Decorative Retro Lines */}
        <div className="flex gap-2 mb-8 opacity-80">
          <div className="h-3 w-16 bg-[#D2691E] rounded-full"></div>
          <div className="h-3 w-8 bg-[#8B4513] rounded-full"></div>
          <div className="h-3 w-16 bg-[#CD853F] rounded-full"></div>
        </div>

        {/* Logo/Brand */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#3D2314] mb-6 drop-shadow-sm uppercase" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
          Kuwadro
        </h1>
        
        {/* Tagline */}
        <p className="text-lg md:text-2xl text-[#6B4E31] max-w-2xl font-serif italic mb-12">
          Instant pose-triggered capturing and event-ready layouts for your unforgettable moments.
        </p>

        {/* Action Button - Tactile / Physical Retro Style */}
        <Link 
          href="/capture"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#D97732] border-4 border-[#3D2314] text-[#FFE8D1] font-bold text-xl uppercase tracking-widest rounded-sm transition-all duration-150 shadow-[6px_6px_0px_0px_#3D2314] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#3D2314] active:translate-x-[6px] active:translate-y-[6px] active:shadow-[0px_0px_0px_0px_#3D2314]"
        >
          <span className="relative flex items-center gap-3">
            {/* Retro Camera Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
            Get Captured
          </span>
        </Link>
      </div>
    </div>
  );
}
