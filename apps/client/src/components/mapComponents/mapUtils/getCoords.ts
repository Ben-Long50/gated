const getCoords = (width: number, index: number) => {
  const row = Math.floor((index - 1) / width + 1);
  const col = index % width === 0 ? width : index % width;

  return { row, col };
};

export default getCoords;
