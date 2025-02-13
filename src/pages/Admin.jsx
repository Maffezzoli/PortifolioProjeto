import { useState } from 'react';
import ArtworkForm from '../components/ArtworkForm';
import ProfileEditor from '../components/ProfileEditor';
import ProjectForm from '../components/ProjectForm';
import { useProjects } from '../hooks/useProjects';

function Admin() {
  const [activeTab, setActiveTab] = useState('profile');
  const { reloadProjects } = useProjects();

  const handleProjectSuccess = () => {
    reloadProjects();
  };

  return (
    <div className="max-w-4xl mx-auto">
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
          Artes
        </button>
      </div>

      {activeTab === 'profile' && <ProfileEditor />}
      {activeTab === 'projects' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Novo Projeto</h2>
          <ProjectForm onSuccess={handleProjectSuccess} />
        </div>
      )}
      {activeTab === 'artworks' && <ArtworkForm />}
    </div>
  );
}

export default Admin;