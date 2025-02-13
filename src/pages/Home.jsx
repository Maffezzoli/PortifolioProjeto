import { useState, useEffect } from 'react';
import { artworkService } from '../firebase/artworkService';
import ArtworkCard from '../components/ArtworkCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const data = await artworkService.getAllArtworks();
        setArtworks(data);
      } catch (error) {
        console.error('Erro ao carregar artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Galeria de Arte</h1>
      {artworks.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma arte encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home; 