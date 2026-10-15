import { useState } from 'react';
import useMap from 'src/hooks/useMap';
import Loading from '../../Loading';
import { mdiGrid, mdiSquareEditOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useNavigate, useParams } from 'react-router-dom';
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
import IconBtnMedium from 'src/components/buttons/IconBtnMedium';
import MapScaler from './MapScaler';
import ArrowHeader3 from 'src/components/ArrowHeader3';
import Page from 'src/components/Page';

const MapPage = () => {
  const { mapId } = useParams();
  const [dragging, setDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [gridDisplay, setGridDisplay] = useState(false);
  const [mapScale, setMapScale] = useState(1);
  const navigate = useNavigate();

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
    <Page container={false}>
      <div className="fixed inset-0 flex h-full w-full flex-col items-center justify-center gap-4 sm:gap-8">
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
          <MapSidebar
            locations={locations}
            locationsLoading={locationsLoading}
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
        </DndContext>
        <div
          className={`bg-base shadow-color timing absolute bottom-2 z-10 mx-auto flex items-center justify-between gap-8 rounded-md p-4`}
        >
          <ArrowHeader3 title={map.name} />
          <div className={`flex w-full items-center justify-center gap-4`}>
            <IconBtnMedium
              tooltip={gridDisplay ? 'Hide Grid' : 'Show Grid'}
              onClick={() => setGridDisplay((prev) => !prev)}
              active={gridDisplay}
            >
              <Icon path={mdiGrid} />
            </IconBtnMedium>
            <MapScaler mapScale={mapScale} setMapScale={setMapScale} />

            <IconBtnMedium
              onClick={() => {
                navigate(`update`);
              }}
              tooltip="Edit Map"
            >
              <Icon path={mdiSquareEditOutline} />
            </IconBtnMedium>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default MapPage;
