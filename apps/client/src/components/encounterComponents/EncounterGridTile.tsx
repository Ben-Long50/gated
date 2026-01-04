import { useContext, useMemo } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import isInRange from './encounterUtils/isInRange';

const EncounterGridTile = ({
  id,
  row,
  col,
  occupied,
  height,
  activeCoordinates,
  range,
  rangeColor,
  handleDragStart,
  handleDragUpdate,
  handleRemoveTarget,
}: {
  id: string;
  row: number;
  col: number;
  occupied: boolean;
  height: number;
  activeCoordinates: { row: number; col: number } | null;
  range: number;
  rangeColor: string;
  handleDragStart?: (row: number, col: number, characterId?: number) => void;
  handleDragUpdate?: (row: number, col: number, targetId?: number) => void;
  handleRemoveTarget?: (characterId?: number) => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const inRange = useMemo(
    () =>
      activeCoordinates
        ? isInRange(activeCoordinates, { row, col }, range)
        : null,
    [range],
  );

  return (
    <div
      id={id}
      className={`relative size-full`}
      style={{
        gridRow: row,
        gridColumn: col,
        background:
          id === 'hoveredTile'
            ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
            : undefined,
      }}
      onMouseDown={
        handleDragStart ? () => handleDragStart(row, col) : undefined
      }
      onMouseEnter={
        handleDragUpdate ? () => handleDragUpdate(row, col) : undefined
      }
      onDoubleClick={
        handleRemoveTarget ? () => handleRemoveTarget() : undefined
      }
    >
      <p
        className={`bg-tertiary pointer-events-none absolute right-1/2 top-1/2 z-20 select-none whitespace-nowrap rounded p-1 py-0.5 text-sm`}
        style={{
          transform:
            row > height / 2
              ? 'translateY(-50%) translateY(-42px)  translateX(50%)'
              : 'translateY(-50%) translateY(42px)  translateX(50%)',
        }}
      >
        [{col}, {row}]
      </p>
    </div>
  );
};

export default EncounterGridTile;
