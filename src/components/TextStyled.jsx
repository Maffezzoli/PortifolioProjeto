function TextStyled({ children, type = 'content', customStyle }) {
  const defaultStyles = {
    title: 'text-4xl font-bold text-gray-900',
    subtitle: 'text-xl text-gray-600',
    content: 'text-base text-gray-700',
    caption: 'text-sm text-gray-600'
  };

  const getTextStyle = (style) => {
    if (!style) return defaultStyles[type];

    return `
      ${style.fontSize ? `text-${style.fontSize}` : ''}
      ${style.alignment ? `text-${style.alignment}` : ''}
      ${style.fontFamily ? `font-${style.fontFamily}` : ''}
    `;
  };

  return (
    <div className={`${defaultStyles[type]} ${getTextStyle(customStyle)}`}>
      {children}
    </div>
  );
}

export default TextStyled; 