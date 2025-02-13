import { useState, useEffect } from 'react';
import { useGallery } from '../contexts/GalleryContext';
import { useTheme } from '../contexts/ThemeContext';
import ProjectCard from './ProjectCard';

function GallerySettings() {
  const { settings, updateSettings } = useGallery();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: 'Galeria da Nathália',
    description: 'Artes feitas por mim',
    categories: [
      { id: 'all', name: 'Todas' },
      { id: 'anatomy', name: 'Anatomia' },
      { id: 'scenario', name: 'Cenário' },
      { id: 'character', name: 'Personagens' }
    ],
    layout: 'grid',
    itemsPerPage: 12,
    showFilters: true,
    sortBy: 'newest'
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });

  useEffect(() => {
    if (settings) {
      setFormData(prev => ({
        ...prev,
        ...settings
      }));
    }
  }, [settings]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.id && newCategory.name) {
      if (formData.categories.some(cat => cat.id === newCategory.id)) {
        setMessage('Já existe uma categoria com este ID');
        return;
      }
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      setNewCategory({ id: '', name: '' });
    }
  };

  const handleRemoveCategory = (categoryId) => {
    if (categoryId === 'all') {
      setMessage('A categoria "Todas" não pode ser removida');
      return;
    }
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateSettings(formData);
      setMessage('Configurações atualizadas com sucesso!');
    } catch (error) {
      setMessage('Erro ao salvar configurações: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProjectCard>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">
          Configurações da Galeria
        </h2>

        {message && (
          <div className={`p-4 rounded ${
            message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Informações Básicas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Título da Galeria</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ex: Galeria da Nathália"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Ex: Artes feitas por mim"
                />
              </div>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Categorias</h3>
            
            {/* Adicionar Nova Categoria */}
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-700 mb-3">Adicionar Nova Categoria</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">ID da Categoria</label>
                  <input
                    type="text"
                    value={newCategory.id}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, id: e.target.value.toLowerCase() }))}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Ex: digital"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Nome da Categoria</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Ex: Arte Digital"
                  />
                </div>
              </div>
              <button
                onClick={handleAddCategory}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
                type="button"
              >
                Adicionar Categoria
              </button>
            </div>

            {/* Lista de Categorias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.categories.map(category => (
                <div
                  key={category.id}
                  className="p-4 border rounded-lg bg-white flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">ID: {category.id}</p>
                  </div>
                  {category.id !== 'all' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Layout da Galeria */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Tipo de Layout</label>
                <select
                  value={formData.layout}
                  onChange={(e) => setFormData(prev => ({ ...prev, layout: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="grid">Grid</option>
                  <option value="masonry">Masonry</option>
                  <option value="list">Lista</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Itens por Página</label>
                <input
                  type="number"
                  min="4"
                  max="24"
                  value={formData.itemsPerPage}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemsPerPage: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Opções de Visualização */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Visualização</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showFilters"
                  checked={formData.showFilters}
                  onChange={(e) => setFormData(prev => ({ ...prev, showFilters: e.target.checked }))}
                  className="w-4 h-4 text-primary"
                />
                <label htmlFor="showFilters" className="ml-2 text-gray-700">
                  Mostrar filtros de categoria
                </label>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Ordenar por</label>
                <select
                  value={formData.sortBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="newest">Mais recentes primeiro</option>
                  <option value="oldest">Mais antigos primeiro</option>
                  <option value="name">Nome</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition-opacity ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </form>
    </ProjectCard>
  );
}

export default GallerySettings; 