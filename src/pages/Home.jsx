import { useState, useEffect } from 'react';
import { artworkService } from '../firebase/artworkService';
import ArtworkCard from '../components/ArtworkCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Galeria de Arte
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore nossa coleção de obras de arte únicas e inspiradoras
        </p>
      </div>

      {/* Categories */}
      <div className="flex justify-center gap-8 mb-12">
        {['all', 'digital', 'traditional', 'photography'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-lg font-medium px-4 py-2 rounded-lg transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {artworks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-600">Nenhuma arte encontrada.</p>
          </div>
        ) : (
          artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home; 