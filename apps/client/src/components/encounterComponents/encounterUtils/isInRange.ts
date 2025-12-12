const isInRange = (
  currentCoordinates: { row: number; col: number },
  mapCoordinates: { row: number; col: number },
  range: number,
) => {
  if (!range) return null;
  const dx = mapCoordinates.col - currentCoordinates.col;
  const dy = mapCoordinates.row - currentCoordinates.row;

  const distance =
    range === 1
      ? Math.max(Math.abs(dx), Math.abs(dy))
      : Math.sqrt(dx * dx + dy * dy);
  return distance <= range;
};

export default isInRange;
