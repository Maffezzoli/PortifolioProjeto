import ImageWithLayout from './ImageWithLayout';

function ProjectPreview({ project }) {
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
            <div className={`whitespace-pre-wrap text-gray-700 ${textClasses}`}>
              {project.content}
            </div>

            {/* Imagens Adicionais */}
            {project.images?.map((image, index) => (
              <ImageWithLayout key={index} image={image} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectPreview; 