import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import CharacterEncounterToken from './CharacterEncounterToken';
import { FormApi, useStore } from '@tanstack/react-form';
import { Location } from 'src/types/map';
import Icon from '@mdi/react';
import { mdiCircleDouble, mdiClose } from '@mdi/js';
import { useDroppable } from '@dnd-kit/core';
import useCombatStore from 'src/stores/combatStore';
import useCharacter from 'src/hooks/useCharacter';
import { EncounterContext } from 'src/contexts/EncounterContext';

const EncounterGridTile = ({
  index,
  gridDisplay,
  characterLocations,
  getCoordinates,
  activeCoordinates,
  hoveredIndex,
  setHoveredIndex,
  isDown,
}: {
  index: number;
  gridDisplay: boolean;
  characterLocations: Location[];
  getCoordinates: (index: number) => { x: number; y: number };
  activeCoordinates: { x: number; y: number };
  hoveredIndex: number;
  setHoveredIndex: (index: number) => void;
  isDown?: boolean;
}) => {
  const { accentPrimary, statColorMap } = useContext(ThemeContext);
  const { activeCharacter, actionForm } = useContext(EncounterContext);

  const { filteredCharacter: character } = useCharacter(activeCharacter.id);

  const mapCoordinates = getCoordinates(index);

  const isInRange = (
    currentCoordinates: { x: number; y: number },
    mapCoordinates: { x: number; y: number },
    range: number,
  ) => {
    if (!range) return null;
    const dx = mapCoordinates.x - currentCoordinates.x;
    const dy = mapCoordinates.y - currentCoordinates.y;

    const distance =
      range === 1
        ? Math.max(Math.abs(dx), Math.abs(dy))
        : Math.sqrt(dx * dx + dy * dy);
    return distance <= range;
  };

  const tempItem = useCombatStore((state) => state.item);
  const tempRange = useCombatStore((state) => state.range);
  const item = useStore(actionForm.store, (state) => state.values.item);
  const action = useStore(actionForm.store, (state) => state.values.action);
  const actionType = useStore(
    actionForm.store,
    (state) => state.values.actionType,
  );

  let rangeColor;

  switch (actionType) {
    case 'attack':
      rangeColor = statColorMap.DMG;
      break;
    case 'movement':
      rangeColor = statColorMap.SPD;
      break;
    default:
      rangeColor = 'transparent';
      break;
  }

  const range = tempRange
    ? tempRange
    : action?.actionSubtypes?.includes('movement')
      ? action?.modifiers?.speed
        ? character?.stats.speed + action?.modifiers?.speed
        : character?.stats.speed
      : item?.stats.range;

  const inRange = isInRange(activeCoordinates, mapCoordinates, range);

  const { isOver, setNodeRef } = useDroppable({
    id: `${index}`,
    data: { index, inRange },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${gridDisplay && 'border'} relative flex size-12 items-center justify-center`}
      style={{
        borderColor: `${accentPrimary}80`,
        transition: 'background 0.2s ease',
        background:
          isDown === false
            ? inRange
              ? `radial-gradient(circle, transparent, 75%, ${rangeColor})`
              : hoveredIndex === index && characterLocations.length === 0
                ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
                : 'transparent'
            : '',
      }}
      onMouseEnter={() => setHoveredIndex(index)}
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
            onClick={() =>
              isInRange(
                activeCoordinates,
                getCoordinates(location.index),
                range,
              )
            }
          />
        ))}
      {hoveredIndex === index && isDown === false && (
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

export default EncounterGridTile;
