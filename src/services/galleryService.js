import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const GALLERY_CONFIG_DOC = 'gallery_settings';

export const galleryService = {
  async getSettings() {
    try {
      const docRef = doc(db, 'gallery_config', GALLERY_CONFIG_DOC);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const defaultSettings = {
          title: 'Galeria da Nathália',
          description: 'Artes feitas por mim',
          categories: [
            { id: 'all', name: 'Todas' },
            { id: 'anatomy', name: 'Anatomia' },
            { id: 'scenario', name: 'Cenário' },
            { id: 'character', name: 'Personagens' }
          ],
          layout: 'grid',
          itemsPerPage: 12,
          showFilters: true,
          sortBy: 'newest'
        };
        
        await this.updateSettings(defaultSettings);
        return defaultSettings;
      }

      return docSnap.data();
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      throw error;
    }
  },

  async updateSettings(settings) {
    try {
      const docRef = doc(db, 'gallery_config', GALLERY_CONFIG_DOC);
      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  },

  async getArtworks() {
    try {
      const querySnapshot = await getDocs(collection(db, 'artworks'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao carregar artworks:', error);
      throw error;
    }
  }
}; 