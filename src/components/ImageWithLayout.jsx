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

export default ImageWithLayout; 