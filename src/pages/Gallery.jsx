import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ArtworkCard from '../components/ArtworkCard';
import { useGallery } from '../contexts/GalleryContext';

function Gallery() {
  const { artworks, loading, error, settings } = useGallery();
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-600">Carregando galeria...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar a galeria: {error}</p>
      </div>
    );
  }

  const filteredArtworks = selectedCategory === 'all'
    ? artworks
    : artworks.filter(artwork => artwork.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>
          {settings?.title || 'Galeria da Nathália'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {settings?.description || 'Artes feitas por mim'}
        </p>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        {settings?.categories?.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'text-white'
                : 'text-gray-700 hover:text-white'
            }`}
            style={{
              backgroundColor: selectedCategory === category.id ? theme.primary : 'transparent',
              border: `1px solid ${theme.primary}`,
              '&:hover': {
                backgroundColor: theme.primary
              }
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.map(artwork => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>

      {filteredArtworks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhuma arte encontrada nesta categoria.</p>
        </div>
      )}
    </div>
  );
}

export default Gallery; 