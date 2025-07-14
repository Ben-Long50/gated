import { useContext, useRef, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Location, Map } from 'src/types/map';
import Icon from '@mdi/react';
import { mdiCircleDouble, mdiClose } from '@mdi/js';
import CharacterToken from './CharacterToken';
import useMapStore from 'src/stores/mapStore';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import { AuthContext } from 'src/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import RangeIcon from '../icons/RangeIcon';
import { Character } from 'src/types/character';

const MapGrid = ({
  map,
  locations,
  activeCharacter,
  gridDisplay,
  diceArray,
  rolling,
}: {
  map: Map;
  locations: Location[];
  activeCharacter: Partial<Character>;
  gridDisplay: boolean;
  diceArray: number[];
  rolling: boolean;
}) => {
  const { apiUrl } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { mapId } = useParams();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dragoverIndex, setDragoverIndex] = useState<number | null>(null);

  const gridLength = map.width * map.height;

  const dragImageRef = useRef(null);

  const getCoordinates = (index: number) => {
    return {
      x:
        map.width -
          (map.width - Math.ceil((index + 1 + map.width) % map.width)) ||
        map.width,
      y: Math.ceil(index / map.width),
    };
  };

  const updateCharacterLocation = useUpdateCharacterLocationMutation(
    apiUrl,
    Number(mapId),
  );

  const action = useMapStore((state) => state.action);
  const range = useMapStore((state) => state.range);
  const rangeColor = useMapStore((state) => state.rangeColor);

  const isInRange = (
    currentCoordinates: { x: number; y: number },
    mapCoordinates: { x: number; y: number },
    range: number,
  ) => {
    if (!range) return null;
    const dx = mapCoordinates.x - currentCoordinates.x;
    const dy = mapCoordinates.y - currentCoordinates.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= range;
  };

  return (
    <div
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${map.width}, 48px)`,
        gridTemplateRows: `repeat(${map.height}, 48px)`,
      }}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {Array.from({ length: gridLength }).map((_, index) => {
        const characterLocations =
          locations.filter((location) => location.index === index) || [];

        const mapCoordinates = getCoordinates(index);

        const currentCoordinates = getCoordinates(hoveredIndex);

        const inRange = isInRange(currentCoordinates, mapCoordinates, range);

        return (
          <div
            key={index}
            className={`${gridDisplay && 'border'} relative flex size-12 items-center justify-center`}
            style={{
              borderColor: `${accentPrimary}80`,
              transition: 'background 0.2s ease',
              background: inRange
                ? `radial-gradient(circle, transparent, 75%, ${rangeColor})`
                : hoveredIndex === index && characterLocations.length === 0
                  ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
                  : 'transparent',
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onDragEnter={() => setDragoverIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (action?.actionSubtypes.includes('movement')) {
                const characterId = e.dataTransfer.getData('characterId');
                const locationId = e.dataTransfer.getData('locationId');

                if (dragoverIndex && inRange) {
                  updateCharacterLocation.mutate({
                    characterId: Number(characterId),
                    locationId: Number(locationId),
                    index: dragoverIndex,
                  });
                  setHoveredIndex(null);
                }
              }
            }}
          >
            {dragoverIndex === index && action ? (
              inRange ? (
                action?.actionSubtypes.includes('movement') ? (
                  <Icon
                    path={mdiCircleDouble}
                    className="text-accent size-12"
                  />
                ) : action?.actionSubtypes.includes('attack') ? (
                  <RangeIcon
                    ref={dragImageRef}
                    className="size-12 !text-orange-600"
                  />
                ) : null
              ) : (
                <Icon path={mdiClose} className="text-error size-12" />
              )
            ) : null}
            {characterLocations.length > 0 &&
              characterLocations.map((location) => (
                <CharacterToken
                  key={location.characterId}
                  activeCharacter={activeCharacter}
                  characterId={location.characterId}
                  locationId={location.id}
                  setDragoverIndex={setDragoverIndex}
                  dragImageRef={dragImageRef}
                  diceArray={diceArray}
                  rolling={rolling}
                />
              ))}
            {(hoveredIndex === index || dragoverIndex === index) && (
              <p
                className={`bg-tertiary pointer-events-none absolute right-1/2 top-0 z-20 select-none whitespace-nowrap rounded p-1 py-0.5 text-sm`}
                style={{
                  transform:
                    'translateY(-100%) translateY(-4px) translateX(50%)',
                }}
              >
                [{mapCoordinates.x}, {mapCoordinates.y}]
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MapGrid;
