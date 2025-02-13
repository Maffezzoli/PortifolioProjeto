import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

function ProjectList({ onEdit, onDelete }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setError('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        setLoading(true);
        setError(null); // Limpa erros anteriores
        await projectService.deleteProject(id);
        await loadProjects();
        onDelete?.();
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
        setError(error.message || 'Erro ao excluir projeto. Verifique se você está autenticado.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }

  if (loading) {
    return <div className="text-center">Carregando projetos...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Projetos Existentes</h3>
      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-lg">{project.title}</h4>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(project)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-red-600 hover:text-red-700"
                  disabled={loading}
                >
                  {loading ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList; 