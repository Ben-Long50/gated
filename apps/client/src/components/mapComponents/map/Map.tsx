import { useContext, useState } from 'react';
import useMap from 'src/hooks/useMap';
import Loading from '../../Loading';
import { mdiGrid } from '@mdi/js';
import Icon from '@mdi/react';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { useParams } from 'react-router-dom';
import MapSidebar from './MapSidebar';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import MapGrid from './MapGrid';
import CharacterToken from './CharacterToken';
import MapHeader from './MapHeader';

const Map = () => {
  const { mobile } = useContext(LayoutContext);
  const { mapId } = useParams();
  const [dragging, setDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [gridDisplay, setGridDisplay] = useState(true);
  const [mapScale, setMapScale] = useState(1);

  const { map, locations, mapLoading, locationsLoading } = useMap(
    Number(mapId),
  );

  const updateLocation = useUpdateCharacterLocationMutation(Number(mapId));

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

  if (mapLoading) return <Loading />;

  if (!map) return <h1>No Map Found</h1>;

  return (
    <div className="flex h-full w-full max-w-85dvw flex-col items-center gap-4 sm:gap-8">
      {!mobile && (
        <MapHeader
          mapName={map.name}
          gridDisplay={gridDisplay}
          setGridDisplay={setGridDisplay}
          mapScale={mapScale}
          setMapScale={setMapScale}
        />
      )}
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
        <MapSidebar locations={locations} locationsLoading={locationsLoading} />
        <DragOverlay dropAnimation={null}>
          {dragging && draggingId ? (
            <CharacterToken
              className="cursor-grabbing"
              characterId={draggingId}
              mapScale={mapScale}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Map;
