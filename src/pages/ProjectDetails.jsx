import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import TextStyled from '../components/TextStyled';
import ImageWithLayout from '../components/ImageWithLayout';

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
      <ProjectCard>
        {/* Cabeçalho do Projeto */}
        <TextStyled type="title">{project.title}</TextStyled>
        <TextStyled type="subtitle" className="mt-2">{project.description}</TextStyled>

        {/* Imagem de Capa */}
        {project.coverUrl && (
          <div className="mt-6">
            <img
              src={project.coverUrl}
              alt={project.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </ProjectCard>

      {/* Conteúdo do Projeto */}
      <ProjectCard>
        <TextStyled type="content" customStyle={project.textStyle}>
          {project.content}
        </TextStyled>
      </ProjectCard>

      {/* Imagens Adicionais */}
      {project.images?.map((image, index) => (
        <ImageWithLayout 
          key={index} 
          image={image} 
          textStyle={project.textStyle}
        />
      ))}

      {/* Data de Criação */}
      <TextStyled type="caption" className="mt-8">
        Criado em: {project.createdAt instanceof Date 
          ? project.createdAt.toLocaleDateString()
          : new Date(project.createdAt).toLocaleDateString()}
      </TextStyled>
    </div>
  );
}

export default ProjectDetails; 