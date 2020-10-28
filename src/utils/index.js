export const setStyle = (element, style) => Object.keys(style).forEach(property =>
  element.style[property] = style[property]
);
