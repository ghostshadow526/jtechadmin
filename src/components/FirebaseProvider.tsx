import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db, loginWithEmailPassword, logout as firebaseLogout } from '@/src/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import LoginPage from './LoginPage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPortalAuthenticated: boolean;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isPortalAuthenticated: false, handleLogout: () => {} });

export const useAuth = () => useContext(AuthContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPortalAuthenticated, setIsPortalAuthenticated] = useState(() => {
    return sessionStorage.getItem('portalAuthenticated') === 'true';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Set portal auth when Firebase user exists
      if (user) {
        setIsPortalAuthenticated(true);
        sessionStorage.setItem('portalAuthenticated', 'true');
        
        // Create user document in Firestore if it doesn't exist
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            balance: 0,
            role: 'user',
            createdAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error('Error creating user document:', error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePortalLogin = async (email: string, password: string) => {
    try {
      // Sign in to Firebase
      await loginWithEmailPassword(email, password);
      // Portal authentication will be set by the onAuthStateChanged listener
      sessionStorage.setItem('portalAuthenticated', 'true');
    } catch (error) {
      console.error('Firebase login failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      setIsPortalAuthenticated(false);
      sessionStorage.removeItem('portalAuthenticated');
      await firebaseLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isPortalAuthenticated) {
    return <LoginPage onLogin={handlePortalLogin} />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, isPortalAuthenticated, handleLogout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
