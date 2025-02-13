import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { galleryService } from '../services/galleryService';

const GalleryContext = createContext();

export function GalleryProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGalleryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Carrega dados em paralelo
      const [settingsData, artworksData] = await Promise.all([
        galleryService.getSettings(),
        galleryService.getArtworks()
      ]);

      setSettings(settingsData);
      setArtworks(artworksData);
    } catch (error) {
      console.error('Erro ao carregar dados da galeria:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGalleryData();
  }, [loadGalleryData]);

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

  const value = {
    settings,
    artworks,
    loading,
    error,
    updateSettings,
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