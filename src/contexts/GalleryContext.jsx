import { createContext, useContext, useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';

const GalleryContext = createContext();

export function GalleryProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carrega as configurações
      const gallerySettings = await galleryService.getSettings();
      setSettings(gallerySettings);
      
      // Carrega as artworks
      const artworksData = await galleryService.getArtworks();
      setArtworks(artworksData);
    } catch (error) {
      console.error('Erro ao carregar dados da galeria:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados iniciais
  useEffect(() => {
    loadGalleryData();
  }, []);

  // Função para atualizar as configurações
  const updateSettings = async (newSettings) => {
    try {
      await galleryService.updateSettings(newSettings);
      setSettings(newSettings); // Atualiza o estado local imediatamente
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  };

  // Função para atualizar as artworks
  const updateArtworks = async () => {
    try {
      const artworksData = await galleryService.getArtworks();
      setArtworks(artworksData);
    } catch (error) {
      console.error('Erro ao atualizar artworks:', error);
      throw error;
    }
  };

  const value = {
    settings,
    artworks,
    loading,
    error,
    updateSettings,
    updateArtworks,
    reloadGallery: loadGalleryData
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
}

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery deve ser usado dentro de um GalleryProvider');
  }
  return context;
};

export default GalleryProvider; 