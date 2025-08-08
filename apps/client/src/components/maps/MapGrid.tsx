import { useState } from 'react';
import { Location, Map } from 'src/types/map';
import { DndContext } from '@dnd-kit/core';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import { useParams } from 'react-router-dom';
import MapGridTile from './MapGridTile';

const MapGrid = ({
  map,
  locations,
  gridDisplay,
  form,
}: {
  map: Map;
  locations: Location[];
  gridDisplay: boolean;
  form?: FormApi;
}) => {
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

  const updateCharacterLocation = useUpdateCharacterLocationMutation(
    Number(mapId),
  );

  function handleDragEnd(e) {
    const { over, active } = e;

    const activeEncounter = map.encounters.some(
      (encounter) => encounter.active === true,
    );

    if (!activeEncounter) {
      updateCharacterLocation.mutate({
        characterId: active.data.current.characterId,
        locationId: active.data.current.locationId,
        index: over.data.current.index,
      });
    } else {
      alert(
        'You may not move characters on a map while an active encounter is being resolved',
      );
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
        onClick={() => {
          if (form) {
            form.setFieldValue('index', hoveredIndex);
            form.handleSubmit();
          }
        }}
      >
        {Array.from({ length: gridLength }).map((_, index) => {
          const characterLocations =
            locations.filter((location) => location.index === index) || [];

          return (
            <MapGridTile
              key={index}
              index={index}
              gridDisplay={gridDisplay}
              characterLocations={characterLocations}
              getCoordinates={getCoordinates}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
            />
          );
        })}
      </div>
    </DndContext>
  );
};

export default MapGrid;
