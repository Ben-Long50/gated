import { useContext, useMemo, useRef, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Location, Map } from 'src/types/map';
import useCombatStore from 'src/stores/combatStore';
import { FormApi, useStore } from '@tanstack/react-form';
import Xarrow from 'react-xarrows';
import EncounterGridTile from './EncounterGridTile';
import { DndContext } from '@dnd-kit/core';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import { useParams } from 'react-router-dom';
import useActions from 'src/hooks/useActions';
import Loading from '../Loading';
import { EncounterContext } from 'src/contexts/EncounterContext';

const MapGrid = ({
  map,
  locations,
  gridDisplay,
  setActionSidebar,
  isDown,
}: {
  map: Map;
  locations: Location[];
  gridDisplay: boolean;
  setActionSidebar: (value: boolean) => void;
  isDown?: boolean;
}) => {
  const { statColorMap } = useContext(ThemeContext);
  const { combat, activeCharacter, actionForm, rolls } =
    useContext(EncounterContext);
  const { mapId } = useParams();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const gridLength = map.width * map.height;

  const getCoordinates = (index: number) => {
    return {
      x:
        map.width -
          (map.width - Math.ceil((index + 1 + map.width) % map.width)) ||
        map.width,
      y: Math.ceil(index / map.width),
    };
  };

  const { filteredActions: actions, isLoading: actionsLoading } = useActions(
    undefined,
    'action',
  );

  const target = useCombatStore((state) => state.target);

  const actionTarget = useStore(
    actionForm.store,
    (state) => state.values.target,
  );

  const arrowActive = activeCharacter?.id;
  const arrowTarget = actionTarget?.id || target;

  const updateCharacterLocation = useUpdateCharacterLocationMutation(
    Number(mapId),
  );

  const activeCoordinates = useMemo(
    () =>
      activeCharacter?.id
        ? getCoordinates(
            locations.find(
              (location) => location.characterId === activeCharacter.id,
            )?.index || 0,
          )
        : null,
    [activeCharacter, locations],
  );

  const handleDragEnd = (e: Event) => {
    const { over, active } = e;

    setActionSidebar(false);
    if (
      over.data.current.index !== active.data.current.index &&
      combat.combatPhase === 'action'
    ) {
      if (over.data.current.inRange) {
        actionForm.setFieldValue('locationId', active.data.current.locationId);
        actionForm.setFieldValue('index', over.data.current.index);
        actionForm.handleSubmit();
      } else {
        alert('Not in range');
      }
    } else {
      console.log('Action cancelled');
    }
  };

  const handleDragStart = () => {
    setActionSidebar(true);
    const selectedAction = actionForm.getFieldValue('action') || null;

    actionForm.setFieldValue('actionType', 'movement');
    if (actions && !selectedAction) {
      actionForm.setFieldValue(
        'action',
        actions.find((action) => action.name === 'Basic Movement'),
      );
    }
  };

  if (actionsLoading) return <Loading />;

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${map.width}, 48px)`,
          gridTemplateRows: `repeat(${map.height}, 48px)`,
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {arrowActive && arrowTarget && (
          <Xarrow
            zIndex={20}
            animateDrawing={0.3}
            start={arrowActive.toString()}
            end={arrowTarget?.toString()}
            path="straight"
            color={statColorMap.DMG}
            startAnchor="middle"
            endAnchor="middle"
            showTail={true}
            tailSize={3}
            headSize={5}
            headShape="arrow1"
            tailShape="circle"
          />
        )}
        {Array.from({ length: gridLength }).map((_, index) => {
          const characterLocations =
            locations.filter((location) => location.index === index) || [];
          return (
            <EncounterGridTile
              key={index}
              index={index}
              gridDisplay={gridDisplay}
              characterLocations={characterLocations}
              getCoordinates={getCoordinates}
              activeCoordinates={activeCoordinates}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              rolls={rolls}
              isDown={isDown}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default MapGrid;
