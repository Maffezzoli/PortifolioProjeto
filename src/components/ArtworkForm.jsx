import { useState, useEffect } from 'react';
import { artworkService } from '../firebase/artworkService';
import { useGallery } from '../contexts/GalleryContext';

function ArtworkForm({ artwork, onSuccess, onError }) {
  const { settings, reloadGallery } = useGallery();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (artwork) {
      setTitle(artwork.title);
      setDescription(artwork.description);
      setCategory(artwork.category);
    }
  }, [artwork]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const artworkData = {
        title,
        description,
        category,
        updatedAt: new Date().toISOString()
      };

      if (artwork) {
        await artworkService.updateArtwork(artwork.id, artworkData);
      } else {
        await artworkService.createArtwork(artworkData, image);
      }

      await reloadGallery();
      onSuccess?.();
      if (!artwork) {
        setTitle('');
        setDescription('');
        setImage(null);
        setCategory('');
      }
    } catch (error) {
      console.error('Erro ao salvar artwork:', error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Categoria</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Selecione uma categoria</option>
          {settings?.categories?.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          rows={3}
        />
      </div>

      {!artwork && (
        <div>
          <label className="block text-gray-700 mb-2">Imagem</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
            accept="image/*"
            required
          />
        </div>
      )}

      <button
        type="submit"
        className={`w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition-opacity ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}

export default ArtworkForm; 