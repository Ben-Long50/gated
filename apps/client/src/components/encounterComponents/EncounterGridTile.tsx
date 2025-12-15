import { useContext, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import CharacterEncounterToken from './CharacterEncounterToken';
import { Location } from 'src/types/map';
import Icon from '@mdi/react';
import { mdiCircleDouble, mdiClose } from '@mdi/js';
import { useDroppable } from '@dnd-kit/core';
import isInRange from './encounterUtils/isInRange';

const EncounterGridTile = ({
  row,
  col,
  height,
  gridDisplay,
  mapScale,
  characterLocations,
  activeCoordinates,
  range,
  rangeColor,
}: {
  row: number;
  col: number;
  height: number;
  gridDisplay: boolean;
  mapScale: number;
  characterLocations: Location[];
  activeCoordinates: { row: number; col: number } | null;
  range: number;
  rangeColor: string;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const [hover, setHover] = useState(false);

  const inRange = activeCoordinates
    ? isInRange(activeCoordinates, { row, col }, range)
    : false;

  const { isOver, setNodeRef } = useDroppable({
    id: `row ${row}, col ${col}`,
    data: { row, col, inRange },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${gridDisplay && 'border'} relative z-10 flex size-full items-center justify-center`}
      style={{
        borderColor: `${accentPrimary}80`,
        gridRow: row,
        gridColumn: col,
        transition: 'background 0.2s ease',
        background: inRange
          ? `radial-gradient(circle, transparent, 75%, ${rangeColor})`
          : hover && characterLocations && characterLocations.length === 0
            ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
            : 'transparent',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isOver ? (
        inRange ? (
          <Icon path={mdiCircleDouble} className="text-accent size-12" />
        ) : (
          <Icon path={mdiClose} className="text-error size-12" />
        )
      ) : null}
      {characterLocations.length > 0 &&
        characterLocations.map((location) => (
          <CharacterEncounterToken
            key={location.characterId}
            location={location}
            activeCoordinates={activeCoordinates}
            range={range}
            height={height}
            mapScale={mapScale}
          />
        ))}
      {hover && (
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
      )}
    </div>
  );
};

export default EncounterGridTile;
