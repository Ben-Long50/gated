import { useContext, useEffect, useRef, useState } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InputField from '../InputField';
import { useForm } from '@tanstack/react-form';
import Icon from '@mdi/react';
import {
  mdiCancel,
  mdiContentSaveCheckOutline,
  mdiContentSaveMinusOutline,
  mdiContentSaveOffOutline,
  mdiContentSaveOutline,
  mdiGrid,
} from '@mdi/js';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useCreateMapMutation from 'src/hooks/useCreateMapMutation/useCreateMapMutation';
import useCampaignMapQuery from 'src/hooks/useCampaignMapQuery/useCampaignMapQuery';
import Loading from '../Loading';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { Component, Layer, MapType } from 'src/types/map';
import MapGrid2 from './MapGrid2';
import MapSidebar from './MapSidebar';

const MapBuilder = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);

  const { campaignId, mapId } = useParams();
  const navigate = useNavigate();
  const [folders, setFolders] = useState({});
  const [currentFolder, setCurrentFolder] = useState({});
  const [path, setPath] = useState(['/assets', 'tiles']);
  const [tempComponent, setTempComponent] = useState<Component | null>(null);

  const { data: map, isLoading } = useCampaignMapQuery(Number(mapId));

  const [activeLayerId, setActiveLayerId] = useState(() =>
    map ? map.layers[0].id : 1,
  );
  const [activeComponentId, setActiveComponentId] = useState<number | null>(
    null,
  );

  const [mapDraft, setMapDraft] = useState(() =>
    localStorage.getItem('mapDraft')
      ? JSON.parse(localStorage.getItem('mapDraft'))
      : null,
  );

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
      type: map?.type || ('location' as MapType),
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

      // if (mapRef.current) {
      //   const canvas = await html2canvas(mapRef.current);

      //   const blob = await new Promise<Blob | null>((resolve) => {
      //     canvas.toBlob((blob) => resolve(blob), 'image/png');
      //   });

      //   if (!blob) return;

      //   const fileName = value.name.split(' ').join('_').toLowerCase();

      //   const file = new File([blob], `${fileName}.png`, { type: 'image/png' });
      //   value.picture = file;
      // }

      // const formData = new FormData();

      // Object.entries(value).forEach(([key, value]) => {
      //   if (key === 'picture' && value instanceof File) {
      //     formData.append(key, value);
      //   } else {
      //     formData.append(key, JSON.stringify(value));
      //   }
      // });

      // createMap.mutate(formData);
      // localStorage.removeItem('mapDraft');
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

  const getOccupiedTiles = (component: Component) => {
    const tiles = [];

    for (
      let col = component.mapColStart;
      col < component.mapColStart + component.width;
      col++
    ) {
      for (
        let row = component.mapRowStart;
        row < component.mapRowStart + component.height;
        row++
      ) {
        tiles.push({ col, row });
      }
    }

    return tiles;
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
      .filter((child) => child.id && child instanceof HTMLDivElement)
      .flatMap((component) => JSON.parse(component.dataset.tiles.split(',')));

    const conflict = tiles.some((tile) =>
      componentTiles.some(
        (compTile) => compTile.row === tile.row && compTile.col === tile.col,
      ),
    );

    return conflict;
  };

  const handleAddComponent = (
    component: Component,
    row: number,
    col: number,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => {
    const conflict = findConflict(component);

    if (conflict) {
      return;
    }

    const layer = layers.find((layer: Layer) => layer.id === activeLayerId);

    if (!layer || !component?.imageUrl) {
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
          mapRowStart: row,
          mapColStart: col,
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

  const getComponentStyle = (component: Component) => {
    return {
      backgroundImage: `url(${component.imageUrl})`,
      backgroundPosition: `-${(component.imageColStart - 1) * 48}px -${(component.imageRowStart - 1) * 48}px`,
      imageRendering: 'pixelated',
      backgroundRepeat: 'no-repeat',
      gridColumnStart: component.mapColStart,
      gridRowStart: component.mapRowStart,
      gridColumnEnd: component.mapColStart + component.width,
      gridRowEnd: component.mapRowStart + component.height,
    };
  };

  const handleTileSelect = (row: number, col: number) => {
    if (pngPath) {
      if (!tempComponent) {
        setTempComponent({
          name: 'Temp Component',
          id: 0,
          imageUrl: pngPath,
          width: 1,
          height: 1,
          imageColStart: col,
          imageRowStart: row,
          mapColStart: 0,
          mapRowStart: 0,
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
        setTempComponent((prev) => ({
          ...prev,
          width: col - prev.imageColStart + 1,
          height: row - prev.imageRowStart + 1,
        }));
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div
        className={`timing flex h-full w-full max-w-9xl flex-col items-center gap-8`}
      >
        <h1 className="w-full text-center">
          {map ? `Edit ${map?.name}` : 'Create Map'}
        </h1>

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
                <MapGrid2
                  ref={mapRef}
                  field={field}
                  width={width}
                  height={height}
                  baseColor={baseColor}
                  layers={field.state.value}
                  activeLayerId={activeLayerId}
                  activeComponentId={activeComponentId}
                  tempComponent={tempComponent}
                  setTempComponent={setTempComponent}
                  getComponentStyle={getComponentStyle}
                  handleAddComponent={handleAddComponent}
                  handleDeleteComponent={handleDeleteComponent}
                  getOccupiedTiles={getOccupiedTiles}
                  findConflict={findConflict}
                />
              )}
            </mapForm.Field>
          )}
        </mapForm.Subscribe>
        <ThemeContainer
          className="!sticky bottom-[33px] z-10 mt-auto w-full"
          borderColor={accentPrimary}
          chamfer="medium"
        >
          <form
            className="flex flex-col gap-6 p-6"
            onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              mapForm.handleSubmit();
            }}
          >
            <div className="flex items-center gap-4">
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
              <div className="ml-auto flex items-center gap-4">
                <mapForm.Field name="baseColor">
                  {(field) => (
                    <div className="flex items-center gap-4">
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
                  onClick={() => navigate('save')}
                >
                  <Icon
                    path={mdiContentSaveOutline}
                    className="text-tertiary group-hover:text-accent timing size-8"
                  />
                </button>
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
                  aria-label="Open save modal"
                  type="button"
                  onClick={() => navigate('tileList')}
                >
                  <Icon
                    path={mdiGrid}
                    className="text-tertiary group-hover:text-accent timing size-8"
                  />
                </button>
              </div>
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
        </ThemeContainer>
      </div>
      <mapForm.Field name="layers">
        {(field) => (
          <MapSidebar
            field={field}
            layers={field.state.value}
            activeLayerId={activeLayerId}
            setActiveLayerId={setActiveLayerId}
            setActiveComponentId={setActiveComponentId}
            handleAddLayer={handleAddLayer}
            handleDeleteLayer={handleDeleteLayer}
            handleEditLayerName={handleEditLayerName}
            handleHiddenLayer={handleHiddenLayer}
            handleEditComponentName={handleEditComponentName}
            handleDeleteComponent={handleDeleteComponent}
            handleLayerReorder={handleLayerReorder}
          />
        )}
      </mapForm.Field>
    </>
  );
};
export default MapBuilder;
