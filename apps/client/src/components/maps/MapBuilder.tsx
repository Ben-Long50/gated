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
  mdiDrag,
  mdiGrid,
  mdiLayers,
  mdiLayersRemove,
  mdiTrashCanOutline,
} from '@mdi/js';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useCreateMapMutation from 'src/hooks/useCreateMapMutation/useCreateMapMutation';
import { AuthContext } from 'src/contexts/AuthContext';
import ReactGridLayout from 'react-grid-layout';
import useCampaignMapQuery from 'src/hooks/useCampaignMapQuery/useCampaignMapQuery';
import Loading from '../Loading';
import { LayoutContext } from 'src/contexts/LayoutContext';
import Divider from '../Divider';
import ArrowHeader3 from '../ArrowHeader3';
import BtnIcon from '../buttons/BtnIcon';
import { capitalCase } from 'change-case';
import html2canvas from 'html2canvas';

const MapBuilder = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { mobile, layoutSize } = useContext(LayoutContext);

  const { campaignId, mapId } = useParams();
  const navigate = useNavigate();
  const [tileCounter, setTileCounter] = useState(0);
  const [folders, setFolders] = useState({});
  const [currentFolder, setCurrentFolder] = useState({});
  const [path, setPath] = useState(['/assets', 'tiles']);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [layerMode, setLayerMode] = useState(false);
  const [layerWidth, setLayerWidth] = useState(0);
  const [dragging, setDragging] = useState<{ i: string; index: number } | null>(
    null,
  );
  const [dragover, setDragover] = useState<{ i: string; index: number } | null>(
    null,
  );

  const [mapDraft, setMapDraft] = useState(() =>
    localStorage.getItem('mapDraft')
      ? JSON.parse(localStorage.getItem('mapDraft'))
      : null,
  );

  const mapRef = useRef(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef(null);

  const { data: map, isLoading } = useCampaignMapQuery(Number(mapId));

  const handleCounter = (layout) => {
    const lastCount =
      layout[layout.length - 1].i === 'base'
        ? 0
        : Number(layout[layout.length - 1].i) + 1;
    setTileCounter(lastCount);
  };

  useEffect(() => {
    if (map) {
      handleCounter(map.layout);
    }
  }, [map]);

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
      id: Number(mapId) || 0,
      type: map?.type || '',
      draft: map?.draft ?? true,
      name: map?.name || '',
      description: map?.description || '',
      width: map?.width || defaultWidth,
      height: map?.height || defaultHeight,
      baseColor: map?.baseColor || 'black',
      layout: map?.layout || [
        {
          static: true,
          i: 'base',
          x: 0,
          y: 0,
          w: defaultWidth,
          h: defaultHeight,
        },
      ],
      picture: null as null | File,
      publicId: map?.picture.publicId || '',
    },
    onSubmit: async ({ value }) => {
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

      Object.entries(value).forEach(([key, value]) => {
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

  const handleLayerReorder = (layout) => {
    if (dragging?.i === 'base') return;
    if (dragging?.i === dragover?.i) return;

    const newLayout = [...layout];

    const draggedIndex = newLayout.findIndex((item) => item.i === dragging?.i);
    const dragoverIndex = newLayout.findIndex((item) => item.i === dragover?.i);

    const [draggedItem] = newLayout.splice(draggedIndex, 1);
    newLayout.splice(dragoverIndex, 0, draggedItem);

    mapForm.setFieldValue('layout', newLayout);
  };

  const autoSave = (layout) => {
    localStorage.setItem('mapDraft', JSON.stringify(layout));
    setMapDraft(layout);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    scrollRef.current?.scrollBy({ left: e.deltaY * 4, behavior: 'auto' });
  };

  const handleTileDelete = (layout, item) => {
    if (item.i === 'base') return;
    const layoutCopy = [...layout];

    const newLayout = layoutCopy.filter((tile) => tile.i !== item.i);

    mapForm.setFieldValue('layout', newLayout);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div
        className={`timing flex h-full w-full max-w-9xl flex-col items-center gap-8`}
        style={{
          transform:
            layoutSize === 'xlarge'
              ? `translateX(-${layerWidth}px)`
              : undefined,
        }}
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
          {([color, width, height]) => (
            <div
              ref={mapRef}
              className="scrollbar-primary timing relative overflow-x-auto overflow-y-auto rounded border-2"
              style={{
                borderColor: accentPrimary,
                maxWidth: layerMode ? '75dvw' : '90dvw',
              }}
            >
              <div
                className="absolute inset-0 grid"
                style={{
                  gridTemplateColumns: `repeat(${width}, 48px)`,
                  gridTemplateRows: `repeat(${height}, 48px)`,
                }}
              >
                {Array.from({ length: width * height }).map(() => (
                  <div
                    className="size-12 border bg-transparent opacity-15"
                    style={{ borderColor: accentPrimary }}
                  />
                ))}
              </div>
              <mapForm.Field name="layout">
                {(field) => (
                  <ReactGridLayout
                    useCSSTransforms={false}
                    className="layout overflow-hidden shadow-lg shadow-black"
                    style={{ width: width * 48, height: height * 48 }}
                    layout={field.state.value}
                    cols={width}
                    rowHeight={48}
                    width={width * 48}
                    margin={[0, 0]}
                    resizeHandles={['se', 'nw']}
                    allowOverlap={true}
                    isDroppable={true}
                    isBounded={true}
                    onDragStart={(_, __, newItem) => {}}
                    onDrag={(_, __, item) => {}}
                    onDrop={(_, layoutItem, _event) => {
                      const path = _event.dataTransfer.getData('tileUrl');

                      const size = path.split('-');

                      const dimensions = {};

                      if (size[size.length - 1].includes('x')) {
                        const dims = size[size.length - 1].split('x');
                        dimensions.w = Number(dims[0].charAt(0));
                        dimensions.h = Number(dims[1].charAt(0));
                        dimensions.tileWidth = Number(dims[0].charAt(0));
                        dimensions.tileHeight = Number(dims[1].charAt(0));
                      }

                      const newItem = {
                        ...layoutItem,
                        i: tileCounter.toString(),
                        tileUrl: path,
                        ...dimensions,
                      };

                      field.handleChange((prev) => {
                        return [...prev, newItem];
                      });

                      setTileCounter((prev) => prev + 1);
                      autoSave(mapForm.store.state.values);
                    }}
                    onDragStop={(_, __, newItem) => {
                      field.handleChange((prev) =>
                        prev.map((item) =>
                          item.i === newItem.i
                            ? {
                                ...item,
                                w: newItem.w,
                                h: newItem.h,
                                x: newItem.x,
                                y: newItem.y,
                              }
                            : item,
                        ),
                      );
                      autoSave(mapForm.store.state.values);
                    }}
                    onResizeStop={(_, __, newItem) => {
                      field.handleChange((prev) =>
                        prev.map((item) =>
                          item.i === newItem.i
                            ? {
                                ...item,
                                w: newItem.w,
                                h: newItem.h,
                                x: newItem.x,
                                y: newItem.y,
                              }
                            : item,
                        ),
                      );
                      autoSave(mapForm.store.state.values);
                    }}
                  >
                    {field.state.value?.map((item) =>
                      item.i === 'base' ? (
                        <div
                          key={item.i}
                          className={`${item.className} -z-10`}
                          style={{ backgroundColor: color }}
                        />
                      ) : (
                        <div
                          key={item.i}
                          className={item.className}
                          style={{
                            backgroundPosition: '0 0',
                            imageRendering: 'pixelated',
                            backgroundSize: `${48 * item.tileWidth}px ${48 * item.tileHeight}px`,
                            backgroundImage: `url(${item.tileUrl})`,
                            boxShadow:
                              hoveredKey === item.i
                                ? `inset 0 0 0 4px ${accentPrimary}`
                                : dragover?.i === item.i
                                  ? `inset 0 0 0 4px white`
                                  : undefined,
                            zIndex: hoveredKey === item.i ? '10' : '0',
                          }}
                          onDoubleClick={() =>
                            handleTileDelete(field.state.value, item)
                          }
                        />
                      ),
                    )}
                  </ReactGridLayout>
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
                      mapForm.setFieldValue('layout', mapDraft.layout);
                      handleCounter(mapDraft.layout);
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
            {currentFolder.files && currentFolder.files.length > 0 && (
              <div
                ref={scrollRef}
                className="scrollbar-primary-2 col-span-3 flex w-full gap-2 overflow-x-auto rounded p-2"
                onWheel={handleWheel}
                style={{ overscrollBehavior: 'contain' }}
              >
                {currentFolder.files.map((file) => {
                  const tilePath = `${path.join('/')}/${file}`;

                  return (
                    <div
                      className={`sprite aspect-square size-24 rounded border-2 border-gray-600 hover:border-gray-200`}
                      style={{
                        backgroundImage: `url(${tilePath})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        imageRendering: 'pixelated',
                      }}
                      draggable={true}
                      onDragStart={(e) =>
                        e.dataTransfer.setData('tileUrl', tilePath)
                      }
                    />
                  );
                })}
              </div>
            )}
            <Outlet
              context={{
                form: mapForm,
                isPending: createMap.isPending,
                folders,
                currentFolder,
                setCurrentFolder,
                path,
                setPath,
              }}
            />
          </form>
        </ThemeContainer>
      </div>
      <button
        className={`${layerMode ? 'invisible translate-x-full opacity-0' : 'visible translate-x-0 opacity-100'} timing bg-tertiary group fixed right-8 top-[90px] mb-auto flex rounded p-1.5 shadow-md shadow-black`}
        aria-label="Open save modal"
        type="button"
        onClick={() => {
          setLayerMode(true);
          if (layerRef.current) {
            setLayerWidth(layerRef.current?.offsetWidth / 2);
          }
        }}
      >
        <Icon
          path={mdiLayers}
          className="text-tertiary group-hover:text-accent timing size-8"
        />
      </button>
      <div
        ref={layerRef}
        className={`${layerMode ? 'visible translate-x-0 px-4 opacity-100' : 'invisible translate-x-full opacity-0'} timing bg-primary fixed bottom-8 right-8 top-[90px] flex w-80 flex-col rounded py-4 shadow-lg shadow-black`}
      >
        <div className="flex items-center justify-between">
          <ArrowHeader3 className="whitespace-nowrap" title="Map Layers" />
          <button
            className={`bg-tertiary group flex rounded p-1.5 shadow-md shadow-black`}
            aria-label="Open save modal"
            type="button"
            onClick={() => {
              setLayerMode(false);
              if (layerRef.current) {
                setLayerWidth(0);
              }
            }}
          >
            <Icon
              path={mdiLayersRemove}
              className="text-tertiary group-hover:text-accent timing size-8"
            />
          </button>
        </div>
        <Divider />
        <mapForm.Subscribe selector={(state) => state.values.layout}>
          {(layout) => (
            <div className="scrollbar-primary-2 flex flex-col overflow-y-auto pb-2">
              {layout
                .slice()
                .reverse()
                .map((item, index) => {
                  let layerName = 'base';

                  if (item.tileUrl) {
                    const parts = item.tileUrl.split('/');
                    const fileName = parts[parts.length - 1];
                    const fileParts = fileName.split('.');

                    layerName = fileParts[0];
                  }

                  return (
                    <div
                      className="w-full"
                      onDragEnd={() => {
                        setDragging(null);
                        setDragover(null);
                      }}
                      onDragStart={() => setDragging({ i: item.i, index })}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragover({ i: item.i, index });
                      }}
                      onDrop={() => handleLayerReorder(layout)}
                    >
                      {dragging &&
                        dragover &&
                        dragging?.index > dragover?.index &&
                        dragover?.i === item.i && (
                          <hr className={'border-accent border-2'} />
                        )}
                      <div
                        className={`timing text-secondary hover:bg-secondary timing hover:!text-accent flex cursor-grab select-none items-center gap-4 rounded p-2 hover:shadow-md hover:shadow-black`}
                        onMouseEnter={() => setHoveredKey(item.i)}
                        onMouseLeave={() => setHoveredKey(null)}
                        draggable={true}
                      >
                        <Icon path={mdiDrag} className="size-7" />
                        <h4 className="grow whitespace-nowrap !text-inherit">
                          {capitalCase(layerName)}
                        </h4>
                        <h4 className="!text-inherit">{index + 1}</h4>
                        <BtnIcon
                          path={mdiTrashCanOutline}
                          active={true}
                          onClick={() => handleTileDelete(layout, item)}
                        />
                      </div>
                      {dragging &&
                        dragover &&
                        dragging?.index < dragover?.index &&
                        dragover?.i === item.i && (
                          <hr className={'border-accent border-2'} />
                        )}
                    </div>
                  );
                })}
            </div>
          )}
        </mapForm.Subscribe>
      </div>
    </>
  );
};
export default MapBuilder;
