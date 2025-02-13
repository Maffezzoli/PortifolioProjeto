import { useState } from 'react';
import { useGallery } from '../contexts/GalleryContext';
import ArtworkCard from '../components/ArtworkCard';

function Gallery() {
  const { settings, artworks, loading, error } = useGallery();
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {settings?.title || 'Galeria de Arte'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {settings?.description || 'Bem-vindo à minha galeria de arte digital'}
        </p>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        {settings?.categories?.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
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