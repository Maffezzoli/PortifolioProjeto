import { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
import ProjectCard from './ProjectCard';
import { useTheme } from '../contexts/ThemeContext';

function GalleryEditor() {
  const { theme } = useTheme();
  const [config, setConfig] = useState({
    title: '',
    description: '',
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await galleryService.getConfig();
      console.log('Configurações carregadas no editor:', data);
      if (data) {
        setConfig(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setMessage('Erro ao carregar configurações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Validação básica
      if (!config.title || !config.description) {
        throw new Error('Título e descrição são obrigatórios');
      }

      // Garante que temos um array de categorias
      const configToSave = {
        ...config,
        categories: config.categories || []
      };

      await galleryService.updateConfig(configToSave);
      console.log('Configurações salvas:', configToSave);
      setMessage('Configurações atualizadas com sucesso!');
      
      // Recarrega as configurações para garantir
      await loadConfig();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage(error.message || 'Erro ao salvar as configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.id && newCategory.name) {
      setConfig(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      setNewCategory({ id: '', name: '' });
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <ProjectCard>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold" style={{ color: theme.primary }}>
          Configurações da Galeria
        </h2>

        {message && (
          <div className={`p-4 rounded ${
            message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Título da Galeria</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Descrição</label>
            <textarea
              value={config.description}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Categorias</label>
            <div className="space-y-2">
              {config.categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => {
                      const updatedCategories = config.categories.map(cat =>
                        cat.id === category.id ? { ...cat, name: e.target.value } : cat
                      );
                      setConfig(prev => ({ ...prev, categories: updatedCategories }));
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="ID da categoria"
                value={newCategory.id}
                onChange={(e) => setNewCategory(prev => ({ ...prev, id: e.target.value }))}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Nome da categoria"
                value={newCategory.name}
                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 text-white rounded-lg transition-colors"
            style={{ 
              backgroundColor: theme.primary,
              opacity: saving ? 0.5 : 1
            }}
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </ProjectCard>
  );
}

export default GalleryEditor; 