import { useContext, useMemo, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import isInRange from './encounterUtils/isInRange';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

const EncounterGridTile = ({
  row,
  col,
  selected,
  height,
  activeCoordinates,
  rangeData,
  gridDisplay,
  insertTarget,
  tileDragStart,
  handleDragUpdate,
  handleRemoveTarget,
}: {
  row: number;
  col: number;
  selected: boolean;
  height: number;
  activeCoordinates: { row: number; col: number } | null;
  rangeData: { range: number; color: string };
  gridDisplay: boolean;
  insertTarget?: (
    targetRow: number,
    targetCol: number,
    inRange: boolean,
    targetId?: number,
  ) => void;
  tileDragStart?: (row: number, col: number) => void;
  handleDragUpdate?: (
    row: number,
    col: number,
    targetId?: number,
    inRange?: boolean | null,
  ) => void;
  handleRemoveTarget?: (characterId?: number) => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const [hover, setHover] = useState(false);

  const inRange = activeCoordinates
    ? isInRange(activeCoordinates, { row, col }, rangeData.range)
    : true;

  return (
    <div
      id={`row ${row}, col ${col}`}
      className={`${gridDisplay ? 'border-accent' : 'border-transparent'} relative flex size-full items-center justify-center border border-opacity-50`}
      style={{
        gridRow: row,
        gridColumn: col,
        background: inRange
          ? `radial-gradient(circle, transparent, 75%, ${rangeData.color})`
          : hover
            ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
            : undefined,
      }}
      onClick={() => {
        if (insertTarget) {
          insertTarget(row, col, inRange);
        }
      }}
      onMouseDown={() => {
        if (tileDragStart) {
          tileDragStart(row, col);
        }
      }}
      onMouseEnter={
        handleDragUpdate
          ? () => handleDragUpdate(row, col, undefined, inRange)
          : () => setHover(true)
      }
      onMouseLeave={() => setHover(false)}
      onDoubleClick={
        handleRemoveTarget ? () => handleRemoveTarget() : undefined
      }
    >
      {selected && inRange === false && (
        <Icon className="text-red-500" path={mdiClose} size={2.5} />
      )}
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
