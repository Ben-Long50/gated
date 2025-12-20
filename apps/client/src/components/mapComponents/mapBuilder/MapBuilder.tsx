import { useContext, useEffect, useRef, useState } from 'react';
import InputField from '../../InputField';
import { useForm } from '@tanstack/react-form';
import Icon from '@mdi/react';
import {
  mdiCancel,
  mdiContentSaveCheckOutline,
  mdiContentSaveMinusOutline,
  mdiContentSaveOffOutline,
  mdiContentSaveOutline,
  mdiGrid,
  mdiLayersOffOutline,
} from '@mdi/js';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useCreateMapMutation from 'src/hooks/useCreateMapMutation/useCreateMapMutation';
import useCampaignMapQuery from 'src/hooks/useCampaignMapQuery/useCampaignMapQuery';
import Loading from '../../Loading';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { Component, Layer, MapType } from 'src/types/map';
import html2canvas from 'html2canvas';
import MapBuilderSidebar from './MapBuilderSidebar';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import MapBuilderGrid from './MapBuilderGrid';
import getOccupiedTiles from '../mapUtils/getOccupiedTiles';
import MapHeader from '../map/MapHeader';
import TilePicker from './TilePicker';
import ArrowHeader4 from 'src/components/ArrowHeader4';
import { capitalCase } from 'change-case';

const MapBuilder = () => {
  const { mobile } = useContext(LayoutContext);

  const { campaignId, mapId } = useParams();
  const navigate = useNavigate();
  const [folders, setFolders] = useState({});
  const [currentFolder, setCurrentFolder] = useState({});
  const [path, setPath] = useState(['/assets', 'tiles']);
  const [tempComponent, setTempComponent] = useState<Component | null>(null);
  const [dragging, setDragging] = useState(false);
  const [gridDisplay, setGridDisplay] = useState(true);
  const [mapScale, setMapScale] = useState(1);

  const { data: map, isLoading } = useCampaignMapQuery(Number(mapId));

  const [activeLayerId, setActiveLayerId] = useState<number | null>(() =>
    map ? map.layers[0].id : 1,
  );
  const [previewLayerId, setPreviewLayerId] = useState<number | null>(null);
  const [activeComponentId, setActiveComponentId] = useState<number | null>(
    null,
  );

  const [mapDraft, setMapDraft] = useState(() =>
    localStorage.getItem('mapDraft')
      ? JSON.parse(localStorage.getItem('mapDraft'))
      : null,
  );

  const pngName = path[path.length - 1].split('.')[0];

  const isPng = path[path.length - 1].endsWith('.png');
  const pngPath = isPng ? path.join('/') : null;

  const mapRef = useRef(null);
  const colorRef = useRef(null);

  useEffect(() => {
    const fetchFolders = async () => {
      const response = await fetch('/assets/tiles.json');
      const data = await response.json();
      setFolders(data);
      setCurrentFolder(data);
    };

    fetchFolders();
  }, []);

  const createMap = useCreateMapMutation(Number(campaignId), Number(mapId));

  const defaultWidth = map?.width ?? 24;
  const defaultHeight = map?.height ?? 14;

  const mapForm = useForm({
    defaultValues: {
      id: map?.id || null,
      type: map?.type || ('map' as MapType),
      draft: map?.draft ?? true,
      name: map?.name || '',
      description: map?.description || '',
      width: map?.width || defaultWidth,
      height: map?.height || defaultHeight,
      baseColor: map?.baseColor || 'black',
      layerCount: map?.layerCount || 1,
      layers: map?.layers || [
        {
          name: 'Layer 1',
          id: 1,
          hidden: false,
          componentCount: 0,
          components: [],
        },
      ],
      picture: null as null | File,
      publicId: map?.picture.publicId || '',
    },
    onSubmit: async ({ value }) => {
      console.log(value);

      if (mapRef.current) {
        const canvas = await html2canvas(mapRef.current);

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((blob) => resolve(blob), 'image/png');
        });

        if (!blob) return;

        const fileName = value.name.split(' ').join('_').toLowerCase();

        const file = new File([blob], `${fileName}.png`, { type: 'image/png' });
        value.picture = file;
      }

      const formData = new FormData();

      const { publicId, ...data } = value;

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'picture' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      });

      createMap.mutate(formData);
      localStorage.removeItem('mapDraft');
    },
  });

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

  const autoSave = () => {
    const currentLayers = mapForm.getFieldValue('layers');
    localStorage.setItem('mapDraft', JSON.stringify(currentLayers));
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
        className={`timing flex h-full w-full flex-col items-center gap-8 pr-16`}
      >
        {!mobile && (
          <MapHeader
            mapName="Create Map"
            gridDisplay={gridDisplay}
            setGridDisplay={setGridDisplay}
            mapScale={mapScale}
            setMapScale={setMapScale}
          />
        )}
        <mapForm.Subscribe
          selector={(state) => [
            state.values.baseColor,
            state.values.width,
            state.values.height,
          ]}
        >
          {([baseColor, width, height]) => (
            <mapForm.Field name="layers">
              {(field) => (
                <DndContext
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                >
                  <MapBuilderGrid
                    ref={mapRef}
                    field={field}
                    width={width}
                    height={height}
                    baseColor={baseColor}
                    layers={field.state.value}
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
              )}
            </mapForm.Field>
          )}
        </mapForm.Subscribe>
      </div>
      <mapForm.Field name="layers">
        {(field) => (
          <MapBuilderSidebar
            field={field}
            layers={field.state.value}
            activeLayerId={activeLayerId}
            setActiveLayerId={setActiveLayerId}
            setPreviewLayerId={setPreviewLayerId}
            setActiveComponentId={setActiveComponentId}
            handleAddLayer={handleAddLayer}
            handleDeleteLayer={handleDeleteLayer}
            handleEditLayerName={handleEditLayerName}
            handleHiddenLayer={handleHiddenLayer}
            handleEditComponentName={handleEditComponentName}
            handleDeleteComponent={handleDeleteComponent}
            handleLayerReorder={handleLayerReorder}
          >
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                mapForm.handleSubmit();
              }}
            >
              <mapForm.Field name="width">
                {(field) => (
                  <InputField field={field} type="number" label="Map Width" />
                )}
              </mapForm.Field>
              <mapForm.Field name="height">
                {(field) => (
                  <InputField field={field} type="number" label="Map Height" />
                )}
              </mapForm.Field>
              <mapForm.Field name="baseColor">
                {(field) => (
                  <div className="flex items-center justify-between gap-4">
                    {!mobile && <h4 className="text-tertiary">Base Color</h4>}
                    <label
                      className="shadow-color size-10 shrink-0 cursor-pointer rounded-full shadow-md"
                      style={{ backgroundColor: field.state.value }}
                      htmlFor="baseColor"
                      onClick={() => colorRef.current?.focus()}
                    >
                      <input
                        ref={colorRef}
                        className="size-0"
                        id="baseColor"
                        name="baseColor"
                        type="color"
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </label>
                  </div>
                )}
              </mapForm.Field>
              <div className="mr-auto flex items-center gap-4">
                <button
                  className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
                  aria-label="Open save modal"
                  type="button"
                  onClick={() => {
                    setTempComponent(null);
                    navigate('tileList');
                  }}
                >
                  <Icon
                    path={mdiGrid}
                    className="text-tertiary group-hover:text-accent timing size-8"
                  />
                </button>
                {activeLayerId && (
                  <button
                    className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
                    aria-label="Clear active layer"
                    type="button"
                    onClick={() => {
                      setActiveLayerId(null);
                      setTempComponent(null);
                    }}
                  >
                    <Icon
                      path={mdiLayersOffOutline}
                      className="text-tertiary group-hover:text-accent timing size-8"
                    />
                  </button>
                )}
                {tempComponent && (
                  <button
                    className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
                    aria-label="Clear temporary component"
                    type="button"
                    onClick={() => {
                      setTempComponent(null);
                    }}
                  >
                    <Icon
                      path={mdiCancel}
                      className="text-tertiary group-hover:text-accent timing size-8"
                    />
                  </button>
                )}
                <button
                  className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
                  aria-label="Load autosaved map"
                  type="button"
                  onClick={() => {
                    if (mapDraft) {
                      mapForm.setFieldValue('name', mapDraft.name);
                      mapForm.setFieldValue('type', mapDraft.type);
                      mapForm.setFieldValue('draft', mapDraft.draft);
                      mapForm.setFieldValue(
                        'description',
                        mapDraft.description,
                      );
                      mapForm.setFieldValue('width', mapDraft.width);
                      mapForm.setFieldValue('height', mapDraft.height);
                      mapForm.setFieldValue('baseColor', mapDraft.baseColor);
                      mapForm.setFieldValue('layers', mapDraft.layers);
                    }
                  }}
                >
                  {mapDraft ? (
                    <Icon
                      path={mdiContentSaveCheckOutline}
                      className="text-tertiary group-hover:text-accent timing size-8"
                    />
                  ) : (
                    <Icon
                      path={mdiContentSaveOffOutline}
                      className="text-tertiary group-hover:text-accent timing size-8"
                    />
                  )}
                </button>

                <button
                  className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
                  aria-label="Clear autosaved map"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('mapDraft');
                    setMapDraft(null);
                    mapForm.reset();
                  }}
                >
                  <Icon
                    path={mdiContentSaveMinusOutline}
                    className="text-tertiary group-hover:text-accent timing size-8"
                  />
                </button>
                <button
                  className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
                  aria-label="Open save modal"
                  type="button"
                  onClick={() => {
                    setActiveLayerId(null);
                    setTempComponent(null);
                    navigate('save');
                  }}
                >
                  <Icon
                    path={mdiContentSaveOutline}
                    className="text-tertiary group-hover:text-accent timing size-8"
                  />
                </button>
              </div>
              <Outlet
                context={{
                  form: mapForm,
                  isPending: createMap.isPending,
                  folders,
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
            </form>
          </MapBuilderSidebar>
        )}
      </mapForm.Field>
      {pngPath && (
        <div className="bg-primary timing absolute bottom-4 left-4 flex origin-bottom-left scale-50 flex-col items-start gap-4 rounded-md p-4 shadow-md shadow-black hover:scale-100">
          <ArrowHeader4 className="text-primary" title={capitalCase(pngName)} />
          <TilePicker
            pngPath={pngPath}
            tempComponent={tempComponent}
            handleTileSelect={handleTileSelect}
          />
        </div>
      )}
    </>
  );
};
export default MapBuilder;
