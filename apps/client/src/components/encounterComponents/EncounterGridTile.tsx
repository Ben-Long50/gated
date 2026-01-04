import { useContext, useMemo, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import isInRange from './encounterUtils/isInRange';

const EncounterGridTile = ({
  id,
  row,
  col,
  height,
  activeCoordinates,
  range,
  rangeColor,
  gridDisplay,
  handleDragStart,
  handleDragUpdate,
  handleRemoveTarget,
}: {
  id: string;
  row: number;
  col: number;
  height: number;
  activeCoordinates: { row: number; col: number } | null;
  range: number;
  rangeColor: string;
  gridDisplay: boolean;
  handleDragStart?: (row: number, col: number, characterId?: number) => void;
  handleDragUpdate?: (row: number, col: number, targetId?: number) => void;
  handleRemoveTarget?: (characterId?: number) => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const [hover, setHover] = useState(false);

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
      className={`${gridDisplay ? 'border-accent' : 'border-transparent'} relative size-full border border-opacity-50`}
      style={{
        gridRow: row,
        gridColumn: col,
        background: inRange
          ? `radial-gradient(circle, transparent, 75%, ${rangeColor})`
          : hover
            ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
            : undefined,
      }}
      onMouseDown={
        handleDragStart ? () => handleDragStart(row, col) : undefined
      }
      onMouseEnter={
        handleDragUpdate
          ? () => handleDragUpdate(row, col)
          : () => setHover(true)
      }
      onMouseLeave={() => setHover(false)}
      onDoubleClick={
        handleRemoveTarget ? () => handleRemoveTarget() : undefined
      }
    >
      {hover && (
        <p
          className={`bg-tertiary pointer-events-none absolute right-1/2 top-1/2 select-none whitespace-nowrap rounded p-1 py-0.5 text-sm`}
          style={{
            transform:
              row > height / 2
                ? 'translateY(-50%) translateY(-42px)  translateX(50%)'
                : 'translateY(-50%) translateY(42px)  translateX(50%)',
          }}
        >
          [{col}, {row}]
        </p>
      )}
    </div>
  );
};

export default EncounterGridTile;
