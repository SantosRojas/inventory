const generateColor = (index: number) => {
  const hue = (index * 137.508) % 360; // usa número primo para buena distribución
  return `hsl(${hue}, 65%, 55%)`;
};

export default generateColor;