import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      // Check if the email exists in Firebase Auth
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        setError('El correo electrónico no existe.');
        setLoading(false);
        return;
      }

      // Firebase enviará un correo con un enlace seguro.
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No hay ningún usuario registrado con este correo.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Espera unos minutos antes de volver a intentarlo.');
      } else {
        setError(err.message || 'Error al enviar el correo de recuperación.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e0e] text-white font-['Inter'] relative overflow-x-hidden" style={{
      backgroundImage: 'linear-gradient(rgba(14, 14, 14, 0.7), rgba(14, 14, 14, 0.85)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuBRxKUrOVGNqp03hjxvAvep_HEXBCQ4YYo-cvG-y0bYW3DjzUZiy5m_6nk9HhWXnbegU068cms7p9mn1t3zVXoc-HD9xOujHsOg-w51Pb7qzrQiqxTR30Fqq8VAl42z261tNcQXBCgrAfVVYkqLlHujQ-hCOEk7OXhEkPTKx9FFHx6DddPk0jycH-eCbK6pg4WY5RgA6Htu-25-xqJPp8pmFR7FCtl757CC2C-fUsMFWqQ_eSJ5RHTAw0zPqlEUe6JSfDdz58WXp8g)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
        <Link to="/login" className="group flex items-center gap-1.5 md:gap-2 font-['Space_Grotesk'] tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em] text-[#767575] hover:text-[#ff8d87] transition-all duration-300 uppercase text-[9px] sm:text-xs md:text-base px-3 py-2 md:px-6 md:py-3 border border-[#767575]/20 hover:border-[#ff8d87]/50 hover:bg-[#ff8d87]/5 bg-[#0e0e0e]/80 backdrop-blur-md">
          <span className="material-symbols-outlined transition-transform duration-300 group-hover:-translate-x-1 text-sm sm:text-base md:text-2xl">arrow_back</span>
          VOLVER AL LOGIN
        </Link>
      </div>

      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#ff8d87]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#ff8d87]/10 blur-[150px] rounded-full pointer-events-none"></div>

      <main className="flex-grow flex items-center justify-center w-full relative z-10 py-24 px-4 sm:px-0">
        <div className="w-full max-w-[480px]">
          <div className="bg-[#131313]/70 backdrop-blur-2xl border-l border-[#ff8d87]/20 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
            <span className="text-[10px] font-['Space_Grotesk'] tracking-[0.3em] text-[#ff8d87] uppercase">AUTH_SYSTEM_v4.0</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-24 bg-[#ff8d87]/40"></div>

          <div className="mb-12 text-center">
            <h1 className="font-['Space_Grotesk'] font-bold italic text-4xl tracking-tighter text-[#ff8d87] mb-2">COMPUGAMES</h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-8 bg-[#484847]"></div>
              <span className="font-['Space_Grotesk'] text-xs tracking-[0.4em] text-[#767575] uppercase">KINETIC_ARCHIVE</span>
              <div className="h-[1px] w-8 bg-[#484847]"></div>
            </div>
          </div>

          <div className="space-y-8">
            <header className="mb-8">
              <h2 className="font-['Space_Grotesk'] text-2xl font-light italic tracking-tight text-white">RECUPERAR CONTRASEÑA</h2>
              <p className="font-['Space_Grotesk'] text-[10px] tracking-[0.2em] text-[#484847] uppercase mt-1">PASSWORD_RESET_PROTOCOL</p>
            </header>

            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-200 text-sm rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-6 p-3 bg-green-500/20 border border-green-500 text-green-200 text-sm rounded">
                {message}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleReset}>
              <div className="space-y-2">
                <label className="font-['Space_Grotesk'] text-[11px] tracking-[0.2em] text-[#adaaaa] uppercase flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">alternate_email</span>
                  CORREO ELECTRÓNICO
                </label>
                <div className="relative group">
                  <input 
                    className="w-full bg-[#201f1f]/50 border-0 border-b-2 border-[#484847]/30 text-white font-['Space_Grotesk'] tracking-wider px-4 py-3 focus:ring-0 focus:border-[#ff8d87] transition-all duration-300 placeholder:text-[#484847]/40" 
                    placeholder="USER@ARCHIVE.SYS" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff8d87] transition-all duration-500 group-focus-within:w-full"></div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  className="w-full bg-[#ff8d87] text-[#65000a] font-['Space_Grotesk'] font-bold text-sm tracking-[0.25em] uppercase py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,141,135,0.4)] active:scale-[0.98] relative overflow-hidden group disabled:opacity-50" 
                  type="submit"
                  disabled={loading || !email}
                >
                  <span className="relative z-10">{loading ? 'PROCESANDO...' : 'ENVIAR ENLACE'}</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center px-4">
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-[#ff8d87]/30"></div>
            <div className="w-1.5 h-1.5 bg-[#ff8d87]/30"></div>
            <div className="w-1.5 h-1.5 bg-[#ff8d87]"></div>
          </div>
          <div className="text-[9px] font-['Space_Grotesk'] tracking-[0.4em] text-[#484847] uppercase">
            ENCRYPTION_LAYER_6_ACTIVE
          </div>
        </div>
        </div>
      </main>

      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      <footer className="relative w-full z-20 flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-6 bg-black/60 backdrop-blur-md mt-auto border-t border-white/5 gap-4 md:gap-0">
        <div className="flex items-center gap-6">
          <span className="font-['Space_Grotesk'] italic font-black text-[#ff8d87] text-sm tracking-tighter">COMPUGAMES</span>
          <div className="hidden md:block h-3 w-[1px] bg-[#484847]/30"></div>
          <p className="font-['Space_Grotesk'] text-xs md:text-sm tracking-[0.3em] text-[#ff8d87] uppercase font-bold drop-shadow-md">© 2026 COMPUGAMES. ALL RIGHTS RESERVED.</p>
        </div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a className="font-['Space_Grotesk'] text-[9px] tracking-[0.2em] text-zinc-600 hover:text-white transition-colors uppercase" href="#">TERMS OF SERVICE</a>
          <a className="font-['Space_Grotesk'] text-[9px] tracking-[0.2em] text-zinc-600 hover:text-white transition-colors uppercase" href="#">PRIVACY POLICY</a>
          <a className="font-['Space_Grotesk'] text-[9px] tracking-[0.2em] text-zinc-600 hover:text-white transition-colors uppercase" href="#">TECHNICAL SUPPORT</a>
        </div>
      </footer>
    </div>
  );
}
