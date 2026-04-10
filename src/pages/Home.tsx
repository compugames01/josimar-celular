import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().username) {
            setUsername(docSnap.data().username);
          } else {
            setUsername(currentUser.displayName || currentUser.email?.split('@')[0] || 'USUARIO');
          }
        } catch (error) {
          setUsername(currentUser.displayName || currentUser.email?.split('@')[0] || 'USUARIO');
        }
      } else {
        setUsername('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="bg-black text-white font-['Inter'] overflow-x-hidden selection:bg-[#ff4d4d] selection:text-white min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md px-4 md:px-8 lg:px-12 py-3 md:py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center min-w-[80px] lg:min-w-[120px]">
          <button className="lg:hidden text-white flex items-center" onClick={() => setMobileMenuOpen(true)}>
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
          <Link className="hidden lg:block font-['Space_Grotesk'] tracking-[0.15em] text-xs lg:text-[14px] uppercase font-bold text-white/70 hover:text-white transition-colors" to="/">INICIO</Link>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="relative animate-[pulseGlow_2s_infinite_ease-in-out]">
            <span className="material-symbols-outlined text-2xl md:text-3xl lg:text-4xl text-[#ff4d4d] font-light" style={{ fontVariationSettings: "'FILL' 0" }}>star</span>
            <div className="h-2 md:h-3 lg:h-4 w-[1px] bg-[#ff4d4d] absolute -bottom-1 md:-bottom-2 lg:-bottom-3 left-1/2 -translate-x-1/2"></div>
          </div>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6 lg:space-x-10">
          <div className="hidden lg:flex items-center space-x-10">
            {user && (
              <Link className="font-['Space_Grotesk'] tracking-[0.15em] text-xs lg:text-[14px] uppercase font-bold text-white/70 hover:text-white transition-colors" to="/programas">PROGRAMAS</Link>
            )}
            <Link className="font-['Space_Grotesk'] tracking-[0.15em] text-xs lg:text-[14px] uppercase font-bold text-white/70 hover:text-white transition-colors" to="/nosotros">SOBRE NOSOTROS</Link>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/ajuste" className="text-white/70 hover:text-[#ff4d4d] transition-colors">
                <span className="material-symbols-outlined">settings</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-transparent border border-[#ff4d4d] text-[#ff4d4d] px-4 py-2 font-['Space_Grotesk'] tracking-[0.1em] text-[10px] md:text-[12px] uppercase font-black italic skew-x-[-15deg] hover:bg-[#ff4d4d] hover:text-black transition-all"
              >
                <span className="inline-block skew-x-[15deg]">SALIR</span>
              </button>
            </div>
          ) : (
            <Link to="/registro" className="bg-[#ff4d4d] text-white px-4 md:px-6 lg:px-8 py-2 md:py-2.5 font-['Space_Grotesk'] tracking-[0.1em] text-[10px] md:text-[12px] lg:text-[14px] uppercase font-black italic skew-x-[-15deg] hover:brightness-110 transition-all inline-block">
              <span className="inline-block skew-x-[15deg]">REGÍSTRATE</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] bg-black transition-transform duration-300 lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-end">
            <button className="text-white" onClick={() => setMobileMenuOpen(false)}>
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>
          <div className="mt-12 flex flex-col space-y-8">
            <Link className="font-['Space_Grotesk'] tracking-[0.2em] text-lg uppercase font-bold text-white" to="/" onClick={() => setMobileMenuOpen(false)}>INICIO</Link>
            {user && (
              <Link className="font-['Space_Grotesk'] tracking-[0.2em] text-lg uppercase font-bold text-white" to="/programas" onClick={() => setMobileMenuOpen(false)}>PROGRAMAS</Link>
            )}
            <Link className="font-['Space_Grotesk'] tracking-[0.2em] text-lg uppercase font-bold text-white" to="/nosotros" onClick={() => setMobileMenuOpen(false)}>SOBRE NOSOTROS</Link>
          </div>
        </div>
      </div>

      <main className="relative min-h-screen pt-24 md:pt-28 pb-12 flex flex-col items-center justify-center">
        <aside className="fixed left-4 xl:left-8 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col items-center space-y-5 font-['Space_Grotesk'] text-lg tracking-[1.5em] text-white/40 uppercase pointer-events-none">
          <span>C</span><span>O</span><span>M</span><span>P</span><span>U</span><span>G</span><span>A</span><span>M</span><span>E</span><span>S</span>
        </aside>

        <div className="relative w-full max-w-[1440px] px-4 sm:px-6 md:px-12 mx-auto">
          <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[21/9] overflow-hidden border-x border-[#ff4d4d]/20" style={{
            clipPath: 'polygon(0% 5%, 15% 0%, 35% 8%, 55% 2%, 75% 10%, 100% 0%, 100% 95%, 85% 100%, 65% 92%, 45% 98%, 25% 90%, 0% 100%)'
          }}>
            <div className="w-full h-full animate-[zoomForward_15s_infinite_alternate_ease-in-out]">
              <img alt="Hero Character" className="w-full h-full object-cover object-center animate-[walkBob_2s_infinite_ease-in-out]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa8Q4IlQwH87XIOVTMRu-tLcvWOI4q7U2Iajayf1grvIIKtyKbc6ZGCcGLzo9Ov3NzJudb6eGp03lvMrY2PMRd4Y1g1-fs1A4K_IJ6-pb1a0MUNjEdnvNRMS3hYF15YZWFAmQmkjQr-2VeFACwxQKxXU_0RPitP4K3tuXSLKvBSolC5D_d7D9UsHhmg-RUzlTPOcn_MGTDtUni72CNXtK8ES-xlcaRBCVq0Mi9vp7j3ZgiBoEnfMNw1LyS5oyn4WSe0BJB9b7PPe0"/>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center md:justify-end pb-[10%] md:pb-[8%] pointer-events-none z-20">
            <h1 className="text-white font-['Space_Grotesk'] font-black italic tracking-tight md:tracking-[-0.05em] leading-none uppercase select-none text-4xl sm:text-6xl md:text-[9vw] lg:text-[11vw]" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.4)' }}>
              {user ? username : 'COMPUGAMES'}
            </h1>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 md:mt-16 text-center px-4 max-w-4xl mx-auto w-full overflow-hidden">
          <p className="font-['Space_Grotesk'] tracking-[0.4em] sm:tracking-[0.6em] md:tracking-[0.8em] text-white/80 uppercase mb-8 md:mb-10 text-sm sm:text-base md:text-lg lg:text-xl whitespace-nowrap overflow-hidden text-ellipsis">
            HOLA : BIENVENIDO
          </p>
          {!user && (
            <Link to="/registro" className="text-[#ff4d4d] text-xl sm:text-2xl md:text-3xl font-['Space_Grotesk'] font-black italic tracking-[0.1em] uppercase hover:scale-105 active:scale-95 transition-transform duration-300 inline-block">
              REGÍSTRATE
            </Link>
          )}
        </div>
      </main>

      <footer className="w-full px-6 md:px-12 py-8 flex flex-col sm:flex-row justify-between items-center gap-6 mt-auto">
        <div className="text-[#ff4d4d] font-['Space_Grotesk'] text-xs md:text-sm tracking-[0.3em] uppercase text-center sm:text-left font-bold drop-shadow-md">
          © 2026 COMPUGAMES • TODOS LOS DERECHOS RESERVADOS
        </div>
      </footer>
    </div>
  );
}
