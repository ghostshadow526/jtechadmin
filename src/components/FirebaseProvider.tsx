import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/src/lib/firebase';
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
  const [isPortalAuthenticated, setIsPortalAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // Create user document in Firestore if it doesn't exist
      if (user) {
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

  const handlePortalLogin = (email: string) => {
    setIsPortalAuthenticated(true);
  };

  const handleLogout = () => {
    setIsPortalAuthenticated(false);
    setUser(null);
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
