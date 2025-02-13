import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { userService } from '../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Garante que o usuário existe no Firestore
          await userService.ensureUserExists(user.uid, user.email);
          const role = await userService.getUserRole(user.uid);
          setUserRole(role);
          setUser(user);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          setUser(null);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await userService.ensureUserExists(userCredential.user.uid, email);
    const role = await userService.getUserRole(userCredential.user.uid);
    setUserRole(role);
    return userCredential;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
  };

  const value = {
    user,
    loading,
    userRole,
    isAdmin: userRole === 'admin',
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 