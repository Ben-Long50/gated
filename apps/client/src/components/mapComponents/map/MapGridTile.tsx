import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Location } from 'src/types/map';
import Icon from '@mdi/react';
import { mdiCircleDouble } from '@mdi/js';
import { useDroppable } from '@dnd-kit/core';
import CharacterToken from './CharacterToken';

const MapGridTile = ({
  row,
  col,
  gridDisplay,
  characterLocations,
  hoveredCoords,
  setHoveredCoords,
}: {
  row: number;
  col: number;
  gridDisplay: boolean;
  characterLocations: Location[];
  hoveredCoords: {
    row: number | null;
    col: number | null;
  };
  setHoveredCoords: ({
    row,
    col,
  }: {
    row: number | null;
    col: number | null;
  }) => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const active = hoveredCoords?.col === col && hoveredCoords?.row === row;

  const { isOver, setNodeRef } = useDroppable({
    id: `row ${row}, col ${col}`,
    data: { row, col },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${gridDisplay && 'border'} relative z-10 flex size-12 items-center justify-center`}
      style={{
        borderColor: `${accentPrimary}80`,
        transition: 'background 0.2s ease',
        background:
          active && characterLocations.length === 0
            ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
            : 'transparent',
      }}
      onMouseEnter={() => setHoveredCoords({ row, col })}
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
          />
        ))}
      {active && (
        <p
          className={`bg-tertiary pointer-events-none absolute right-1/2 top-0 z-20 select-none whitespace-nowrap rounded p-1 py-0.5 text-sm`}
          style={{
            transform: 'translateY(-100%) translateY(-4px) translateX(50%)',
          }}
        >
          [{col}, {row}]
        </p>
      )}
    </div>
  );
};

export default MapGridTile;
