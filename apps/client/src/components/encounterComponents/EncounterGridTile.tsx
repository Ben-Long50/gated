import { useContext, useMemo } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import CharacterEncounterToken from './CharacterEncounterToken';
import { useStore } from '@tanstack/react-form';
import { Location } from 'src/types/map';
import Icon from '@mdi/react';
import { mdiCircleDouble, mdiClose } from '@mdi/js';
import { useDroppable } from '@dnd-kit/core';
import useCombatStore from 'src/stores/combatStore';
import useCharacter from 'src/hooks/useCharacter';
import { EncounterContext } from 'src/contexts/EncounterContext';
import isInRange from './encounterUtils/isInRange';

const EncounterGridTile = ({
  row,
  col,
  height,
  gridDisplay,
  characterLocations,
  activeCoordinates,
  hoveredCoords,
  setHoveredCoords,
}: {
  row: number;
  col: number;
  height: number;
  gridDisplay: boolean;
  characterLocations: Location[];
  activeCoordinates: { row: number; col: number } | null;
  hoveredCoords: { row: number | null; col: number | null };
  setHoveredCoords: ({
    row,
    col,
  }: {
    row: number | null;
    col: number | null;
  }) => void;
}) => {
  const { accentPrimary, statColorMap } = useContext(ThemeContext);
  const { activeCharacter, actionForm } = useContext(EncounterContext);

  const { filteredCharacter: character } = useCharacter(activeCharacter?.id);

  const active = hoveredCoords.row === row && hoveredCoords.col === col;

  const tempRange = useCombatStore((state) => state.range);
  const tempRangeColor = useCombatStore((state) => state.rangeColor);
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
      rangeColor = tempRangeColor || 'transparent';
      break;
  }

  const range = useMemo(() => {
    return tempRange
      ? tempRange
      : action?.actionSubtypes?.includes('movement')
        ? action?.modifiers?.speed
          ? character?.stats.speed + action?.modifiers?.speed
          : character?.stats.speed
        : item?.stats.range;
  }, [tempRange]);

  const inRange = useMemo(() => {
    return activeCoordinates
      ? isInRange(activeCoordinates, { row, col }, range)
      : false;
  }, [activeCoordinates, range]);

  const { isOver, setNodeRef } = useDroppable({
    id: `row ${row}, col ${col}`,
    data: { row, col, inRange },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${gridDisplay && 'border'} relative z-10 flex size-12 items-center justify-center`}
      style={{
        borderColor: `${accentPrimary}80`,
        transition: 'background 0.2s ease',
        background: inRange
          ? `radial-gradient(circle, transparent, 75%, ${rangeColor})`
          : active && characterLocations.length === 0
            ? `radial-gradient(circle, transparent, 75%, ${accentPrimary})`
            : 'transparent',
      }}
      onMouseEnter={() => setHoveredCoords({ row, col })}
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
          />
        ))}
      {active && (
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
