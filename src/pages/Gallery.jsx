import { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
import { useTheme } from '../contexts/ThemeContext';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

function Gallery() {
  const { theme } = useTheme();
  const [config, setConfig] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState({ config: true, artworks: true });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading({ config: true, artworks: true });
        
        // Força recarregar as configurações do servidor
        const configData = await galleryService.getConfig();
        console.log('Configurações carregadas na galeria:', configData);
        
        if (!configData) {
          throw new Error('Configurações não encontradas');
        }
        
        setConfig(configData);
        setLoading(prev => ({ ...prev, config: false }));

        const artworksRef = collection(db, 'artworks');
        const q = query(artworksRef);
        const querySnapshot = await getDocs(q);
        const artworksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setArtworks(artworksData);
        setLoading(prev => ({ ...prev, artworks: false }));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading({ config: false, artworks: false });
      }
    };

    loadData();
  }, []);

  const filteredArtworks = selectedCategory
    ? artworks.filter(art => art.category === selectedCategory)
    : artworks;

  if (loading.config || loading.artworks) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Carregando galeria...</p>
      </div>
    );
  }

  const CategoryButton = ({ isSelected, onClick, children }) => (
    <button
      className={`px-4 py-2 rounded-lg transition-all duration-200 border ${
        isSelected 
          ? 'border-primary bg-primary text-white'
          : 'border-primary text-primary hover:bg-primary hover:text-white'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-8 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">
          {config.title}
        </h1>
        <p className="text-lg text-gray-600">
          {config.description}
        </p>
      </div>

      {/* Categorias */}
      <div className="flex justify-center flex-wrap gap-4">
        <CategoryButton
          isSelected={!selectedCategory}
          onClick={() => setSelectedCategory(null)}
        >
          Todas
        </CategoryButton>
        {config.categories.map((category) => (
          <CategoryButton
            key={category.id}
            isSelected={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </CategoryButton>
        ))}
      </div>

      {/* Grid de imagens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">
              {selectedCategory 
                ? 'Nenhuma arte encontrada nesta categoria'
                : 'Nenhuma arte disponível na galeria'}
            </p>
          </div>
        ) : (
          filteredArtworks.map((artwork) => (
            <div 
              key={artwork.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-primary">
                  {artwork.title}
                </h3>
                {artwork.description && (
                  <p className="text-gray-600 mt-1">{artwork.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Gallery; 