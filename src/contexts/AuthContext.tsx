import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Timeout para evitar que la aplicación se quede en pantalla blanca si Firebase tarda
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearTimeout(fallbackTimer);
      setUser(currentUser);
      
      // Permitir que la UI cargue sin importar si Firestore sigue procesando
      setLoading(false);
      
      if (currentUser) {
        try {
          // Create or update user profile in Firestore
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const userData: any = {
              uid: currentUser.uid,
              email: currentUser.email,
              createdAt: serverTimestamp()
            };
            
            if (currentUser.displayName) {
              userData.displayName = currentUser.displayName;
            }
            
            if (currentUser.photoURL) {
              userData.photoURL = currentUser.photoURL;
            }
            
            await setDoc(userRef, userData);
          }
        } catch (error) {
          console.error("Error creating user profile:", error);
        }
      }
    });

    return () => {
      clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading ? children : (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
          <svg viewBox="0 0 100 100" fill="white" style={{ height: '60px', width: '60px', animation: 'pulse 1.5s infinite' }}>
            <path d="M50 5 L60 25 L85 25 L65 40 L75 65 L50 50 L25 65 L35 40 L15 25 L40 25 Z" />
          </svg>
        </div>
      )}
    </AuthContext.Provider>
  );
};
