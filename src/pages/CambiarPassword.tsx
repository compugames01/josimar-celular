import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase';

export default function CambiarPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get('oobCode');

  useEffect(() => {
    if (oobCode) {
      verifyPasswordResetCode(auth, oobCode)
        .then((userEmail) => {
          setEmail(userEmail);
          setValidCode(true);
        })
        .catch((err) => {
          setError('El enlace es inválido o ha expirado. Por favor, solicita uno nuevo.');
        });
    } else {
      setError('No se proporcionó un código de recuperación.');
    }
  }, [oobCode]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;

    setError('');
    setMessage('');
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Tu contraseña ha sido actualizada exitosamente. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Space_Grotesk'] text-white overflow-x-hidden bg-[#0a0a0a]" style={{
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255, 77, 77, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(255, 77, 77, 0.05) 0%, transparent 40%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Site Header */}
      <header className="w-full h-16 md:h-20 flex justify-between px-4 sm:px-6 md:px-8 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md z-50 sticky top-0 items-end pb-4">
        <div className="flex-1 flex items-end">
          <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold italic tracking-tighter text-[#ff4d4d] whitespace-nowrap uppercase">COMPUGAMES</span>
        </div>
        
        {/* Centered Star Logo */}
        <div className="flex justify-center px-2 shrink-0 items-end mb-[-4px]">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" fill="none" height="40" viewBox="0 0 24 24" width="40" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" fill="#ff4d4d"></path>
          </svg>
        </div>
        
        <div className="flex-1 flex justify-end items-end">
          <Link to="/" className="text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.15em] sm:tracking-[0.2em] hover:text-[#ff4d4d] transition-colors duration-300">INICIO</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-10 relative">
        {/* Atmospheric Background Layers */}
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{
          backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAOmtF-mJ-3Y2bF3VJg6b64MWz_Kmiun7EnOlW70KrKUJDGxwsCirNX5Z_3UWfyjIuy-ozOah04rKDB7uSS3TZMfcoLWBe14ZT7mTQdXXstSGA-RnSC_2zf04L3RmUIlSS1PNlKly38ePAEgULbLJeLUchoWW_-10Gx-nuV1hO4GiVLv5Cubn3m92Yv6QplTAnmmjtURMyI1V178bolJL_Ab4SkaqzkbzA28sza0kwH0F6E12sUiaNpfQe8rc3igpcyawMZwZeL9mM)'
        }}></div>

        {/* Reset Password Card */}
        <section className="w-full max-w-[440px] bg-[#121212]/90 p-6 sm:p-10 md:p-12 rounded-sm relative z-10 mx-auto" style={{
          boxShadow: '0 0 20px rgba(255, 77, 77, 0.1)',
          border: '1px solid rgba(255, 77, 77, 0.2)'
        }}>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 tracking-tight">Reset your password</h1>
          <p className="text-gray-400 mb-8 sm:mb-10 text-xs sm:text-sm leading-relaxed">
            for <span className="text-white font-medium break-all">{validCode ? email : '...'}</span>
          </p>

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

          {validCode ? (
            <form className="space-y-8 sm:space-y-10" onSubmit={handleConfirm}>
              {/* Password Input Group */}
              <div className="relative group">
                <label className="block mb-1 group-focus-within:text-[#ff4d4d] transition-colors text-xs sm:text-sm uppercase tracking-wider text-[#9ca3af]" htmlFor="new-password">New password</label>
                <div className="relative">
                  <input 
                    className="w-full pr-10 text-base sm:text-lg bg-transparent border-0 border-b-2 border-[#ff4d4d]/30 text-white py-3 focus:ring-0 focus:border-[#ff4d4d] transition-colors rounded-none" 
                    id="new-password" 
                    name="new-password" 
                    required 
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {/* Password Visibility Toggle Icon */}
                  <button 
                    aria-label="Toggle password visibility" 
                    className={`absolute right-0 top-1/2 -translate-y-1/2 transition-colors ${showPassword ? 'text-[#ff4d4d]' : 'text-gray-400 hover:text-[#ff4d4d]'}`}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2 sm:pt-4">
                <button 
                  className="w-full sm:w-auto bg-[#ff4d4d] hover:bg-red-600 text-white font-bold py-3 px-8 sm:px-12 transition-all duration-300 uppercase tracking-[0.2em] text-xs sm:text-sm shadow-lg shadow-[#ff4d4d]/20 active:scale-95 disabled:opacity-50" 
                  type="submit"
                  disabled={loading || !newPassword}
                >
                  {loading ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-end pt-2 sm:pt-4">
              <Link to="/recuperar-password"
                className="w-full sm:w-auto bg-[#1a1a1a] hover:bg-[#ff4d4d] text-white font-bold py-3 px-8 sm:px-12 transition-all duration-300 uppercase tracking-[0.2em] text-xs sm:text-sm border border-[#ff4d4d]/30 hover:border-[#ff4d4d] active:scale-95 text-center" 
              >
                REQUEST NEW LINK
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Site Footer */}
      <footer className="w-full py-4 px-4 sm:px-6 md:px-8 border-t border-white/5 bg-[#0a0a0a]/50 mt-auto">
        <div className="max-w-7xl mx-auto flex justify-start items-center">
          <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 tracking-[0.3em] uppercase">© 2026 COMPUGAMES</p>
        </div>
      </footer>
    </div>
  );
}
