import { useState } from 'react';
import { projectService } from '../services/projectService';

function ProjectForm({ onSuccess }) {
  const [project, setProject] = useState({
    title: '',
    description: '',
    content: '',
    images: []
  });
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddImage = () => {
    setProject(prev => ({
      ...prev,
      images: [...prev.images, { file: null, description: '', layout: 'full' }]
    }));
  };

  const handleImageChange = (index, field, value) => {
    setProject(prev => {
      const newImages = [...prev.images];
      newImages[index] = { ...newImages[index], [field]: value };
      return { ...prev, images: newImages };
    });
  };

  const handleRemoveImage = (index) => {
    setProject(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await projectService.addProject(project, coverImage);
      setProject({ title: '', description: '', content: '', images: [] });
      setCoverImage(null);
      onSuccess?.();
    } catch (error) {
      setError('Erro ao criar projeto. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-700 mb-2">Título do Projeto</label>
        <input
          type="text"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Descrição Breve</label>
        <input
          type="text"
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Imagem de Capa</label>
        <input
          type="file"
          onChange={(e) => setCoverImage(e.target.files[0])}
          className="w-full"
          accept="image/*"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Conteúdo</label>
        <textarea
          value={project.content}
          onChange={(e) => setProject({ ...project, content: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
          rows="6"
          required
        />
      </div>

      {/* Seção de Imagens Adicionais */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-gray-700">Imagens do Projeto</label>
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
          >
            + Adicionar Imagem
          </button>
        </div>

        {project.images.map((image, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between">
              <h4 className="font-medium">Imagem {index + 1}</h4>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remover
              </button>
            </div>

            <div>
              <input
                type="file"
                onChange={(e) => handleImageChange(index, 'file', e.target.files[0])}
                className="w-full"
                accept="image/*"
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Descrição da imagem"
                value={image.description}
                onChange={(e) => handleImageChange(index, 'description', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <select
                value={image.layout}
                onChange={(e) => handleImageChange(index, 'layout', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="full">Largura Total</option>
                <option value="left">Lateral Esquerda</option>
                <option value="right">Lateral Direita</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Criando...' : 'Criar Projeto'}
      </button>
    </form>
  );
}

export default ProjectForm; 