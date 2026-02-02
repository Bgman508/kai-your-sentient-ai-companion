import React from 'react';
import ParticleBackground from './components/kai/ParticleBackground';

export default function Layout({ children }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        
        :root {
          --kai-bg: #05080f;
          --kai-glow-color: hsl(180, 100%, 50%);
          --kai-border-color: hsla(180, 100%, 50%, 0.2);
          --kai-hover-border-color: hsla(180, 100%, 50%, 0.5);
        }

        body { 
          font-family: 'Inter', sans-serif; 
          background-color: var(--kai-bg);
          color: #e5e7eb;
        }

        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
        }
        
        @keyframes subtle-pulse {
            0%, 100% { filter: drop-shadow(0 0 2px var(--kai-glow-color)); }
            50% { filter: drop-shadow(0 0 5px var(--kai-glow-color)); }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.2); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 255, 0.4); }
      `}</style>
      <div className="min-h-screen w-full relative bg-kai-bg text-white">
        <ParticleBackground />
        
        {/* Main Content */}
        <main className="min-h-screen relative z-10">
          {children}
        </main>
      </div>
    </>
  );
}