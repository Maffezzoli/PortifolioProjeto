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
      <div className="space-y-16">
        <ProjectCard>
          <div className="space-y-8">
            <div className="space-y-4">
              <TextStyled type="title">{project.title}</TextStyled>
              <TextStyled type="subtitle">{project.description}</TextStyled>
            </div>

            {project.coverUrl && (
              <img
                src={project.coverUrl}
                alt={project.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            )}

            <TextStyled type="content" customStyle={project.textStyle}>
              {project.content}
            </TextStyled>
          </div>
        </ProjectCard>

        <div className="space-y-12">
          {project.images?.map((image, index) => (
            <ImageWithLayout 
              key={index} 
              image={image} 
              textStyle={project.textStyle}
            />
          ))}
        </div>

        <TextStyled type="caption" className="text-center">
          Criado em: {project.createdAt instanceof Date 
            ? project.createdAt.toLocaleDateString()
            : new Date(project.createdAt).toLocaleDateString()}
        </TextStyled>
      </div>
    </div>
  );
}

export default ProjectDetails; 