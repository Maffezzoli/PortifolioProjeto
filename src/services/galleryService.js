import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const GALLERY_CONFIG_ID = 'main';
const COLLECTION_NAME = 'gallery_config';

export const galleryService = {
  async getConfig() {
    const docRef = doc(db, COLLECTION_NAME, GALLERY_CONFIG_ID);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Configuração padrão
      return {
        title: 'Galeria de Arte',
        description: 'Explore minha coleção de obras de arte',
        categories: [
          { id: 'digital', name: 'Arte Digital' },
          { id: 'traditional', name: 'Arte Tradicional' },
          { id: 'illustration', name: 'Ilustração' },
        ]
      };
    }
    
    return docSnap.data();
  },

  async updateConfig(config) {
    const docRef = doc(db, COLLECTION_NAME, GALLERY_CONFIG_ID);
    await setDoc(docRef, config);
  }
}; 