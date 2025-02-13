import { useState, useEffect } from 'react';
import { artworkService } from '../firebase/artworkService';
import { galleryService } from '../services/galleryService';

function ArtworkForm({ artwork, onSuccess, onError }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadGalleryConfig();
  }, []);

  const loadGalleryConfig = async () => {
    try {
      const data = await galleryService.getConfig();
      setConfig(data);
    } catch (error) {
      console.error('Erro ao carregar configurações da galeria:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !image) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      await artworkService.addArtwork(
        { title, description },
        image
      );
      setTitle('');
      setDescription('');
      setImage(null);
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows="4"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Imagem</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          accept="image/*"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Categoria</label>
        <select
          value={artwork?.category || ''}
          onChange={(e) => {
            // Assuming you want to update the category of the artwork
            // You might want to implement a way to update the category in your artworkService
            // For now, we'll just update the local state
            setArtwork(prev => ({ ...prev, category: e.target.value }));
          }}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Selecione uma categoria</option>
          {config?.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}

export default ArtworkForm; 