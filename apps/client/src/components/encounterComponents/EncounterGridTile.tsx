import { useContext, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import isInRange from './encounterUtils/isInRange';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

const EncounterGridTile = ({
  row,
  col,
  height,
  activeCoordinates,
  rangeData,
  targetData,
  gridDisplay,
  insertTarget,
  tileDragStart,
  handleDragUpdate,
  handleDragEnd,
  handleRemoveTarget,
}: {
  row: number;
  col: number;
  height: number;
  activeCoordinates: { row: number; col: number } | null;
  rangeData: { range: number; color: string };
  targetData?: {};
  gridDisplay: boolean;
  insertTarget?: (
    targetRow: number,
    targetCol: number,
    inRange: boolean,
    color: string,
    targetId?: number,
  ) => void;
  tileDragStart?: (row: number, col: number) => void;
  handleDragUpdate?: (
    row: number,
    col: number,
    color: string,
    targetId?: number,
    inRange?: boolean | null,
  ) => void;
  handleDragEnd?: () => void;
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
          const color = rangeData ? rangeData.color : accentPrimary;
          insertTarget(row, col, inRange, color);
        }
      }}
      onMouseDown={() => {
        if (tileDragStart) {
          tileDragStart(row, col);
        }
      }}
      onMouseEnter={
        handleDragUpdate
          ? () =>
              handleDragUpdate(row, col, rangeData.color, undefined, inRange)
          : () => setHover(true)
      }
      onMouseUp={() => {
        if (handleDragEnd) {
          handleDragEnd();
        }
      }}
      onMouseLeave={() => setHover(false)}
      onDoubleClick={
        handleRemoveTarget ? () => handleRemoveTarget() : undefined
      }
    >
      {targetData && targetData.inRange === false && (
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
