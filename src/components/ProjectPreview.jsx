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
    <div className="space-y-16">
      <ProjectCard>
        <div className="space-y-8">
          <div className="space-y-4">
            <TextStyled type="title">{project.title}</TextStyled>
            <TextStyled type="subtitle">{project.description}</TextStyled>
          </div>

          {(coverImage || project.coverUrl) && (
            <img
              src={coverImage ? URL.createObjectURL(coverImage) : project.coverUrl}
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
        {previewImages.map((image, index) => (
          <ImageWithLayout 
            key={index} 
            image={image} 
            textStyle={project.textStyle}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectPreview; 