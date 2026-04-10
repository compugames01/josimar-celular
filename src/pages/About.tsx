import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-[#0e0e0e] text-white font-['Inter'] overflow-x-hidden selection:bg-[#ff8d87] selection:text-[#65000a] min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/70 backdrop-blur-xl border-b border-zinc-900/50 flex items-center px-4 md:px-8 h-16">
        <Link to="/" className="text-lg md:text-xl italic font-bold text-[#ff4d4d] tracking-tighter z-10 hover:scale-105 transition-transform cursor-pointer">COMPUGAMES</Link>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
          <button className="scale-95 active:scale-90 transition-transform p-3 hover:bg-zinc-900/50 transition-all duration-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#ff4d4d] !text-2xl">star</span>
          </button>
        </div>
        <div className="ml-auto flex items-center z-10">
          <Link className="font-['Space_Grotesk'] text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#ff4d4d] font-bold transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(255,77,77,0.5)] py-2" to="/">
            INICIO
          </Link>
        </div>
      </nav>

      <main className="relative flex-grow flex flex-col pt-16">
        <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 md:px-12 py-12 md:py-20 overflow-hidden" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 77, 77, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 20%, #000000 100%)' }}></div>
          
          <div className="hidden sm:block absolute top-1/4 left-6 md:left-10 w-px h-32 md:h-64 bg-gradient-to-b from-transparent via-[#ff4d4d33] to-transparent"></div>
          <div className="hidden sm:block absolute bottom-1/4 right-6 md:right-10 w-px h-32 md:h-64 bg-gradient-to-b from-transparent via-[#ff4d4d33] to-transparent"></div>
          
          <div className="relative z-10 max-w-6xl w-full">
            <header className="mb-10 md:mb-16">
              <h1 className="font-['Space_Grotesk'] text-5xl sm:text-7xl md:text-8xl lg:text-9xl italic font-bold tracking-tighter leading-[0.9] flex flex-col">
                <span className="text-white">NOSOTROS</span>
                <span className="text-[#ff4d4d] ml-8 sm:ml-16 md:ml-24 lg:ml-32 mt-2 md:mt-0">// MISIÓN</span>
              </h1>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
              <div className="lg:col-span-7 space-y-8">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#adaaaa] leading-relaxed font-light">
                  Forjamos el futuro de la computación abierta. Desarrollamos 
                  <span className="text-white font-medium italic"> software de computadora para uso libre </span> 
                  diseñado para el rendimiento extremo, blindado con protocolos de 
                  <span className="text-white font-medium italic"> seguridad del 100%</span>. 
                  En COMPUGAMES, la transparencia técnica es nuestra ley y tu soberanía digital, nuestra misión.
                </p>
                <div className="h-px w-24 md:w-32 bg-[#ff8d87]"></div>
              </div>
              
              <div className="lg:col-span-5 space-y-8 text-[#adaaaa] font-['Inter']">
                <p className="text-base md:text-lg leading-relaxed">
                  En COMPUGAMES, creemos en la transparencia radical y el rendimiento absoluto. Nuestra arquitectura está diseñada para aquellos que demandan control total sobre su entorno digital. No solo creamos herramientas; forjamos el estándar de la computación moderna.
                </p>
                <div className="flex">
                  <button className="w-full sm:w-auto bg-[#ff8d87] text-[#000000] px-10 py-5 font-['Space_Grotesk'] text-xs uppercase tracking-widest font-bold hover:bg-[#ff7670] transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,77,77,0.2)]">
                    EXPLORAR LABS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-[#000000] border-t border-zinc-900/50 px-6 md:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-['Space_Grotesk'] text-[10px] md:text-xs uppercase tracking-[0.15em] text-zinc-600">
            © 2026 COMPUGAMES.
          </div>
          <div className="flex gap-6 items-center">
            <div className="h-px w-8 bg-zinc-800 hidden md:block"></div>
            <div className="text-[10px] uppercase tracking-[0.1em] text-zinc-700">PROTOCOLO ABIERTO</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
