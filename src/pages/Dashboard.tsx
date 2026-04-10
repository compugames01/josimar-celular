import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [characterName, setCharacterName] = useState('');
  const [characterClass, setCharacterClass] = useState('Warrior');
  const [generating, setGenerating] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [error, setError] = useState('');
  
  // Profile states
  const [activeTab, setActiveTab] = useState<'forge' | 'profile'>('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const isEmailUser = user?.providerData.some(p => p.providerId === 'password');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const q = query(
      collection(db, 'stories'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const storiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStories(storiesData);
    }, (err) => {
      console.error("Error fetching stories:", err);
    });

    return unsubscribe;
  }, [user, navigate]);

  const handleSignOut = () => {
    auth.signOut();
    navigate('/');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    if (!user || !user.email) return;
    
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setProfileMsg('Contraseña actualizada exitosamente.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setProfileError('La contraseña actual es incorrecta.');
      } else if (err.code === 'auth/weak-password') {
        setProfileError('La nueva contraseña es muy débil.');
      } else {
        setProfileError(err.message || 'Error al actualizar la contraseña.');
      }
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    try {
      if (isEmailUser && user?.email) {
        const credential = EmailAuthProvider.credential(user.email, deletePassword);
        await reauthenticateWithCredential(user, credential);
      }
      
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid));
        await deleteUser(user);
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setProfileError('Contraseña incorrecta.');
      } else {
        setProfileError(err.message || 'Error al eliminar la cuenta.');
      }
    }
  };

  const generateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName.trim() || !user) return;

    setGenerating(true);
    setError('');

    try {
      const prompt = `Write a short, epic backstory (about 3 paragraphs) for a video game character named ${characterName} who is a ${characterClass}. Make it sound like a dark fantasy RPG lore entry.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      const storyText = response.text;

      await addDoc(collection(db, 'stories'), {
        userId: user.uid,
        characterName,
        story: storyText,
        createdAt: serverTimestamp()
      });

      setCharacterName('');
    } catch (err) {
      console.error("Error generating story:", err);
      setError('Failed to generate story. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8e8e8] text-black font-sans relative overflow-x-hidden flex flex-col">
      {/* Background Texture & Code */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.05) 2px)', backgroundSize: '4px 100%' }}></div>
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.15] overflow-hidden">
        <pre className="text-[10px] sm:text-xs md:text-sm leading-tight text-black font-mono whitespace-pre-wrap max-w-4xl select-none">
{`muinir-aetretilinit-ip
namps "tes.120000@hotmail.com"
require tyleshed (
        aramittvnesseCostry"
)
fouore Class$$stopond {
// Recall D L
de encured {
  if (on coat
    int doetli
    for ratat
      sletilte
    log.otedet
    ctlCure00db2010;7/.
    focus vacu
    egharnod()
}
csbon:fahr(EC)
cldsh:tooneb
noattt: Toost
nofostt:(trun
return:chers
}
fune functic() {
  if (purconcent
    sarve sardor
    satentk(
    consent:
  }
  else
  defaul riquet: Aa1B0SSSN4();
  nlaunder model = Folde;
  return customization;
}`}
        </pre>
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-center p-4 sm:p-6 md:p-10 w-full gap-4 md:gap-6">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-16">
          <button onClick={() => setActiveTab('profile')} className={`text-xs sm:text-sm md:text-base tracking-widest uppercase transition-colors ${activeTab === 'profile' ? 'font-bold' : 'font-normal hover:text-gray-600'}`}>MI PANEL</button>
          <button onClick={() => setActiveTab('forge')} className={`text-xs sm:text-sm md:text-base tracking-widest uppercase transition-colors ${activeTab === 'forge' ? 'font-bold' : 'font-normal hover:text-gray-600'}`}>FORJA</button>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-16 items-center mt-2 md:mt-0">
          <button onClick={handleSignOut} className="text-xs sm:text-sm md:text-base tracking-widest uppercase hover:text-gray-600 transition-colors">CERRAR SESIÓN</button>
          <div className="text-lg sm:text-xl md:text-2xl font-bold italic tracking-tighter flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6"><path d="M2 22L12 2L22 22H17L12 12L7 22H2Z"/></svg>
            Avata.
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        {activeTab === 'profile' ? (
          <div className="flex flex-col items-center w-full max-w-lg px-2 sm:px-0">
            
            {/* Logo & Email */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="flex flex-col items-center leading-none">
                <span className="text-4xl sm:text-5xl font-black tracking-tighter">CG</span>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-1">COMPUGAMES</span>
              </div>
              <div className="text-sm sm:text-base font-medium mt-3 break-all">{user?.email}</div>
            </div>

            {/* Password Form */}
            {isEmailUser && (
              <form onSubmit={handleUpdatePassword} className="w-full max-w-sm flex flex-col gap-3 mb-4">
                {profileMsg && <div className="text-green-600 text-center text-xs font-medium">{profileMsg}</div>}
                {profileError && <div className="text-red-600 text-center text-xs font-medium">{profileError}</div>}
                
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-black mb-1 ml-2">CURRENT PASSWORD</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#e8e8e8] border-2 border-gray-400 rounded-full px-4 py-1.5 sm:py-2 text-sm text-black focus:border-gray-600 outline-none shadow-inner"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-black mb-1 ml-2">NEW PASSWORD</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#e8e8e8] border-2 border-gray-400 rounded-full px-4 py-1.5 sm:py-2 text-sm text-black focus:border-gray-600 outline-none shadow-inner"
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" className="hidden">Submit</button>
              </form>
            )}

            {/* Danger Zone */}
            <div className="w-full max-w-md relative mt-24 sm:mt-32 md:mt-40 mb-12">
              <div className="absolute inset-0 bg-red-500 opacity-40 blur-xl rounded-xl"></div>
              <div className="relative bg-gradient-to-b from-[#ffb3b3]/95 to-[#ff8080]/95 border-2 border-red-400 rounded-xl p-4 sm:p-5 text-center shadow-[0_0_20px_rgba(255,0,0,0.5)] backdrop-blur-sm">
                <h3 className="text-lg sm:text-xl font-normal tracking-widest text-black mb-1">ZONA DE PELIGRO</h3>
                <div className="flex items-center justify-center gap-1 text-black font-bold mb-2 text-xs sm:text-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  WARNING
                </div>
                <p className="text-[8px] sm:text-[9px] uppercase tracking-wider text-black/80 leading-relaxed mb-4">
                  Safety and dangers warning. Proceeding will permanently delete your account and all associated data. This action cannot be undone.
                </p>
                
                {!showDeleteConfirm ? (
                  <div className="flex justify-center gap-2 sm:gap-4">
                    <button 
                      type="button"
                      className="flex-1 bg-gradient-to-b from-[#ffb3b3] to-[#ff8080] border border-red-300 py-2 rounded-full text-black text-xs sm:text-sm font-normal tracking-widest hover:from-[#ff9999] hover:to-[#ff6666] transition-all shadow-md"
                    >
                      CANCEL
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex-1 bg-gradient-to-b from-[#ff8080] to-[#ff4d4d] border border-red-400 py-2 rounded-full text-black text-xs sm:text-sm font-normal tracking-widest hover:from-[#ff6666] hover:to-[#ff3333] transition-all shadow-md"
                    >
                      CONFIRM
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleDeleteAccount} className="flex flex-col gap-3">
                    {isEmailUser && (
                      <input 
                        type="password" 
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="CONFIRM PASSWORD"
                        className="w-full bg-white/70 border border-red-400 px-4 py-1.5 text-sm text-black text-center rounded-full outline-none focus:border-red-600"
                        required
                      />
                    )}
                    <div className="flex justify-center gap-2 sm:gap-4">
                      <button 
                        type="button" 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 bg-gradient-to-b from-[#ffb3b3] to-[#ff8080] border border-red-300 py-2 rounded-full text-black text-xs sm:text-sm font-normal tracking-widest hover:from-[#ff9999] hover:to-[#ff6666] transition-all shadow-md"
                      >
                        CANCEL
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-b from-[#ff8080] to-[#ff4d4d] border border-red-400 py-2 rounded-full text-black text-xs sm:text-sm font-normal tracking-widest hover:from-[#ff6666] hover:to-[#ff3333] transition-all shadow-md"
                      >
                        CONFIRM
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="w-full max-w-4xl bg-white/50 backdrop-blur-md border border-gray-300 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-widest mb-6 sm:mb-8 text-black flex items-center gap-3">
              <i className="fas fa-magic text-black"></i> AI FORGE
            </h2>
            
            <form onSubmit={generateStory} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-[10px] sm:text-xs text-gray-700 tracking-widest mb-2 font-bold">CHARACTER NAME</label>
                <input 
                  type="text" 
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full bg-[#f0f0f0] border-2 border-gray-300 rounded-xl px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base text-black focus:border-gray-500 outline-none transition-all shadow-inner"
                  required
                />
              </div>
              
              <div>
                <label className="block text-[10px] sm:text-xs text-gray-700 tracking-widest mb-2 font-bold">CLASS</label>
                <select 
                  value={characterClass}
                  onChange={(e) => setCharacterClass(e.target.value)}
                  className="w-full bg-[#f0f0f0] border-2 border-gray-300 rounded-xl px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base text-black focus:border-gray-500 outline-none transition-all appearance-none shadow-inner"
                >
                  <option value="Warrior">Warrior</option>
                  <option value="Mage">Mage</option>
                  <option value="Rogue">Rogue</option>
                  <option value="Necromancer">Necromancer</option>
                  <option value="Paladin">Paladin</option>
                </select>
              </div>

              {error && <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>}

              <button 
                type="submit" 
                disabled={generating}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold tracking-[2px] sm:tracking-[4px] py-3 sm:py-4 rounded-xl flex justify-center items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
              >
                {generating ? (
                  <span className="animate-pulse">FORGING...</span>
                ) : (
                  <>
                    <span>GENERATE LORE</span>
                    <i className="fas fa-bolt"></i>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 sm:mt-12 space-y-4 sm:space-y-6">
              <h2 className="text-lg sm:text-xl font-bold tracking-widest mb-4 sm:mb-6 text-black flex items-center gap-3 border-b border-gray-300 pb-3 sm:pb-4">
                <i className="fas fa-book-journal-whills"></i> ARCHIVES
              </h2>
              
              {stories.length === 0 ? (
                <div className="bg-gray-100 border border-gray-300 p-6 sm:p-8 rounded-xl text-center text-gray-500 tracking-widest text-xs sm:text-sm">
                  NO LORE ENTRIES FOUND. USE THE FORGE TO CREATE ONE.
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {stories.map((story) => (
                    <div key={story.id} className="bg-white border border-gray-300 p-4 sm:p-6 rounded-xl shadow-md">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 border-b border-gray-200 pb-3 sm:pb-4">
                        <h3 className="text-lg sm:text-xl font-black tracking-wider text-black">
                          {story.characterName}
                        </h3>
                        <span className="text-[10px] sm:text-xs text-gray-500 tracking-widest uppercase bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                          {story.createdAt?.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="font-serif text-sm sm:text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
                        {story.story}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
