import { useEffect, useState } from 'react';
import ImageWithLayout from './ImageWithLayout';

function ProjectPreview({ project, coverImage, projectImages }) {
  const [imageUrls, setImageUrls] = useState({
    cover: null,
    images: []
  });

  useEffect(() => {
    // Criar URLs temporárias para as imagens
    const createImageUrls = () => {
      // URL para imagem de capa
      const coverUrl = coverImage ? URL.createObjectURL(coverImage) : project.coverUrl;

      // URLs para imagens adicionais
      const urls = project.images.map((img, index) => ({
        ...img,
        url: img.file ? URL.createObjectURL(img.file) : img.url
      }));

      setImageUrls({
        cover: coverUrl,
        images: urls
      });
    };

    createImageUrls();

    // Limpar URLs temporárias quando o componente for desmontado
    return () => {
      if (imageUrls.cover && imageUrls.cover.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrls.cover);
      }
      imageUrls.images.forEach(img => {
        if (img.url && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [project, coverImage]);

  const textStyleClasses = {
    fontSize: {
      normal: 'text-base',
      large: 'text-lg',
      xl: 'text-xl'
    },
    alignment: {
      left: 'text-left',
      center: 'text-center',
      justify: 'text-justify'
    },
    fontFamily: {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono'
    }
  };

  const textClasses = `
    ${textStyleClasses.fontSize[project.textStyle.fontSize]}
    ${textStyleClasses.alignment[project.textStyle.alignment]}
    ${textStyleClasses.fontFamily[project.textStyle.fontFamily]}
  `;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho do Projeto */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{project.title}</h1>
          <p className="text-xl text-gray-600">{project.description}</p>
        </div>

        {/* Imagem de Capa */}
        {imageUrls.cover && (
          <div className="mb-8">
            <img
              src={imageUrls.cover}
              alt={project.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Conteúdo do Projeto com Imagens */}
        <div className="prose max-w-none">
          <div className="relative">
            <div className={`whitespace-pre-wrap text-gray-700 ${textClasses}`}>
              {project.content}
            </div>

            {/* Imagens Adicionais */}
            {imageUrls.images.map((image, index) => (
              <ImageWithLayout 
                key={index} 
                image={image} 
                textStyle={project.textStyle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPreview; 