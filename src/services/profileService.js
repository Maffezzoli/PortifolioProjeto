import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { uploadImage } from './imageService';

export const profileService = {
  async getProfile() {
    try {
      const docRef = doc(db, 'profile', 'main');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  },

  async updateProfile(data, imageFile = null) {
    try {
      let profileData = { ...data };
      
      if (imageFile) {
        const imageUrl = await uploadImage(imageFile);
        profileData.photoUrl = imageUrl;
      }

      await setDoc(doc(db, 'profile', 'main'), {
        ...profileData,
        updatedAt: new Date()
      });

      return profileData;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
}; 