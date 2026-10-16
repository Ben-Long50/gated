import { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiCancel,
  mdiContentSaveOutline,
  mdiGrid,
  mdiViewGridOutline,
  mdiViewGridPlusOutline,
} from '@mdi/js';
import { useParams, useSearchParams } from 'react-router-dom';
import useCreateMapMutation from 'src/hooks/useCreateMapMutation/useCreateMapMutation';
import Loading from '../../Loading';
import { Component } from '@gated/shared';
import MapBuilderSidebar from './MapBuilderSidebar';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import MapBuilderGrid from './MapBuilderGrid';
import TilePicker from './TilePicker';
import useMapForm from 'src/hooks/form hooks/useMapForm';
import IconBtnMedium from 'src/components/buttons/IconBtnMedium';
import useMapQuery from 'src/hooks/useMapQueries/useMapQuery';
import MapScaler from '../map/MapScaler';
import useCreateCodexMapMutation from 'src/hooks/useCreateCodexMapMutation/useCreateCodexMapMutation';
import { useNavigateWithQuery } from 'src/hooks/useNavigateWithQuery';
import useMapBuilderStore from 'src/stores/mapBuilderStore';
import { moveComponent } from './mapBuilderUtils/moveComponent';
import { findConflict } from './mapBuilderUtils/findConflict';
import Page from 'src/components/Page';

const MapBuilder = () => {
  const { mapId } = useParams();
  const navigate = useNavigateWithQuery();
  const [tempComponent, setTempComponent] = useState<Component | null>(null);
  const [dragging, setDragging] = useState(false);
  const [gridDisplay, setGridDisplay] = useState(false);
  const [mapScale, setMapScale] = useState(1);

  const [searchParams] = useSearchParams();

  const formType = searchParams.get('formType');

  const { data: map, isLoading } = useMapQuery(Number(mapId));

  const [quickTilePicker, setQuickTilePicker] = useState({
    open: false,
    enabled: false,
  });

  const path = useMapBuilderStore((state) => state.path);

  const isPng =
    path.length > 0 ? path[path.length - 1].endsWith('.png') : false;
  const pngPath = isPng ? path.join('/') : null;

  const loadManifest = useMapBuilderStore((state) => state.loadManifest);
  const activeLayerId = useMapBuilderStore((state) => state.activeLayerId);
  const setActiveLayerId = useMapBuilderStore(
    (state) => state.setActiveLayerId,
  );

  useEffect(() => {
    loadManifest();
    setActiveLayerId(map ? map.layers[0].id : 1);
  }, []);

  const createMap = useCreateMapMutation(Number(mapId));
  const createCodexMap = useCreateCodexMapMutation();

  const mapForm = useMapForm(
    formType === 'codex' ? createCodexMap : createMap,
    map,
  );

  const handleDragStart = (e) => {
    if (setTempComponent) {
      setDragging(true);
      const { active } = e;
      setTempComponent(active.data.current.component);
    }
  };

  const handleDragEnd = (e) => {
    if (!tempComponent) {
      return;
    }

    const conflict = findConflict(activeLayerId, tempComponent);

    if (conflict) {
      return;
    }

    setDragging(false);
    const { over, active } = e;

    if (setTempComponent) {
      if (!over) {
        setTempComponent(null);
        return;
      }

      moveComponent(
        mapForm,
        activeLayerId,
        active.data.current.component.id,
        tempComponent,
      );
      setTempComponent(null);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  if (isLoading) return <Loading />;

  return (
    <Page
      container={false}
      context={{
        form: mapForm,
        isPending: createMap.isPending,
      }}
    >
      <div
        className={`timing fixed inset-0 flex flex-col items-center justify-center bg-black`}
      >
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <MapBuilderGrid
            form={mapForm}
            gridDisplay={gridDisplay}
            mapScale={mapScale}
            dragging={dragging}
          />
        </DndContext>
        <MapBuilderSidebar form={mapForm} />
        <div
          className={`${quickTilePicker.open ? 'gap-4' : 'gap-0'} bg-base shadow-color timing absolute bottom-2 z-10 mx-auto flex flex-col items-center rounded-md p-4`}
          onMouseEnter={() => {
            if (quickTilePicker.enabled) {
              setQuickTilePicker((prev) => ({ ...prev, open: true }));
            }
          }}
          onMouseLeave={() => {
            if (quickTilePicker.enabled) {
              setQuickTilePicker((prev) => ({ ...prev, open: false }));
            }
          }}
        >
          {pngPath && (
            <div
              className={`${quickTilePicker.open ? 'max-h-[500px]' : 'max-h-0'} timing overflow-hidden`}
            >
              <TilePicker pngPath={pngPath} gridDisplay={gridDisplay} />
            </div>
          )}
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
              tooltip="Tile Picker"
              onClick={() => navigate('modal/tileList')}
            >
              <Icon path={mdiViewGridOutline} />
            </IconBtnMedium>
            <IconBtnMedium
              tooltip={
                quickTilePicker.enabled
                  ? 'Disable Quick Picker'
                  : 'Enable Quick Picker'
              }
              active={quickTilePicker.enabled}
              onClick={() =>
                setQuickTilePicker((prev) => ({
                  open: quickTilePicker.enabled ? false : true,
                  enabled: !prev.enabled,
                }))
              }
            >
              <Icon path={mdiViewGridPlusOutline} />
            </IconBtnMedium>
            {tempComponent && (
              <IconBtnMedium
                tooltip="Deselect Component"
                onClick={() => {
                  setTempComponent(null);
                }}
              >
                <Icon path={mdiCancel} />
              </IconBtnMedium>
            )}
            <IconBtnMedium
              onClick={() => {
                setActiveLayerId(null);
                setTempComponent(null);
                navigate('modal/save');
              }}
              tooltip="Save Map"
            >
              <Icon path={mdiContentSaveOutline} />
            </IconBtnMedium>
          </div>
        </div>
      </div>
    </Page>
  );
};
export default MapBuilder;
