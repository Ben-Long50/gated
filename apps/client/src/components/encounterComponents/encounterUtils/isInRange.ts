const isInRange = (
  currentCoordinates: { row: number; col: number },
  mapCoordinates: { row: number; col: number },
  range: number,
) => {
  if (range == null) return true;
  const dx = mapCoordinates.col - currentCoordinates.col;
  const dy = mapCoordinates.row - currentCoordinates.row;

  const distance =
    range === 1
      ? Math.max(Math.abs(dx), Math.abs(dy))
      : Math.round(Math.sqrt(dx ** 2 + dy ** 2));
  return distance <= range;
};

export default isInRange;
