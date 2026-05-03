import { useEffect, useState } from 'react';
import AppLogo from './AppLogo';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animationTimer = window.setTimeout(() => setIsVisible(true), 20);
    return () => window.clearTimeout(animationTimer);
  }, []);

  return (
    <div className="fixed inset-0 flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white">
      <div
        className={`flex w-full max-w-md flex-col items-center justify-center rounded-[2rem] bg-white/10 p-8 text-center shadow-[0_40px_120px_rgba(15,23,42,0.35)] transition-all duration-[1600ms] ease-out backdrop-blur-xl ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 shadow-xl shadow-black/25">
          <AppLogo className="h-12 w-12 text-white" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">DailyTools Hub</h1>
        <p className="mt-4 max-w-sm text-sm text-white/80 sm:text-base">
          A modern toolkit for PDFs, images, QR codes, and files — built for mobile and web.
        </p>
        <div className="mt-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm text-white/90 shadow-inner shadow-white/10">
          <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
          Starting your toolkit...
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
