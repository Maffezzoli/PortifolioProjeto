import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const userService = {
  async setUserAsAdmin(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        role: 'admin',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Erro ao definir usuário como admin:', error);
      throw error;
    }
  },

  async getUserRole(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      // Se o usuário não existir ou não tiver role, define como admin (apenas para desenvolvimento)
      if (!userSnap.exists() || !userSnap.data().role) {
        await this.setUserAsAdmin(userId);
        return 'admin';
      }
      
      return userSnap.data().role;
    } catch (error) {
      console.error('Erro ao obter role do usuário:', error);
      throw error;
    }
  },

  async ensureUserExists(userId, email) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email,
          role: 'admin', // Define como admin por padrão (apenas para desenvolvimento)
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erro ao verificar/criar usuário:', error);
      throw error;
    }
  }
}; 