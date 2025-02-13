import TextStyled from './TextStyled';

function ImageWithLayout({ image, textStyle }) {
  const layoutClasses = {
    full: "w-full bg-white rounded-lg shadow-sm",
    left: "w-[300px] md:w-[400px]",
    right: "w-[300px] md:w-[400px]"
  };

  const spacingClasses = {
    tight: "mb-4",
    normal: "mb-8",
    loose: "mb-16"
  };

  const wrapperClasses = {
    full: "",
    left: "flex flex-wrap md:flex-nowrap items-start gap-8 max-w-full",
    right: "flex flex-wrap md:flex-nowrap flex-row-reverse items-start gap-8 max-w-full"
  };

  const contentClasses = {
    full: "w-full",
    left: "flex-1 min-w-0 w-full md:w-auto break-words overflow-hidden",
    right: "flex-1 min-w-0 w-full md:w-auto break-words overflow-hidden"
  };

  const imageContainerClasses = {
    full: "w-full",
    left: "w-full md:w-[300px] lg:w-[400px] flex-shrink-0",
    right: "w-full md:w-[300px] lg:w-[400px] flex-shrink-0"
  };

  const imageContent = (
    <figure className={imageContainerClasses[image.layout]}>
      <div className={`${image.layout === 'full' ? 'aspect-w-16 aspect-h-9' : 'aspect-w-4 aspect-h-3'} mb-2`}>
        <img
          src={image.url}
          alt={image.description}
          className={`object-cover w-full h-full ${image.layout === 'full' ? 'rounded-lg' : 'rounded-lg shadow-lg'}`}
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
      <div className={spacingClasses[image.spacing || 'normal']}>
        {imageContent}
      </div>
    );
  }

  return (
    <div className={`${wrapperClasses[image.layout]} ${spacingClasses[image.spacing || 'normal']}`}>
      {imageContent}
      {image.content && (
        <div className={contentClasses[image.layout]}>
          <TextStyled type="content" customStyle={textStyle}>
            {image.content}
          </TextStyled>
        </div>
      )}
    </div>
  );
}

export default ImageWithLayout; 