import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Registro() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('Debes aceptar los términos de servicio y la política de privacidad.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (username.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: username,
        email: user.email,
        createdAt: serverTimestamp()
      });

      navigate('/login');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado.');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil. Debe tener al menos 6 caracteres.');
      } else {
        setError(err.message || 'Error al registrar usuario.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');

    if (!termsAccepted) {
      setError('Debes aceptar los términos de servicio y la política de privacidad.');
      return;
    }

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
    <div className="min-h-screen flex flex-col items-center bg-[#0e0e0e] text-white font-['Inter']" style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuD9HsL4pk8VILCfJRShMRe_QZSNQ7OYhiNOl1kPVXCB5cXY_-fViAXmMv54rKxzni3FRzv4HpqaN8s2YOFlVWUGqytLh53JaVIuPnGY7TEtEwudv-G9GbmpDEZ_kxE-SqAxkT_ldwkEJ4ouGt5mQcWj57pp2b6Qd_Stq5wsh0rNTApDB8fkc4OpRKvqrfZDydFb14gdB8YHBVf_UDeVT5kEiT7bowEz-Yp0Mcjivwzg7Ara0hYe1tm2b3d2QbPRILp9rPrX9hcHIaE)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }}>
      <header className="w-full flex justify-center items-center py-8 md:py-12 px-6 relative z-10">
        <Link to="/" className="absolute left-6 md:left-12 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-[#767575]/20 hover:border-[#ff8d87]/50 hover:bg-[#ff8d87]/5 rounded-full group transition-all duration-300">
          <span className="material-symbols-outlined text-[#ff4d4d] transition-transform duration-300 group-hover:-translate-x-1 text-xl md:text-2xl">arrow_back</span>
        </Link>
        <div className="text-2xl md:text-3xl italic font-bold tracking-tighter text-[#ff4d4d] drop-shadow-[0_0_12px_rgba(255,77,77,0.6)] font-['Space_Grotesk']">
          COMPUGAMES
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center w-full px-4 sm:px-6 relative z-10 pb-12">
        <div className="w-full max-w-[95%] sm:max-w-md bg-black/80 backdrop-blur-md p-6 sm:p-8 md:p-12 border-t border-[#ff4d4d]/40 shadow-[0_0_40px_rgba(255,77,77,0.15)]">
          <div className="mb-8 md:mb-10">
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-tight">Crear cuenta</h2>
            <div className="h-1 w-12 sm:w-16 bg-[#ff4d4d] mt-2"></div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-200 text-sm rounded">
              {error}
            </div>
          )}

          <form className="space-y-5 md:space-y-6" onSubmit={handleRegister}>
            <div className="space-y-2 md:space-y-3">
              <label className="font-['Space_Grotesk'] uppercase tracking-[0.15em] text-xs text-white block font-bold" htmlFor="username">Nombre de usuario</label>
              <input 
                className="w-full bg-zinc-900/60 border border-zinc-800 text-white px-4 py-3.5 sm:py-4 focus:ring-0 transition-all border-b-2 border-b-[#ff4d4d]/60 focus:border-b-[#ff4d4d] placeholder-zinc-400 text-sm" 
                id="username" 
                placeholder="GamerID_2024" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-['Space_Grotesk'] uppercase tracking-[0.15em] text-xs block text-white" htmlFor="email">Correo electrónico</label>
              <input 
                className="w-full bg-zinc-900/60 border border-zinc-800 text-white px-4 py-3.5 sm:py-4 focus:ring-0 transition-all border-b-2 border-b-transparent focus:border-b-[#ff4d4d] placeholder-zinc-400 text-sm" 
                id="email" 
                placeholder="user@compugames.tech" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-5 md:space-y-6">
              <div className="space-y-2">
                <label className="font-['Space_Grotesk'] uppercase tracking-[0.15em] text-xs block text-white" htmlFor="password">Contraseña</label>
                <div className="relative">
                  <input 
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white px-4 py-3.5 sm:py-4 pr-12 focus:ring-0 transition-all border-b-2 border-b-transparent focus:border-b-[#ff4d4d] placeholder-zinc-400 text-sm" 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-['Space_Grotesk'] uppercase tracking-[0.15em] text-xs block text-white" htmlFor="confirm_password">Confirmar contraseña</label>
                <div className="relative">
                  <input 
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white px-4 py-3.5 sm:py-4 pr-12 focus:ring-0 transition-all border-b-2 border-b-transparent focus:border-b-[#ff4d4d] placeholder-zinc-400 text-sm" 
                    id="confirm_password" 
                    placeholder="••••••••" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <input 
                className="w-5 h-5 mt-0.5 rounded-none bg-[#262626] border-none text-[#ff4d4d] focus:ring-0 focus:ring-offset-0 flex-shrink-0" 
                id="terms" 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required 
              />
              <label className="text-[11px] sm:text-xs font-['Inter'] leading-tight cursor-pointer text-white" htmlFor="terms">
                Acepto los términos de servicio y la política de privacidad.
              </label>
            </div>

            <button 
              className="w-full bg-gradient-to-r from-[#ff4d4d] to-[#ff7670] text-[#65000a] font-['Space_Grotesk'] uppercase tracking-[0.2em] font-bold py-4 sm:py-5 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,77,77,0.4)] text-sm sm:text-base mt-2 hover:scale-[1.02] disabled:opacity-50" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Crear cuenta'}
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-500 text-xs uppercase tracking-widest">O</span>
              <div className="flex-grow border-t border-zinc-800"></div>
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
              Continuar con Google
            </button>
          </form>

          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-zinc-800 flex flex-col items-center space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-[#adaaaa] font-['Inter'] text-center">
              ¿Ya eres parte de la élite?
            </p>
            <Link to="/login" className="font-['Space_Grotesk'] uppercase tracking-[0.15em] text-xs sm:text-sm text-[#ff4d4d] hover:text-white transition-colors duration-300 font-bold border-b border-transparent hover:border-[#ff4d4d] pb-1">
              Ya tengo una cuenta
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 bg-black/60 backdrop-blur-md opacity-80">
        <div></div>
        <div className="text-xs md:text-sm font-['Space_Grotesk'] uppercase tracking-[0.3em] text-[#ff8d87] text-center font-bold drop-shadow-md">
          © 2026 COMPUGAMES
        </div>
      </footer>
    </div>
  );
}
