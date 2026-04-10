import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { updatePassword, updateEmail, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';

export default function Settings() {
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleUpdatePassword = async () => {
    if (!user || !newPassword) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await updatePassword(user, newPassword);
      setMessage('Contraseña actualizada correctamente.');
      setNewPassword('');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Por seguridad, debes volver a iniciar sesión para cambiar tu contraseña.');
      } else {
        setError(err.message || 'Error al actualizar contraseña.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user || !newEmail) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await updateEmail(user, newEmail);
      // Update email in Firestore
      await setDoc(doc(db, 'users', user.uid), { email: newEmail }, { merge: true });
      setMessage('Email actualizado correctamente.');
      setNewEmail('');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Por seguridad, debes volver a iniciar sesión para cambiar tu correo.');
      } else {
        setError(err.message || 'Error al actualizar email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    if (!user) return;
    setShowDeleteConfirm(false);
    
    setError('');
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Por seguridad, debes volver a iniciar sesión para eliminar tu cuenta.');
      } else {
        setError(err.message || 'Error al eliminar cuenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#0e0e0e] text-white font-['Inter'] selection:bg-[#ff8d87] selection:text-[#65000a] antialiased min-h-screen">
      <nav className="fixed top-0 w-full z-50 border-none bg-[#0e0e0e]/80 backdrop-blur-xl shadow-[0_0_40px_rgba(255,77,77,0.05)]">
        <div className="px-4 md:px-8 py-4 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl md:text-2xl font-black italic tracking-tighter text-[#ff4d4d]">COMPUGAMES</Link>
          </div>
          <div className="hidden sm:flex justify-center items-center">
            <span className="material-symbols-outlined text-[#ff4d4d] text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="active:scale-95 transition-transform text-[#ff4d4d]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            </button>
            <button className="active:scale-95 transition-transform text-[#ff4d4d] border-b-2 border-[#ff4d4d] pb-1">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Cinematic background" className="w-full h-full object-cover opacity-20 grayscale brightness-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbjNfHgsXKNuQYRjcYndyeGzvu3SC3sR6gdcR7nNFW_qXEfY8D2vizoCYbjsb7qp-wp7L5MtNLVgj5MztMnXCQFygCYqydprWMKyIKVnnTdysQeqkici3Ci2QnjthwpS_XfZA1z-cQM4OhXjSRtAdP4X-vbbijr0uxClcUfqKKZl4j_FhKdjAeUO4UaHzPKxWHB2myOKV6eXuhC3poqa4qjCgn0FFvI7Bp-akol5tipFGy3mPv3rdK8SO4K01IKe-5FS1aX2MEcVs"/>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e] via-transparent to-[#0e0e0e]"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl px-4 sm:px-6">
          <div className="mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-['Space_Grotesk'] font-black italic uppercase tracking-tighter text-white mb-2">
              <span className="text-[#ff8d87]">SETTINGS</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 md:w-12 bg-[#ff8d87]"></div>
              <p className="font-['Space_Grotesk'] uppercase tracking-[0.3em] text-[10px] text-[#adaaaa] font-bold">SYSTEM CONFIGURATION</p>
            </div>
          </div>

          <div className="bg-[#131313]/40 backdrop-blur-2xl border-l-2 md:border-l border-[#ff8d87]/20 p-6 sm:p-8 md:p-12 space-y-12 md:space-y-16 shadow-[20px_0_60px_rgba(0,0,0,0.5)]">
            
            {error && <div className="p-4 bg-red-500/20 border border-red-500 text-red-200 text-sm">{error}</div>}
            {message && <div className="p-4 bg-green-500/20 border border-green-500 text-green-200 text-sm">{message}</div>}

            <section className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ff8d87] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
                <h2 className="font-['Space_Grotesk'] font-bold uppercase tracking-[0.2em] text-xs md:text-sm text-white">EDIT PASSWORD</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="group">
                  <label className="block font-['Space_Grotesk'] text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#adaaaa] mb-2 group-focus-within:text-[#ff8d87] transition-colors">NEW PASSWORD</label>
                  <input 
                    className="w-full bg-[#201f1f] border-none text-white px-4 py-3 md:py-4 focus:ring-0 focus:outline-none placeholder:text-white/10 font-mono border-b-2 border-transparent focus:border-[#ff8d87] transition-all text-sm" 
                    placeholder="MIN 8 CHARACTERS" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdatePassword}
                disabled={loading || !newPassword}
                className="w-full sm:w-auto bg-[#ff8d87] text-[#65000a] font-['Space_Grotesk'] font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs px-8 py-3 md:py-4 active:scale-95 transition-transform hover:bg-[#ff5a57] disabled:opacity-50"
              >
                UPDATE CREDENTIALS
              </button>
            </section>

            <section className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ff8d87] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>alternate_email</span>
                <h2 className="font-['Space_Grotesk'] font-bold uppercase tracking-[0.2em] text-xs md:text-sm text-white">EDIT EMAIL</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div>
                  <label className="block font-['Space_Grotesk'] text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#adaaaa] mb-2">CURRENT EMAIL</label>
                  <div className="w-full bg-[#000000]/50 text-white/40 px-4 py-3 md:py-4 font-mono text-xs md:text-sm cursor-not-allowed">{user.email}</div>
                </div>
                <div className="group">
                  <label className="block font-['Space_Grotesk'] text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#adaaaa] mb-2 group-focus-within:text-[#ff8d87] transition-colors">NEW EMAIL</label>
                  <input 
                    className="w-full bg-[#201f1f] border-none text-white px-4 py-3 md:py-4 focus:ring-0 focus:outline-none placeholder:text-white/10 font-mono border-b-2 border-transparent focus:border-[#ff8d87] transition-all text-sm" 
                    placeholder="ENTERING NEW SECTOR..." 
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
              </div>
              <button 
                onClick={handleUpdateEmail}
                disabled={loading || !newEmail}
                className="w-full sm:w-auto bg-[#ff8d87] text-[#65000a] font-['Space_Grotesk'] font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs px-8 py-3 md:py-4 active:scale-95 transition-transform hover:bg-[#ff5a57] disabled:opacity-50"
              >
                SYNC NEW ADDRESS
              </button>
            </section>

            <section className="pt-8 border-t border-white/5 space-y-6">
              <div className="flex items-center gap-3 text-[#ff7351]">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                <h2 className="font-['Space_Grotesk'] font-bold uppercase tracking-[0.2em] text-xs md:text-sm">DANGER ZONE</h2>
              </div>
              <div className="p-4 md:p-6 bg-[#b92902]/10 border border-[#ff7351]/30">
                <p className="font-['Inter'] text-[11px] md:text-xs text-[#ffd2c8]/80 leading-relaxed mb-6">
                  WARNING: DELETING YOUR ACCOUNT IS IRREVERSIBLE. ALL PROGRESS, ASSETS, AND ARCHIVE CLEARANCE WILL BE PERMANENTLY WIPED FROM THE COMPUGAMES SERVERS.
                </p>
                <button 
                  onClick={handleDeleteAccountClick}
                  disabled={loading}
                  className="w-full sm:w-auto border border-[#ff7351] text-[#ff7351] font-['Space_Grotesk'] font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] px-8 py-3 md:py-4 hover:bg-[#ff7351] hover:text-[#450900] transition-all active:scale-95 disabled:opacity-50"
                >
                  DELETE ACCOUNT
                </button>
              </div>
            </section>
          </div>

          <div className="mt-8 flex justify-between items-center px-2 md:px-4">
            <div className="flex gap-1 md:gap-2">
              <div className="w-1 h-1 bg-[#ff8d87]"></div>
              <div className="w-1 h-1 bg-white/20"></div>
              <div className="w-1 h-1 bg-white/20"></div>
            </div>
            <div className="text-[7px] md:text-[8px] font-mono text-white/20 uppercase tracking-[0.2em] md:tracking-[0.4em] text-right">
              SECURE CONNECTION // AES-256 ENCRYPTED
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-none bg-[#000000]">
        <div className="bg-gradient-to-t from-[#131313] to-transparent h-20 md:h-32"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-8 gap-6 md:gap-4 w-full">
          <div className="flex flex-col items-center md:items-start order-2 md:order-1">
            <span className="text-[#ff4d4d] font-bold font-['Space_Grotesk'] uppercase tracking-[0.15em] text-[9px] md:text-[10px]">COMPUGAMES</span>
            <span className="font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-white/40">© 2026 COMPUGAMES.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 order-1 md:order-2">
            <a className="font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-white/40 hover:text-[#ff4d4d] transition-opacity cursor-crosshair" href="#">TERMINAL</a>
            <a className="font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-white/40 hover:text-[#ff4d4d] transition-opacity cursor-crosshair" href="#">PRIVACY</a>
            <a className="font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-white/40 hover:text-[#ff4d4d] transition-opacity cursor-crosshair" href="#">ENCRYPT</a>
            <a className="font-['Space_Grotesk'] text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-white/40 hover:text-[#ff4d4d] transition-opacity cursor-crosshair" href="#">BYPASS</a>
          </div>
        </div>
      </footer>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-[#ff7351]/50 p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(255,115,81,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff7351] to-transparent opacity-50"></div>
            <div className="flex items-center gap-3 text-[#ff7351] mb-4">
              <span className="material-symbols-outlined text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <h3 className="font-['Space_Grotesk'] font-bold uppercase tracking-[0.15em] text-sm md:text-base">CONFIRMAR ELIMINACIÓN</h3>
            </div>
            <p className="font-['Inter'] text-xs md:text-sm text-[#ffd2c8]/80 mb-8 leading-relaxed">
              ¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer y perderás todo tu progreso permanentemente.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2.5 border border-white/20 text-white font-['Space_Grotesk'] text-[10px] md:text-xs tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                NO
              </button>
              <button 
                onClick={confirmDeleteAccount}
                className="px-6 py-2.5 bg-[#ff7351] text-[#450900] font-['Space_Grotesk'] font-bold text-[10px] md:text-xs tracking-widest uppercase hover:bg-[#ff5a57] transition-colors"
              >
                SÍ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
