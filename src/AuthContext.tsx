import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null | { uid: string, email: string };
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  mockSignIn: (email: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  mockSignIn: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Mock mode
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    } else {
      localStorage.removeItem('mockUser');
      setUser(null);
    }
  };

  const signInWithGoogle = async () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } else {
      const mockUser = { uid: 'mock-123', email: 'test@example.com' };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  };

  const mockSignIn = (email: string) => {
    if (!auth) {
      const mockUser = { uid: 'mock-' + Date.now(), email };
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signInWithGoogle, mockSignIn }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
