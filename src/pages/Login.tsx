import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Correo electrónico o contraseña incorrectos.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Espera 30 segundos para volver a intentarlo o restablece tu contraseña.');
      } else {
        setError(err.message || 'Error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user doc if it doesn't exist
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email,
        createdAt: serverTimestamp()
      }, { merge: true });

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error con Google Sign-In.');
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
        <Link to="/" className="group flex items-center gap-1.5 md:gap-2 font-['Space_Grotesk'] tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em] text-[#767575] hover:text-[#ff8d87] transition-all duration-300 uppercase text-[9px] sm:text-xs md:text-base px-3 py-2 md:px-6 md:py-3 border border-[#767575]/20 hover:border-[#ff8d87]/50 hover:bg-[#ff8d87]/5 bg-[#0e0e0e]/80 backdrop-blur-md">
          <span className="material-symbols-outlined transition-transform duration-300 group-hover:-translate-x-1 text-sm sm:text-base md:text-2xl">arrow_back</span>
          VOLVER AL INICIO
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
              <h2 className="font-['Space_Grotesk'] text-2xl font-light italic tracking-tight text-white">LOGIN</h2>
              <p className="font-['Space_Grotesk'] text-[10px] tracking-[0.2em] text-[#484847] uppercase mt-1">ACCESS_PROTOCOL_RESTRICTED</p>
            </header>

            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-200 text-sm rounded">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
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

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="font-['Space_Grotesk'] text-[11px] tracking-[0.2em] text-[#adaaaa] uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px]">lock_open</span>
                    CONTRASEÑA
                  </label>
                  <Link className="font-['Space_Grotesk'] text-[9px] tracking-widest text-[#484847] hover:text-[#ff8d87] transition-colors uppercase" to="/recuperar-password">¿OLVIDASTE TU CONTRASEÑA?</Link>
                </div>
                <div className="relative group">
                  <input 
                    className="w-full bg-[#201f1f]/50 border-0 border-b-2 border-[#484847]/30 text-white font-['Space_Grotesk'] tracking-widest px-4 py-3 pr-12 focus:ring-0 focus:border-[#ff8d87] transition-all duration-300 placeholder:text-[#484847]/40" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#484847] hover:text-white transition-colors z-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff8d87] transition-all duration-500 group-focus-within:w-full"></div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  className="w-full bg-[#ff8d87] text-[#65000a] font-['Space_Grotesk'] font-bold text-sm tracking-[0.25em] uppercase py-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,141,135,0.4)] active:scale-[0.98] relative overflow-hidden group disabled:opacity-50" 
                  type="submit"
                  disabled={loading}
                >
                  <span className="relative z-10">{loading ? 'PROCESANDO...' : 'INICIAR SESIÓN'}</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#484847]/30"></div>
                <span className="flex-shrink-0 mx-4 text-[#767575] text-xs uppercase tracking-widest font-['Space_Grotesk']">O</span>
                <div className="flex-grow border-t border-[#484847]/30"></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white text-black font-['Space_Grotesk'] uppercase tracking-[0.1em] font-bold py-3 sm:py-4 hover:bg-gray-200 active:scale-[0.98] transition-all text-sm sm:text-base flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                CONTINUAR CON GOOGLE
              </button>
            </form>

            <div className="text-center pt-4">
              <p className="font-['Space_Grotesk'] text-xs tracking-widest text-[#484847] uppercase">
                ¿No tienes cuenta? 
                <Link className="text-white font-bold hover:text-[#ff8d87] transition-colors border-b border-white/20 hover:border-[#ff8d87] pb-0.5 ml-2" to="/registro">CREAR UNA</Link>
              </p>
            </div>
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
