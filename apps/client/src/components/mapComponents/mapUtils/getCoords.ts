const getCoords = (width: number, index: number) => {
  const row = Math.floor(index / width + 1);
  const col = (index + 1) % width === 0 ? width : (index + 1) % width;

  return { row, col };
};

export default getCoords;
