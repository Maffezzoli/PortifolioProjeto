import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

function ProjectList({ onEdit, onDelete }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        await projectService.deleteProject(id);
        onDelete?.();
        loadProjects();
      } catch (error) {
        console.error('Erro ao excluir projeto:', error);
      }
    }
  };

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
                >
                  Excluir
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