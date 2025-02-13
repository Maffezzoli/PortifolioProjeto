import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const GALLERY_CONFIG_ID = 'main';
const COLLECTION_NAME = 'gallery_config';

export const galleryService = {
  async getConfig() {
    try {
      const docRef = doc(db, COLLECTION_NAME, GALLERY_CONFIG_ID);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const defaultConfig = {
          title: 'Galeria de Arte',
          description: 'Explore minha coleção de obras de arte',
          categories: [
            { id: 'digital', name: 'Arte Digital' },
            { id: 'traditional', name: 'Arte Tradicional' },
            { id: 'illustration', name: 'Ilustração' },
          ]
        };

        // Salva a configuração padrão
        await this.updateConfig(defaultConfig);
        return defaultConfig;
      }
      
      const data = docSnap.data();
      console.log('Configurações carregadas do Firestore:', data);
      
      // Garante que temos todas as propriedades necessárias
      return {
        title: data.title || 'Galeria de Arte',
        description: data.description || 'Explore minha coleção de obras de arte',
        categories: Array.isArray(data.categories) ? data.categories : []
      };
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      throw error;
    }
  },

  async updateConfig(config) {
    try {
      // Validação dos dados antes de salvar
      if (!config || typeof config !== 'object') {
        throw new Error('Configuração inválida');
      }

      const docRef = doc(db, COLLECTION_NAME, GALLERY_CONFIG_ID);
      await setDoc(docRef, {
        title: config.title || '',
        description: config.description || '',
        categories: Array.isArray(config.categories) ? config.categories : [],
        updatedAt: new Date().toISOString()
      });

      console.log('Configurações atualizadas com sucesso:', config);
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  }
}; 