import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Location } from 'src/types/map';
import Icon from '@mdi/react';
import { mdiCircleDouble } from '@mdi/js';
import { useDroppable } from '@dnd-kit/core';
import CharacterToken from './CharacterToken';

const MapGridTile = ({
  index,
  gridDisplay,
  characterLocations,
  getCoordinates,
  hoveredIndex,
  setHoveredIndex,
}: {
  index: number;
  gridDisplay: boolean;
  characterLocations: Location[];
  getCoordinates: (index: number) => { x: number; y: number };
  hoveredIndex: number;
  setHoveredIndex: (index: number) => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const mapCoordinates = getCoordinates(index);

  const { isOver, setNodeRef } = useDroppable({
    id: `${index}`,
    data: { index },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${gridDisplay && 'border'} relative flex size-12 items-center justify-center`}
      style={{
        borderColor: `${accentPrimary}80`,
        transition: 'background 0.2s ease',
        background:
          hoveredIndex === index && characterLocations.length === 0
            ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
            : 'transparent',
      }}
      onMouseEnter={() => setHoveredIndex(index)}
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
      {hoveredIndex === index && (
        <p
          className={`bg-tertiary pointer-events-none absolute right-1/2 top-0 z-20 select-none whitespace-nowrap rounded p-1 py-0.5 text-sm`}
          style={{
            transform: 'translateY(-100%) translateY(-4px) translateX(50%)',
          }}
        >
          [{mapCoordinates.x}, {mapCoordinates.y}]
        </p>
      )}
    </div>
  );
};

export default MapGridTile;
