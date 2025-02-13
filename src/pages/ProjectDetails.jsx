import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';

function ImageWithLayout({ image }) {
  const layoutClasses = {
    full: "w-full mb-8 clear-both",
    left: "float-left mr-8 mb-4 w-[300px] md:w-[400px]",
    right: "float-right ml-8 mb-4 w-[300px] md:w-[400px]"
  };

  const containerClasses = {
    full: "w-full mb-8",
    left: "w-full mb-4 after:content-[''] after:clear-both after:table",
    right: "w-full mb-4 after:content-[''] after:clear-both after:table"
  };

  return (
    <div className={containerClasses[image.layout]}>
      <figure className={layoutClasses[image.layout]}>
        <div className="aspect-w-16 aspect-h-9 mb-2">
          <img
            src={image.url}
            alt={image.description}
            className="rounded-lg shadow-lg object-cover w-full h-full"
          />
        </div>
        {image.description && (
          <figcaption className="mt-2 text-sm text-gray-600 text-center">
            {image.description}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectService.getProject(id);
        setProject(data);
      } catch (error) {
        console.error('Erro ao carregar projeto:', error);
        setError('Erro ao carregar o projeto. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-gray-600">Carregando projeto...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-gray-600">Projeto não encontrado</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Cabeçalho do Projeto */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
        <p className="text-xl text-gray-600">{project.description}</p>
      </div>

      {/* Imagem de Capa */}
      {project.coverUrl && (
        <div className="mb-8">
          <img
            src={project.coverUrl}
            alt={project.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Conteúdo do Projeto com Imagens */}
      <div className="prose max-w-none">
        <div className="relative flow-root">
          <div className="whitespace-pre-wrap text-gray-700">
            {project.content}
          </div>

          {/* Imagens Adicionais */}
          {project.images?.map((image, index) => (
            <ImageWithLayout key={index} image={image} />
          ))}
        </div>
      </div>

      {/* Data de Criação */}
      <div className="mt-8 text-sm text-gray-500">
        Criado em: {project.createdAt?.toDate().toLocaleDateString()}
      </div>
    </div>
  );
}

export default ProjectDetails; 