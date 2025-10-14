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

const MapGrid = ({
  form,
  reactions,
  encounterPermissions,
  map,
  locations,
  activeCharacterId,
  gridDisplay,
  rolls,
}: {
  form: FormApi;
  reactions: number[];
  encounterPermissions: boolean;
  map: Map;
  locations: Location[];
  activeCharacterId: number;
  gridDisplay: boolean;
  rolls: MapIterator<[]>;
}) => {
  const { statColorMap } = useContext(ThemeContext);
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

  const target = useCombatStore((state) => state.target);

  const actionTarget = useStore(form.store, (state) => state.values.target);

  const arrowActive = activeCharacterId;
  const arrowTarget = actionTarget?.id || target;

  const updateCharacterLocation = useUpdateCharacterLocationMutation(
    Number(mapId),
  );

  const activeCoordinates = useMemo(
    () =>
      activeCharacterId
        ? getCoordinates(
            locations.find(
              (location) => location.characterId === activeCharacterId,
            )?.index || 0,
          )
        : null,
    [activeCharacterId, locations],
  );

  function handleDragEnd(e) {
    const { over, active } = e;

    if (over.data.current.inRange) {
      updateCharacterLocation.mutate({
        characterId: active.data.current.characterId,
        locationId: active.data.current.locationId,
        index: over.data.current.index,
      });
    } else {
      alert('Not in range');
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
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
              form={form}
              index={index}
              gridDisplay={gridDisplay}
              characterLocations={characterLocations}
              reactions={reactions}
              encounterPermissions={encounterPermissions}
              activeCharacterId={activeCharacterId}
              getCoordinates={getCoordinates}
              activeCoordinates={activeCoordinates}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
              rolls={rolls}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default MapGrid;
