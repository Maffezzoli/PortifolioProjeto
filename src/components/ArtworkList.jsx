import { useState, useEffect } from 'react';
import { artworkService } from '../services/artworkService';

function ArtworkList({ onEdit, onDelete }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      const data = await artworkService.getAllArtworks();
      setArtworks(data);
    } catch (error) {
      console.error('Erro ao carregar artes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta arte?')) {
      try {
        await artworkService.deleteArtwork(id);
        onDelete?.();
        loadArtworks();
      } catch (error) {
        console.error('Erro ao excluir arte:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Carregando artes...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Galeria Existente</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-medium">{artwork.title}</h4>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => onEdit(artwork)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(artwork.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtworkList; 