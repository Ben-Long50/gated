import { useContext, useEffect, useRef, useState } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InputField from '../InputField';
import { useForm } from '@tanstack/react-form';
import '/src/styles/mapStyles.css';
import Icon from '@mdi/react';
import {
  mdiContentSaveCheckOutline,
  mdiContentSaveMinusOutline,
  mdiContentSaveOffOutline,
  mdiContentSaveOutline,
  mdiDrag,
  mdiGrid,
  mdiLayersEdit,
  mdiLayersOff,
  mdiTrashCanOutline,
} from '@mdi/js';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useCreateMapMutation from 'src/hooks/useCreateMapMutation/useCreateMapMutation';
import { AuthContext } from 'src/contexts/AuthContext';
import ReactGridLayout from 'react-grid-layout';
import useCampaignMapQuery from 'src/hooks/useCampaignMapQuery/useCampaignMapQuery';
import Loading from '../Loading';
import Tile from './Tile';
import { LayoutContext } from 'src/contexts/LayoutContext';
import Divider from '../Divider';
import ArrowHeader3 from '../ArrowHeader3';
import BtnIcon from '../buttons/BtnIcon';

const MapBuilder = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);
  const { apiUrl } = useContext(AuthContext);
  const { campaignId, mapId } = useParams();
  const navigate = useNavigate();
  const [tileCounter, setTileCounter] = useState(0);
  const [folders, setFolders] = useState({});
  const [currentFolder, setCurrentFolder] = useState({});
  const [path, setPath] = useState(['/assets', 'tiles']);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [layerMode, setLayerMode] = useState(false);
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
  const colorRef = useRef(null);

  const { data: map, isLoading } = useCampaignMapQuery(
    apiUrl,
    Number(campaignId),
    Number(mapId),
  );

  useEffect(() => {
    if (map) {
      setTileCounter(Number(map.layout[map.layout.length - 1].i) + 1);
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

  const createMap = useCreateMapMutation(
    apiUrl,
    Number(campaignId),
    Number(mapId),
  );

  const defaultWidth = map?.width ?? 24;
  const defaultHeight = map?.height ?? 14;

  const mapForm = useForm({
    defaultValues: {
      id: Number(mapId) || null,
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
    },
    onSubmit: ({ value }) => {
      console.log(value);
      createMap.mutate(value);
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
    scrollRef.current?.scrollBy({
      left: e.deltaY * 4,
      behavior: 'auto',
    });
  };

  const handleTileDelete = (layout, item) => {
    if (item.i === 'base') return;
    const layoutCopy = [...layout];

    console.log(item);

    const newLayout = layoutCopy.filter((tile) => tile.i !== item.i);

    mapForm.setFieldValue('layout', newLayout);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="grid h-full w-full grid-cols-[1fr_auto]">
      <div className="mx-auto flex h-full w-full max-w-8xl flex-col items-center gap-8">
        <div className="flex w-full items-center justify-between">
          <button
            className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
            aria-label="Load autosaved map"
            type="button"
            onClick={() => {
              if (mapDraft) {
                mapForm.setFieldValue('name', mapDraft.name);
                mapForm.setFieldValue('type', mapDraft.type);
                mapForm.setFieldValue('draft', mapDraft.draft);
                mapForm.setFieldValue('description', mapDraft.description);
                mapForm.setFieldValue('width', mapDraft.width);
                mapForm.setFieldValue('height', mapDraft.height);
                mapForm.setFieldValue('baseColor', mapDraft.baseColor);
                mapForm.setFieldValue('layout', mapDraft.layout);
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
          <h1 className="w-full text-center">
            {map ? `Edit ${map?.name}` : 'Create Map'}
          </h1>
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
        </div>
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
              className="scrollbar-primary relative max-w-full overflow-x-auto overflow-y-auto rounded border-2"
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
                      setTileCounter((prev) => Number(prev) + 1);
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
                          className={item.className}
                          style={{
                            backgroundColor: color,
                          }}
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
                            zIndex: hoveredKey === item.i ? '20' : '0',
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
          className="!sticky bottom-[33px] mt-auto w-full"
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
                className="bg-tertiary scrollbar-primary col-span-3 flex w-full gap-2 overflow-x-auto rounded p-2"
                onWheel={handleWheel}
              >
                {currentFolder.files.map((file) => {
                  const tilePath = `${path.join('/')}/${file}`;

                  return (
                    <div
                      className={`sprite aspect-square size-24 rounded hover:border-2 hover:border-gray-200`}
                      style={{
                        backgroundImage: `url(${tilePath})`,
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
      <div className="items-starts flex max-h-[1000px] justify-start gap-4">
        <button
          className={`${layerMode ? 'invisible opacity-0' : 'visible opacity-100'} timing bg-tertiary group mb-auto flex rounded p-1.5 shadow-md shadow-black`}
          aria-label="Open save modal"
          type="button"
          onClick={() => setLayerMode(true)}
        >
          <Icon
            path={mdiLayersEdit}
            className="text-tertiary group-hover:text-accent timing size-8"
          />
        </button>
        <div
          className={`${layerMode ? 'visible w-80 px-4 opacity-100' : 'invisible w-0 opacity-0'} timing bg-primary flex flex-col rounded py-4 shadow-lg shadow-black`}
        >
          <div className="flex items-center justify-between">
            <ArrowHeader3 className="whitespace-nowrap" title="Map Layers" />
            <button
              className={`bg-tertiary group flex rounded p-1.5 shadow-md shadow-black`}
              aria-label="Open save modal"
              type="button"
              onClick={() => setLayerMode(false)}
            >
              <Icon
                path={mdiLayersOff}
                className="text-tertiary group-hover:text-accent timing size-8"
              />
            </button>
          </div>
          <Divider />
          <mapForm.Subscribe selector={(state) => state.values.layout}>
            {(layout) => (
              <div className="scrollbar-primary-2 flex flex-col gap-2 overflow-y-auto">
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
                            {layerName}
                          </h4>
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
      </div>
    </div>
  );
};
export default MapBuilder;
