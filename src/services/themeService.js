import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const THEME_DOC_ID = 'main';
const COLLECTION_NAME = 'theme';

export const themeService = {
  async getTheme() {
    const docRef = doc(db, COLLECTION_NAME, THEME_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Retorna cores padrão se não existir configuração
      return {
        primary: '#FFFFFF',
        secondary: '#4F46E5',
        accent: '#EC4899',
        background: '#F9FAFB',
        text: '#111827',
        header: '#FFFFFF', // Nova cor para o header
      };
    }
    
    return docSnap.data();
  },

  async updateTheme(themeColors) {
    const docRef = doc(db, COLLECTION_NAME, THEME_DOC_ID);
    await setDoc(docRef, themeColors);
  }
}; 