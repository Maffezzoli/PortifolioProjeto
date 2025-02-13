import { useState } from 'react';
import { projectService } from '../services/projectService';
import ProjectPreview from './ProjectPreview';
import { auth } from '../firebase/config';

function ProjectForm({ project: initialProject, onSuccess }) {
  const [project, setProject] = useState(() => {
    if (!initialProject) {
      return {
        title: '',
        description: '',
        content: '',
        images: [],
        textStyle: {
          fontSize: 'normal',
          alignment: 'left',
          fontFamily: 'sans'
        },
        spacing: 'normal'
      };
    }

    // Se temos um projeto inicial, mantemos todos os dados existentes
    return {
      ...initialProject,
      // Garantimos que as imagens tenham a estrutura correta
      images: initialProject.images?.map(img => ({
        ...img,
        file: null, // Resetamos o arquivo para não tentar fazer upload novamente
        url: img.url || '',
        description: img.description || '',
        layout: img.layout || 'full',
        spacing: img.spacing || 'normal',
        content: img.content || ''
      })) || [],
      // Garantimos que o textStyle tenha todos os campos necessários
      textStyle: {
        fontSize: initialProject.textStyle?.fontSize || 'normal',
        alignment: initialProject.textStyle?.alignment || 'left',
        fontFamily: initialProject.textStyle?.fontFamily || 'sans'
      },
      // Outros campos com valores padrão se necessário
      spacing: initialProject.spacing || 'normal'
    };
  });

  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

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

  const handleTextStyleChange = (field, value) => {
    setProject(prev => ({
      ...prev,
      textStyle: {
        ...prev.textStyle,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!auth.currentUser) {
        throw new Error('Você precisa estar autenticado para criar ou editar projetos');
      }

      if (initialProject) {
        await projectService.updateProject(initialProject.id, project, coverImage);
      } else {
        await projectService.addProject(project, coverImage);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erro:', error);
      setError(error.message || 'Erro ao salvar projeto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-8">
      {/* Lado Esquerdo - Formulário */}
      <div className="w-1/2 space-y-6">
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
            {initialProject?.coverUrl && !coverImage && (
              <div className="mb-2">
                <img
                  src={initialProject.coverUrl}
                  alt="Capa atual"
                  className="w-40 h-40 object-cover rounded"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Imagem atual - selecione uma nova para substituir
                </p>
              </div>
            )}
            <input
              type="file"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full"
              accept="image/*"
              required={!initialProject?.coverUrl}
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
                  {image.url && !image.file && (
                    <div className="mb-2">
                      <img
                        src={image.url}
                        alt={image.description}
                        className="w-40 h-40 object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(index, 'file', e.target.files[0])}
                    className="w-full"
                    accept="image/*"
                    required={!image.url}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Layout</label>
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

                  <div>
                    <label className="block text-gray-700 mb-2">Espaçamento</label>
                    <select
                      value={image.spacing || 'normal'}
                      onChange={(e) => handleImageChange(index, 'spacing', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="tight">Compacto</option>
                      <option value="normal">Normal</option>
                      <option value="loose">Espaçado</option>
                    </select>
                  </div>
                </div>

                {/* Campo de texto associado à imagem - só aparece para layouts laterais */}
                {image.layout !== 'full' && (
                  <div>
                    <label className="block text-gray-700 mb-2">Texto Associado</label>
                    <textarea
                      value={image.content || ''}
                      onChange={(e) => handleImageChange(index, 'content', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
                      rows="4"
                      placeholder="Digite o texto que aparecerá ao lado da imagem..."
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Opções de Estilo de Texto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Tamanho do Texto</label>
              <select
                value={project.textStyle.fontSize}
                onChange={(e) => handleTextStyleChange('fontSize', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="normal">Normal</option>
                <option value="large">Grande</option>
                <option value="xl">Extra Grande</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Alinhamento</label>
              <select
                value={project.textStyle.alignment}
                onChange={(e) => handleTextStyleChange('alignment', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="left">Esquerda</option>
                <option value="center">Centralizado</option>
                <option value="justify">Justificado</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Fonte</label>
              <select
                value={project.textStyle.fontFamily}
                onChange={(e) => handleTextStyleChange('fontFamily', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="sans">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Salvando...' : initialProject ? 'Salvar Alterações' : 'Criar Projeto'}
          </button>
        </form>
      </div>

      {/* Lado Direito - Preview */}
      <div className="w-1/2 sticky top-4 h-[calc(100vh-2rem)] overflow-auto">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Visualização em Tempo Real</h3>
          <ProjectPreview 
            project={project}
            coverImage={coverImage}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectForm; 