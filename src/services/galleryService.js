import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const GALLERY_CONFIG_ID = 'settings';
const COLLECTION_NAME = 'gallery_config';

export const galleryService = {
  async getSettings() {
    try {
      const docRef = doc(db, COLLECTION_NAME, GALLERY_CONFIG_ID);
      const docSnap = await getDoc(docRef);
      
      const defaultSettings = {
        title: 'Minha Galeria de Arte',
        description: 'Bem-vindo à minha galeria de arte digital',
        categories: [
          { id: 'all', name: 'Todas' },
          { id: 'digital', name: 'Arte Digital' },
          { id: 'illustration', name: 'Ilustração' }
        ],
        layout: 'grid', // grid ou masonry
        itemsPerPage: 12
      };

      if (!docSnap.exists()) {
        await this.updateSettings(defaultSettings);
        return defaultSettings;
      }

      return { ...defaultSettings, ...docSnap.data() };
    } catch (error) {
      console.error('Erro ao carregar configurações da galeria:', error);
      throw error;
    }
  },

  async updateSettings(settings) {
    try {
      const docRef = doc(db, COLLECTION_NAME, GALLERY_CONFIG_ID);
      await setDoc(docRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações da galeria:', error);
      throw error;
    }
  },

  async getArtworks() {
    try {
      const artworksRef = collection(db, 'artworks');
      const snapshot = await getDocs(artworksRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao carregar obras de arte:', error);
      throw error;
    }
  }
}; 