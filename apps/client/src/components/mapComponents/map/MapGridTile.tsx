import { useContext, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Location } from 'src/types/map';
import Icon from '@mdi/react';
import { mdiCircleDouble } from '@mdi/js';
import { useDroppable } from '@dnd-kit/core';
import CharacterToken from './CharacterToken';

const MapGridTile = ({
  row,
  col,
  height,
  gridDisplay,
  mapScale,
  characterLocations,
}: {
  row: number;
  col: number;
  height: number;
  gridDisplay: boolean;
  mapScale: number;
  characterLocations: Location[];
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const [hover, setHover] = useState(false);

  const { isOver, setNodeRef } = useDroppable({
    id: `row ${row}, col ${col}`,
    data: { row, col },
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
        background:
          hover && characterLocations.length === 0
            ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
            : 'transparent',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isOver ? (
        <Icon path={mdiCircleDouble} className="text-accent size-12" />
      ) : null}
      {characterLocations.length > 0 &&
        characterLocations.map((location) => (
          <CharacterToken
            key={location.characterId}
            characterId={location.characterId}
            locationId={location.id}
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

export default MapGridTile;
