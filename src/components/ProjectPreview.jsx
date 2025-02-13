import { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import TextStyled from './TextStyled';
import ImageWithLayout from './ImageWithLayout';

function ProjectPreview({ project, coverImage }) {
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    const loadPreviewImages = async () => {
      const images = await Promise.all(
        project.images.map(async (img) => ({
          ...img,
          url: img.file ? URL.createObjectURL(img.file) : img.url
        }))
      );
      setPreviewImages(images);
    };

    loadPreviewImages();

    // Cleanup
    return () => {
      previewImages.forEach(img => {
        if (img.url?.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [project.images]);

  return (
    <div className="space-y-8">
      <ProjectCard>
        <TextStyled type="title">{project.title}</TextStyled>
        <TextStyled type="subtitle" className="mt-2">{project.description}</TextStyled>

        {(coverImage || project.coverUrl) && (
          <div className="mt-6">
            <img
              src={coverImage ? URL.createObjectURL(coverImage) : project.coverUrl}
              alt={project.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </ProjectCard>

      <ProjectCard>
        <TextStyled type="content" customStyle={project.textStyle}>
          {project.content}
        </TextStyled>
      </ProjectCard>

      {previewImages.map((image, index) => (
        <ImageWithLayout 
          key={index} 
          image={image} 
          textStyle={project.textStyle}
        />
      ))}
    </div>
  );
}

export default ProjectPreview; 