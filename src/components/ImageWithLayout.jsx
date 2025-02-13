import ProjectCard from './ProjectCard';
import TextStyled from './TextStyled';

function ImageWithLayout({ image, textStyle }) {
  const layoutClasses = {
    full: "w-full",
    left: "float-left mr-8 w-[300px] md:w-[400px]",
    right: "float-right ml-8 w-[300px] md:w-[400px]"
  };

  const spacingClasses = {
    tight: "mb-4",
    normal: "mb-8",
    loose: "mb-16"
  };

  const wrapperClasses = {
    full: "",
    left: "overflow-auto",
    right: "overflow-auto"
  };

  const imageContent = (
    <figure className={layoutClasses[image.layout]}>
      <div className={`${image.layout === 'full' ? 'aspect-w-16 aspect-h-9' : 'aspect-w-4 aspect-h-3'} mb-2`}>
        <img
          src={image.url}
          alt={image.description}
          className="rounded-lg shadow-lg object-cover w-full h-full"
        />
      </div>
      {image.description && (
        <TextStyled type="caption" customStyle={textStyle}>
          {image.description}
        </TextStyled>
      )}
    </figure>
  );

  if (image.layout === 'full') {
    return (
      <ProjectCard className={spacingClasses[image.spacing || 'normal']}>
        {imageContent}
      </ProjectCard>
    );
  }

  return (
    <div className={`${wrapperClasses[image.layout]} ${spacingClasses[image.spacing || 'normal']}`}>
      {imageContent}
      {image.content && (
        <TextStyled type="content" customStyle={textStyle}>
          {image.content}
        </TextStyled>
      )}
    </div>
  );
}

export default ImageWithLayout; 