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
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import MapGrid from './MapGrid';

const Map = () => {
  const { mobile } = useContext(LayoutContext);
  const { mapId } = useParams();

  const [gridDisplay, setGridDisplay] = useState(true);

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
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;

    if (!active.data.current || !over?.data.current) {
      return;
    }

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
    <div className="flex w-full max-w-85dvw flex-col items-center gap-4 sm:gap-8">
      {!mobile && (
        <div className="flex w-full max-w-4xl items-center justify-center gap-8">
          <button
            className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
            aria-label="Open save modal"
            type="button"
            onClick={() => setGridDisplay((prev) => !prev)}
          >
            <Icon
              path={mdiGrid}
              className={`${gridDisplay ? 'text-accent' : 'text-tertiary'} group-hover:text-accent timing size-8`}
            />
          </button>
          <h1 className="text-center">{map.name}</h1>
        </div>
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
          locations={locations}
          gridDisplay={gridDisplay}
        />
        <MapSidebar locations={locations} locationsLoading={locationsLoading} />
      </DndContext>
    </div>
  );
};

export default Map;
