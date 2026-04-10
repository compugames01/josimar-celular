import React from 'react';
import { Link } from 'react-router-dom';

export default function Programs() {
  const programs = [
    {
      title: "NEURAL_NET_V1",
      icon: "terminal",
      desc: "Optimización de flujos de datos en tiempo real para arquitecturas distribuidas."
    },
    {
      title: "CRYPT_VAULT",
      icon: "security",
      desc: "Protocolos de encriptación cuántica de grado industrial para almacenamiento seguro."
    },
    {
      title: "OS_OVERRIDE",
      icon: "developer_board",
      desc: "Inyección de código a bajo nivel para optimización de hardware heredado."
    },
    {
      title: "NODE_LINK",
      icon: "hub",
      desc: "Gestión de nodos P2P con balanceo de carga automatizado por IA."
    },
    {
      title: "TRACE_SYS",
      icon: "monitoring",
      desc: "Monitoreo de red en tiempo real con detección de anomalías heurísticas."
    },
    {
      title: "CORE_DRIVE",
      icon: "settings_input_component",
      desc: "Controladores de bajo nivel para interfaces de hardware experimentales."
    }
  ];

  return (
    <div className="bg-[#050505] text-white font-['Inter'] overflow-x-hidden min-h-screen flex flex-col relative" style={{
      backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255, 77, 77, 0.08) 0%, transparent 40%), radial-gradient(circle at 10% 80%, rgba(255, 77, 77, 0.05) 0%, transparent 35%), linear-gradient(45deg, #050505 25%, #0a0a0a 25%, #0a0a0a 50%, #050505 50%, #050505 75%, #0a0a0a 75%, #0a0a0a 100%)',
      backgroundSize: '100% 100%, 100% 100%, 100px 100px'
    }}>
      <div className="fixed inset-0 pointer-events-none opacity-15" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAWr9M4vzbOBjwb9YkIWsRKBUuFyFkoIrLVngIiFBzkTo_R2wfCnQ_hbe37N-0TzcYezW57aFuURWLDTLtXRgv5HV6axBkAGD6EoTcRAouLDxCsSU7m6w38FpCK8zehqDhzh9SJFScSIdbrFxiW7AafjUForKOnMUIFVrYf7QKXiNdWPn3QitCrcOQVpdBEvkkFPRv3-sG62VixDkNpPKelxd_KvPz-LpXKkcl1bitdH6T2F119IDInWGqE3JPYi_94-32nWiUwdC8)' }}></div>
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(255, 77, 77, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 77, 77, 0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60 pointer-events-none"></div>

      <nav className="fixed top-0 w-full z-50 bg-[#000000]/40 backdrop-blur-md border-b border-white/5">
        <div className="relative flex justify-between items-center px-6 md:px-10 py-4 md:py-6 max-w-7xl mx-auto">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tighter italic font-['Space_Grotesk'] text-[#ff4d4d] hover:scale-105 transition-transform cursor-pointer block">
            COMPUGAMES
          </Link>
          <div className="flex items-center">
            <span className="material-symbols-outlined text-[#ff4d4d] absolute left-1/2 -translate-x-1/2 scale-110 drop-shadow-[0_0_8px_rgba(255,77,77,0.5)]">star</span>
            <Link to="/" className="bg-[#ff4d4d] text-black px-4 md:px-6 py-2 font-['Space_Grotesk'] tracking-[0.2em] uppercase text-xs md:text-sm font-bold hover:bg-[#ff7670] transition-all shadow-[0_0_15px_rgba(255,77,77,0.3)] hover:scale-[1.03]">
              INICIO
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 md:pt-48 pb-20 md:pb-32 relative flex-grow">
        <header className="relative px-6 md:px-10 max-w-7xl mx-auto mb-12 md:mb-20">
          <div className="flex flex-col relative">
            <div className="absolute -inset-8 bg-black/40 blur-2xl rounded-full -z-10 hidden md:block"></div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 md:w-12 h-[2px] bg-[#ff4d4d] shadow-[0_0_8px_#ff4d4d]"></div>
              <span className="font-['Space_Grotesk'] tracking-[0.3em] text-[#ff4d4d] text-[10px] md:text-xs font-bold uppercase">REPOSITORIO</span>
            </div>
            <h1 className="font-['Space_Grotesk'] text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter leading-[0.95] mb-8 drop-shadow-2xl">
              PROGRAMAS <br/>
              <span className="text-[#ff4d4d] drop-shadow-[0_0_20px_rgba(255,77,77,0.4)]">// ARCHIVO</span>
            </h1>
            <p className="text-white/80 font-['Inter'] text-base md:text-xl leading-relaxed max-w-xl border-l-2 border-[#ff4d4d]/40 pl-4 md:pl-8 backdrop-blur-sm bg-white/5 py-4">
              Repositorio central de protocolos de código abierto. Herramientas diseñadas para la optimización de sistemas y el despliegue de redes neuronales de baja latencia.
            </p>
          </div>
        </header>

        <section className="px-6 md:px-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {programs.map((prog, idx) => (
              <div key={idx} className="group relative flex flex-col bg-[#1a1919]/50 border border-white/10 hover:border-[#ff4d4d]/50 transition-all duration-500 overflow-hidden">
                <div className="aspect-video bg-[#262626] flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#ff4d4d]/5"></div>
                  <span className="material-symbols-outlined text-white/20 text-4xl md:text-5xl">{prog.icon}</span>
                </div>
                <div className="p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="font-['Space_Grotesk'] font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-[#ff4d4d] transition-colors uppercase">{prog.title}</h3>
                    <button className="w-full sm:w-auto text-[10px] font-['Space_Grotesk'] text-white border border-[#ff4d4d] px-4 py-2 uppercase font-bold tracking-widest bg-black/40 hover:bg-[#ff4d4d] hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(255,77,77,0.2)] hover:shadow-[0_0_15px_rgba(255,77,77,0.5)]">DESCARGAR</button>
                  </div>
                  <div className="w-full h-[1px] bg-gradient-to-r from-[#ff4d4d]/30 to-transparent mb-4"></div>
                  <p className="text-[#adaaaa] text-sm font-['Inter'] line-clamp-2">{prog.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 md:px-10 py-10 md:py-12 bg-black relative overflow-hidden mt-auto border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
          <div className="font-['Space_Grotesk'] text-[10px] md:text-xs tracking-[0.4em] text-white/40 uppercase text-center sm:text-left">
            © 2026 COMPUGAMES
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <span className="font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-widest text-white/20 uppercase cursor-pointer hover:text-[#ff4d4d] transition-colors">TERMINOS</span>
            <span className="font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-widest text-white/20 uppercase cursor-pointer hover:text-[#ff4d4d] transition-colors">PRIVACIDAD</span>
            <span className="font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-widest text-white/20 uppercase cursor-pointer hover:text-[#ff4d4d] transition-colors">V_2.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
