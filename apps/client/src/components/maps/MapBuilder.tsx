import { useContext, useEffect, useRef, useState } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InputField from '../InputField';
import { useForm } from '@tanstack/react-form';
import Icon from '@mdi/react';
import {
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
import useNavigationStore from 'src/stores/navbarStore';
import { Component, Map, MapType } from 'src/types/map';
import MapGrid2 from './MapGrid2';
import MapLayerList from './MapLayerList';

const MapBuilder = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);

  const { campaignId, mapId } = useParams();
  const navigate = useNavigate();
  const [folders, setFolders] = useState({});
  const [currentFolder, setCurrentFolder] = useState({});
  const [path, setPath] = useState(['/assets', 'tiles']);
  const [tempComponent, setTempComponent] = useState<Component | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [mapDraft, setMapDraft] = useState(() =>
    localStorage.getItem('mapDraft')
      ? JSON.parse(localStorage.getItem('mapDraft'))
      : null,
  );

  const navbarHeight = useNavigationStore((state) => state.navbarHeight);

  const isPng = path[path.length - 1].endsWith('.png');
  const pngPath = isPng ? path.join('/') : null;

  const mapRef = useRef(null);
  const colorRef = useRef(null);

  const { data: map, isLoading } = useCampaignMapQuery(Number(mapId));

  const handeMouseMove = (e) => {
    setMousePosition({
      x: e.clientX - navbarHeight - 8,
      y: e.clientY - navbarHeight + 4,
    });
  };

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

  const mapForm = useForm<Partial<Map>>({
    defaultValues: {
      id: Number(mapId) || 0,
      type: map?.type || ('location' as MapType),
      draft: map?.draft ?? true,
      name: map?.name || '',
      description: map?.description || '',
      width: map?.width || defaultWidth,
      height: map?.height || defaultHeight,
      baseColor: map?.baseColor || 'black',
      layers: map?.layers || [
        {
          name: 'Layer 1',
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

  // const handleLayerReorder = (layout) => {
  //   if (dragging?.i === 'base') return;
  //   if (dragging?.i === dragover?.i) return;

  //   const newLayout = [...layout];

  //   const draggedIndex = newLayout.findIndex((item) => item.i === dragging?.i);
  //   const dragoverIndex = newLayout.findIndex((item) => item.i === dragover?.i);

  //   const [draggedItem] = newLayout.splice(draggedIndex, 1);
  //   newLayout.splice(dragoverIndex, 0, draggedItem);

  //   mapForm.setFieldValue('layout', newLayout);
  // };

  const autoSave = (layout) => {
    localStorage.setItem('mapDraft', JSON.stringify(layout));
    setMapDraft(layout);
  };

  // const handleTileDelete = (layout, item) => {
  //   if (item.i === 'base') return;
  //   const layoutCopy = [...layout];

  //   const newLayout = layoutCopy.filter((tile) => tile.i !== item.i);

  //   mapForm.setFieldValue('layout', newLayout);
  // };

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
            <div
              ref={mapRef}
              className="scrollbar-primary timing relative overflow-x-auto overflow-y-auto rounded border-2"
              style={{
                borderColor: accentPrimary,
              }}
            >
              <div
                className="absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${width}, 48px)`,
                  gridTemplateRows: `repeat(${height}, 48px)`,
                }}
                onMouseMove={handeMouseMove}
              >
                {Array.from({ length: width * height }).map(() => (
                  <div
                    className="size-12 border bg-transparent opacity-15"
                    style={{ borderColor: accentPrimary }}
                  />
                ))}
              </div>
              <mapForm.Field name="layers">
                {(field) => (
                  <MapGrid2
                    field={field}
                    width={width}
                    height={height}
                    baseColor={baseColor}
                    layers={field.state.value}
                    tempComponent={tempComponent}
                    getComponentStyle={getComponentStyle}
                  />
                )}
              </mapForm.Field>
            </div>
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
              <mapForm.Field
                name="width"
                listeners={{
                  onChange: ({ value }) => {
                    const layout = mapForm.getFieldValue('layout');
                    mapForm.setFieldValue(
                      'layout',
                      layout.map((item) =>
                        item.i === 'base' ? { ...item, w: value } : item,
                      ),
                    );
                  },
                }}
              >
                {(field) => (
                  <InputField field={field} type="number" label="Map Width" />
                )}
              </mapForm.Field>
              <mapForm.Field
                name="height"
                listeners={{
                  onChange: ({ value }) => {
                    const layout = mapForm.getFieldValue('layout');
                    mapForm.setFieldValue(
                      'layout',
                      layout.map((item) =>
                        item.i === 'base' ? { ...item, h: value } : item,
                      ),
                    );
                  },
                }}
              >
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
      <mapForm.Subscribe selector={(state) => state.values.layers}>
        {(layers) => <MapLayerList layers={layers} />}
      </mapForm.Subscribe>
    </>
  );
};
export default MapBuilder;
