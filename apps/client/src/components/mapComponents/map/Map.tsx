import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import MapGrid from './MapGrid';
import CharacterToken from './CharacterToken';
import MapSidebar from './MapSidebar';
import useMap from 'src/hooks/useMap';
import Loading from 'src/components/Loading';

const Map = ({
  mapId,
  sidebar,
  mapScale,
  gridDisplay,
}: {
  mapId: number;
  sidebar: boolean;
  mapScale: number;
  gridDisplay: boolean;
}) => {
  const [dragging, setDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const { map, locations, mapLoading, locationsLoading } = useMap(mapId);
  const updateLocation = useUpdateCharacterLocationMutation(map?.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const onDragStart = (e: DragStartEvent) => {
    const { active } = e;
    if (!active.data.current) {
      return;
    }
    setDragging(true);
    setDraggingId(active.data.current.characterId);
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;

    if (!active.data.current || !over?.data.current) {
      return;
    }
    setDragging(false);
    updateLocation.mutate({
      characterId: active.data.current.characterId,
      locationId: active.data.current.locationId,
      row: over.data.current.row,
      col: over.data.current.col,
    });
  };

  if (mapLoading) {
    return <Loading />;
  }

  if (!map) {
    <p>No map found</p>;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <MapGrid
        width={map.width}
        height={map.height}
        baseColor={map.baseColor}
        layers={map.layers}
        mapScale={mapScale}
        locations={locations}
        gridDisplay={gridDisplay}
      />
      <DragOverlay dropAnimation={null}>
        {dragging && draggingId ? (
          <CharacterToken
            className="cursor-grabbing"
            characterId={draggingId}
            mapScale={mapScale}
          />
        ) : null}
      </DragOverlay>
      {sidebar && (
        <MapSidebar
          mapId={mapId}
          locations={locations}
          locationsLoading={locationsLoading}
        />
      )}
    </DndContext>
  );
};

export default Map;
