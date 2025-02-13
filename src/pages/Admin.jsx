import { useState } from 'react';
import ArtworkForm from '../components/ArtworkForm';
import ProfileEditor from '../components/ProfileEditor';
import ProjectForm from '../components/ProjectForm';
import ProjectList from '../components/ProjectList';
import ArtworkList from '../components/ArtworkList';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import ThemeEditor from '../components/ThemeEditor';

function Admin() {
  const [activeTab, setActiveTab] = useState('profile');
  const [editingProject, setEditingProject] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [projectsKey, setProjectsKey] = useState(0);
  const { reloadProjects } = useProjects();
  const { user, loading } = useAuth();
  const [loadingEdit, setLoadingEdit] = useState(false);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Você precisa estar autenticado para acessar esta página</div>;
  }

  const handleProjectSuccess = () => {
    setEditingProject(null);
    setProjectsKey(prev => prev + 1);
  };

  const handleProjectDelete = () => {
    setProjectsKey(prev => prev + 1);
  };

  const handleEditProject = async (projectToEdit) => {
    try {
      setLoadingEdit(true);
      const fullProject = await projectService.getProjectForEdit(projectToEdit.id);
      setEditingProject(fullProject);
    } catch (error) {
      console.error('Erro ao carregar projeto para edição:', error);
      alert('Erro ao carregar projeto para edição. Tente novamente.');
    } finally {
      setLoadingEdit(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'profile'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Perfil
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'projects'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('projects')}
        >
          Projetos
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'artworks'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('artworks')}
        >
          Galeria
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'theme'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('theme')}
        >
          Personalização
        </button>
      </div>

      {activeTab === 'profile' && <ProfileEditor />}
      
      {activeTab === 'projects' && (
        <div className="space-y-8">
          {loadingEdit ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Carregando projeto para edição...</p>
            </div>
          ) : editingProject ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Editar Projeto</h2>
                <button
                  onClick={() => setEditingProject(null)}
                  className="text-gray-600 hover:text-purple-600"
                >
                  Cancelar Edição
                </button>
              </div>
              <ProjectForm 
                project={editingProject} 
                onSuccess={handleProjectSuccess}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Novo Projeto</h2>
              <ProjectForm onSuccess={handleProjectSuccess} />
            </div>
          )}

          <ProjectList 
            key={projectsKey}
            onEdit={handleEditProject}
            onDelete={handleProjectDelete}
          />
        </div>
      )}
      
      {activeTab === 'artworks' && (
        <div className="space-y-8">
          {editingArtwork ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Editar Arte</h2>
                <button
                  onClick={() => setEditingArtwork(null)}
                  className="text-gray-600 hover:text-purple-600"
                >
                  Cancelar Edição
                </button>
              </div>
              <ArtworkForm 
                artwork={editingArtwork}
                onSuccess={() => {
                  setEditingArtwork(null);
                }}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nova Arte</h2>
              <ArtworkForm />
            </div>
          )}

          <ArtworkList 
            onEdit={setEditingArtwork}
            onDelete={() => {}}
          />
        </div>
      )}

      {activeTab === 'theme' && <ThemeEditor />}
    </div>
  );
}

export default Admin;