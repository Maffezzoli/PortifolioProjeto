import { useState, useEffect } from 'react';
import { useGallery } from '../contexts/GalleryContext';
import { useTheme } from '../contexts/ThemeContext';
import ProjectCard from './ProjectCard';

function GalleryEditor() {
  const { settings, updateSettings } = useGallery();
  const { theme } = useTheme();
  const [formData, setFormData] = useState(settings || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

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

  const handleAddCategory = () => {
    if (newCategory.id && newCategory.name) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
      setNewCategory({ id: '', name: '' });
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== categoryId)
    }));
  };

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
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Categorias</label>
            <div className="space-y-2">
              {formData.categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => {
                      const updatedCategories = formData.categories.map(cat =>
                        cat.id === category.id ? { ...cat, name: e.target.value } : cat
                      );
                      setFormData(prev => ({ ...prev, categories: updatedCategories }));
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