import { useEffect, useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiCancel,
  mdiContentSaveOutline,
  mdiGrid,
  mdiViewGridOutline,
  mdiViewGridPlusOutline,
} from '@mdi/js';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useCreateMapMutation from 'src/hooks/useCreateMapMutation/useCreateMapMutation';
import Loading from '../../Loading';
import { Component, Layer } from 'src/types/map';
import MapBuilderSidebar from './MapBuilderSidebar';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import MapBuilderGrid from './MapBuilderGrid';
import getOccupiedTiles from '../mapUtils/getOccupiedTiles';
import TilePicker from './TilePicker';
import useMapForm from 'src/hooks/form hooks/useMapForm';
import IconBtnMedium from 'src/components/buttons/IconBtnMedium';
import useMapQuery from 'src/hooks/useMapQueries/useMapQuery';
import MapScaler from '../map/MapScaler';

const MapBuilder = () => {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const [folders, setFolders] = useState({});
  const [currentFolder, setCurrentFolder] = useState({});
  const [path, setPath] = useState(['/assets', 'tiles']);
  const [tempComponent, setTempComponent] = useState<Component | null>(null);
  const [dragging, setDragging] = useState(false);
  const [gridDisplay, setGridDisplay] = useState(false);
  const [mapScale, setMapScale] = useState(1);

  const { data: map, isLoading } = useMapQuery(Number(mapId));

  const [activeLayerId, setActiveLayerId] = useState<number | null>(() =>
    map ? map.layers[0].id : 1,
  );
  const [previewLayerId, setPreviewLayerId] = useState<number | null>(null);
  const [activeComponentId, setActiveComponentId] = useState<number | null>(
    null,
  );
  const [quickTilePicker, setQuickTilePicker] = useState({
    open: false,
    enabled: false,
  });

  const isPng = path[path.length - 1].endsWith('.png');
  const pngPath = isPng ? path.join('/') : null;

  useEffect(() => {
    const length = Object.values(folders).length;

    const fetchFolders = async () => {
      const fullPath = path.filter(Boolean).join('/');

      const response = await fetch(`${fullPath}.json`);
      const data = await response.json();

      setFolders(data);
      setCurrentFolder(data);
    };

    if (length === 0) {
      fetchFolders();
    } else {
      let f = folders;
      for (const part of path) {
        if (
          isPng ||
          part === 'favorites' ||
          part === 'components' ||
          part === '/assets' ||
          part === 'tiles'
        ) {
          continue;
        } else {
          f = f[part];
        }
      }
      setCurrentFolder(f);
    }
  }, [path]);

  const createMap = useCreateMapMutation(Number(mapId));

  const mapForm = useMapForm(createMap, map);

  const handleAddLayer = () => {
    const currentLayers = mapForm.getFieldValue('layers');
    const nextLayerNumber = mapForm.getFieldValue('layerCount') + 1;

    if (Array.isArray(currentLayers)) {
      mapForm.setFieldValue('layers', [
        ...currentLayers,
        {
          name: `Layer ${nextLayerNumber}`,
          id: nextLayerNumber,
          hidden: false,
          componentCount: 0,
          components: [],
        },
      ]);

      mapForm.setFieldValue('layerCount', nextLayerNumber);
      setActiveLayerId(nextLayerNumber);
    }
  };

  const handleDeleteLayer = (id: number) => {
    const currentLayers = mapForm.getFieldValue('layers');
    if (currentLayers.length < 2) {
      return;
    }

    const newLayers = currentLayers.filter((layer) => layer.id !== id);

    mapForm.setFieldValue('layers', newLayers);
  };

  const handleHiddenLayer = (id: number) => {
    const currentLayers = mapForm.getFieldValue('layers');

    const layer = currentLayers.find((layer: Layer) => layer.id === id);

    if (!layer) {
      return;
    }

    const newLayer = {
      ...layer,
      hidden: !layer.hidden,
    };

    const newLayers = currentLayers.map((layer: Layer) => {
      if (layer.id === id) {
        return newLayer;
      } else {
        return layer;
      }
    });

    mapForm.setFieldValue('layers', newLayers);
  };

  const handleEditLayerName = (id: number, newName: string) => {
    const currentLayers = mapForm.getFieldValue('layers');
    const newLayers = currentLayers.map((layer) => {
      if (layer.id === id) {
        return { ...layer, name: newName };
      } else {
        return layer;
      }
    });

    mapForm.setFieldValue('layers', newLayers);
  };

  const handleEditComponentName = (
    layerId: number,
    componentId: number,
    newName: string,
  ) => {
    const currentLayers = mapForm.getFieldValue('layers');

    const newLayers = currentLayers.map((layer) => {
      if (layer.id === layerId) {
        return {
          ...layer,
          components: layer?.components.map((component) =>
            component.id === componentId
              ? { ...component, name: newName }
              : component,
          ),
        };
      } else {
        return layer;
      }
    });

    mapForm.setFieldValue('layers', newLayers);
  };

  const handleDeleteComponent = (
    e: MouseEvent | undefined,
    id: number | undefined,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => {
    const layer = layers.find((layer: Layer) => layer.id === activeLayerId);
    let newComponents = [] as Component[];

    if (!layer) {
      return;
    }

    if (id) {
      newComponents = layer.components.filter(
        (component) => component.id !== id,
      );
    } else if (e) {
      const components = document
        .elementsFromPoint(e.clientX, e.clientY)
        .filter(
          (el) =>
            el instanceof HTMLDivElement &&
            el.dataset.layer === `layer ${activeLayerId}`,
        )
        .map((component) => component.id);

      newComponents = layer.components.filter(
        (component) => !components.includes(`component ${component.id}`),
      );
    } else {
      return;
    }

    const newLayer = {
      ...layer,
      components: newComponents,
    };

    const newLayers = layers.map((layer: Layer) => {
      if (layer.id === activeLayerId) {
        return newLayer;
      } else {
        return layer;
      }
    }) as Layer[];

    if (callback) {
      callback(newLayers);
    } else {
      mapForm.setFieldValue('layers', newLayers);
    }
  };

  const handleLayerReorder = (
    oldIndex: number,
    newIndex: number,
    callback: (layers: Layer[]) => void,
  ) => {
    if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') {
      return;
    }

    const layers = mapForm.getFieldValue('layers');

    const [item] = layers.splice(oldIndex, 1);
    layers.splice(newIndex, 0, item);

    if (callback) {
      callback(layers);
    } else {
      mapForm.setFieldValue('layers', layers);
    }
  };

  const handleTileSelect = (row: number, col: number) => {
    if (pngPath) {
      if (
        !tempComponent ||
        tempComponent.width > 1 ||
        tempComponent.height > 1
      ) {
        setTempComponent({
          name: 'Temp Component',
          id: 0,
          imageUrl: pngPath,
          width: 1,
          height: 1,
          imageColStart: col,
          imageRowStart: row,
          mapColStart: 1,
          mapRowStart: 1,
          subComponents: [],
        });
      } else if (
        tempComponent &&
        tempComponent.height === 1 &&
        tempComponent.width === 1 &&
        tempComponent.imageColStart === col &&
        tempComponent.imageRowStart === row
      ) {
        setTempComponent(null);
      } else {
        setTempComponent((prev) => {
          if (!prev) {
            return null;
          }

          const newTempComponent = { ...prev };

          if (!prev.imageColStart || !prev.imageRowStart) {
            newTempComponent.width = 1;
            newTempComponent.height = 1;
            newTempComponent.imageColStart = col;
            newTempComponent.imageRowStart = row;
          } else {
            if (col > newTempComponent.imageColStart) {
              newTempComponent.width = col - prev.imageColStart + 1;
            } else {
              newTempComponent.width = prev?.imageColStart - col + 1;
              newTempComponent.imageColStart = col;
            }
            if (row > newTempComponent.imageRowStart) {
              newTempComponent.height = row - prev.imageRowStart + 1;
            } else {
              newTempComponent.height = prev?.imageRowStart - row + 1;
              newTempComponent.imageRowStart = row;
            }
          }

          return newTempComponent;
        });
      }
    }
  };

  const handleAddComponent = (
    component: Component,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => {
    const conflict = findConflict(component);

    if (conflict) {
      return;
    }

    const layer = layers.find((layer: Layer) => layer.id === activeLayerId);

    if (!layer || (!component?.imageUrl && !component.subComponents.length)) {
      return;
    }

    const nextComponentNumber = layer.componentCount + 1;

    const newLayer: Layer = {
      ...layer,
      componentCount: nextComponentNumber,
      components: [
        ...layer.components,
        {
          ...component,
          name: `Component ${nextComponentNumber}`,
          id: nextComponentNumber,
        },
      ],
    };

    const newLayers = layers.map((layer: Layer) => {
      if (layer.id === activeLayerId) {
        return newLayer;
      } else {
        return layer;
      }
    });

    callback(newLayers);
  };

  const findConflict = (component: Component) => {
    if (!component) {
      return;
    }

    const tiles = getOccupiedTiles(component);

    const layer = document.getElementById(`layer ${activeLayerId}`);

    if (!layer) {
      return;
    }

    const componentTiles = Array.from(layer.children)
      .filter(
        (child) =>
          child.id &&
          child instanceof HTMLDivElement &&
          child.id !== `component ${component.id}`,
      )
      .flatMap((component) => JSON.parse(component.dataset.tiles.split(',')));

    const conflict = tiles.some((tile) =>
      componentTiles.some(
        (compTile) => compTile.row === tile.row && compTile.col === tile.col,
      ),
    );

    return conflict;
  };

  const handleDragStart = (e) => {
    if (setTempComponent) {
      setDragging(true);
      const { active } = e;
      setTempComponent(active.data.current.component);
    }
  };

  const moveComponent = (componentId: number, tempComponent: Component) => {
    const layers = mapForm.getFieldValue('layers');

    const newLayers = layers.map((layer) => {
      if (layer.id === activeLayerId) {
        return {
          ...layer,
          components: layer.components.map((component) => {
            if (component.id === componentId) {
              return {
                ...component,
                mapColStart: tempComponent.mapColStart,
                mapRowStart: tempComponent.mapRowStart,
              };
            } else {
              return component;
            }
          }),
        };
      } else {
        return layer;
      }
    });

    mapForm.setFieldValue('layers', newLayers);
  };

  const handleDragEnd = (e) => {
    if (!tempComponent) {
      return;
    }

    const conflict = findConflict(tempComponent);

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

      moveComponent(active.data.current.component.id, tempComponent);
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
    <>
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
            findConflict={findConflict}
            activeLayerId={activeLayerId}
            activeComponentId={activeComponentId}
            previewLayerId={previewLayerId}
            setActiveComponentId={setActiveComponentId}
            tempComponent={tempComponent}
            setTempComponent={setTempComponent}
            handleAddComponent={handleAddComponent}
            handleDeleteComponent={handleDeleteComponent}
          />
        </DndContext>
        <MapBuilderSidebar
          form={mapForm}
          activeLayerId={activeLayerId}
          setActiveLayerId={setActiveLayerId}
          setPreviewLayerId={setPreviewLayerId}
          setActiveComponentId={setActiveComponentId}
          setTempComponent={setTempComponent}
          handleAddLayer={handleAddLayer}
          handleDeleteLayer={handleDeleteLayer}
          handleEditLayerName={handleEditLayerName}
          handleHiddenLayer={handleHiddenLayer}
          handleEditComponentName={handleEditComponentName}
          handleDeleteComponent={handleDeleteComponent}
          handleLayerReorder={handleLayerReorder}
        />
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
              <TilePicker
                pngPath={pngPath}
                tempComponent={tempComponent}
                handleTileSelect={handleTileSelect}
              />
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
              onClick={() => navigate('tileList')}
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
                navigate('save');
              }}
              tooltip="Save Map"
            >
              <Icon path={mdiContentSaveOutline} />
            </IconBtnMedium>
          </div>
        </div>
      </div>
      <Outlet
        context={{
          form: mapForm,
          isPending: createMap.isPending,
          currentFolder,
          setCurrentFolder,
          path,
          setPath,
          isPng,
          pngPath,
          handleTileSelect,
          tempComponent,
          setTempComponent,
        }}
      />
    </>
  );
};
export default MapBuilder;
