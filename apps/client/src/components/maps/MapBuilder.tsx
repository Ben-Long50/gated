import { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  mdiFloppy,
  mdiGrid,
} from '@mdi/js';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useCreateMapMutation from 'src/hooks/useCreateMapMutation/useCreateMapMutation';
import { AuthContext } from 'src/contexts/AuthContext';
import ReactGridLayout from 'react-grid-layout';
import useCampaignMapQuery from 'src/hooks/useCampaignMapQuery/useCampaignMapQuery';
import Loading from '../Loading';
import Tile from './Tile';
import InputSelectField from '../InputSelectField';
import { LayoutContext } from 'src/contexts/LayoutContext';

const tiles = import.meta.glob('/src/assets/tiles/*/*/*.png', { eager: true });

const MapBuilder = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);
  const { apiUrl } = useContext(AuthContext);
  const { campaignId, mapId } = useParams();
  const navigate = useNavigate();
  const [tileCounter, setTileCounter] = useState(0);
  const [resizeMode, setResizeMode] = useState<'extending' | 'repeating'>(
    'repeating',
  );

  // const [zoom, setZoom] = useState(1);
  // const [transformOrigin, setTransformOrigin] = useState('center center');

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
      setTileCounter(Number(map.layout[map.layout.length - 1].i + 1));
    }
  }, [map]);

  const createMap = useCreateMapMutation(
    apiUrl,
    Number(campaignId),
    Number(mapId),
  );

  const defaultWidth = map?.width ?? 24;
  const defaultHeight = map?.height ?? 14;

  const tileForm = useForm({
    defaultValues: {
      category: '',
      type: '',
    },
    onSubmit: ({ value }) => {
      console.log(value);
      createMap.mutate(value);
      localStorage.removeItem('mapDraft');
    },
  });

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

  if (isLoading) return <Loading />;

  return (
    <div className="flex h-full w-full max-w-8xl flex-col items-center gap-8">
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
            // onWheel={(e) => {
            //   e.stopPropagation();
            //   const rect = mapRef.current?.getBoundingClientRect();
            //   const offsetX = e.clientX - rect.left;
            //   const offsetY = e.clientY - rect.top;

            //   let x = offsetX;
            //   let y = offsetY;

            //   if (offsetX < 0) {
            //     x = 0;
            //   } else if (offsetX > mapRef.current?.offsetWidth) {
            //     x = mapRef.current?.offsetWidth;
            //   }

            //   if (offsetY < 0) {
            //     y = 0;
            //   } else if (offsetY > mapRef.current?.offsetWidth) {
            //     y = mapRef.current?.offsetWidth;
            //   }

            //   setZoom((prev) => {
            //     if (zoom >= 1) {
            //       if (e.deltaY < 0) {
            //         return prev + 0.25;
            //       } else if (e.deltaY > 0 && zoom > 1) {
            //         return prev - 0.25;
            //       }
            //     }
            //     return prev;
            //   });
            //   setTransformOrigin(`${x}px ${y}px`);
            // }}
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
            <div
              style={
                {
                  // transform: `scale(${zoom})`,
                  // transformOrigin: transformOrigin,
                }
              }
            >
              <mapForm.Field name="layout">
                {(field) => (
                  <ReactGridLayout
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
                    onDrop={(_, layoutItem, _event) => {
                      const path = _event.dataTransfer.getData('tileUrl');

                      const newItem = {
                        ...layoutItem,
                        i: tileCounter.toString(),
                        tileUrl: path,
                        resizeMode: resizeMode,
                      };

                      field.handleChange((prev) => {
                        return [...prev, newItem];
                      });
                      setTileCounter((prev) => prev + 1);
                      autoSave(mapForm.store.state.values);
                    }}
                    onResizeStop={(_, __, newItem) => {
                      field.handleChange((prev) =>
                        prev.map((item) =>
                          item.i === newItem.i ? { ...item, ...newItem } : item,
                        ),
                      );
                      autoSave(mapForm.store.state.values);
                    }}
                    onDragStop={(_, __, newItem) => {
                      field.handleChange((prev) =>
                        prev.map((item) =>
                          item.i === newItem.i ? { ...item, ...newItem } : item,
                        ),
                      );
                      autoSave(mapForm.store.state.values);
                    }}
                  >
                    {field.state.value?.map((item) =>
                      item.i === 'base' ? (
                        <Tile
                          key={item.i}
                          className={`${item.classNames} -z-10`}
                          style={{ backgroundColor: color }}
                          tileWidth={width}
                          tileHeight={height}
                          tileSize={48}
                        />
                      ) : (
                        <Tile
                          key={item.i}
                          className={`${item.classNames}`}
                          tileWidth={item.w}
                          tileHeight={item.h}
                          tileSize={48}
                          tileUrl={item.tileUrl}
                          resizeMode={item.resizeMode}
                          onDoubleClick={() =>
                            field.handleChange((prev) =>
                              prev.filter((prevItem) => prevItem.i !== item.i),
                            )
                          }
                        />
                      ),
                    )}
                  </ReactGridLayout>
                )}
              </mapForm.Field>
            </div>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
            <InputSelectField
              label="Resize Mode"
              initialValue={resizeMode}
              options={['extending', 'repeating']}
              onChange={(option: 'extending' | 'repeating') =>
                setResizeMode(option)
              }
            />
            <div className="flex items-center gap-4">
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
                  path={mdiFloppy}
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
          <tileForm.Subscribe
            selector={(state) => [state.values.category, state.values.type]}
          >
            {([category, type]) => {
              const tilePaths = Object.entries(tiles)
                .filter(([path]) => path.includes(`/tiles/${category}/${type}`))
                .map(([, mod]: any) => mod.default);

              return (
                tilePaths.length > 0 && (
                  <div
                    ref={scrollRef}
                    className="bg-tertiary scrollbar-primary col-span-3 flex w-full gap-2 overflow-x-auto rounded p-2"
                    onWheel={handleWheel}
                  >
                    {tilePaths.map((path) => (
                      <div
                        className={`sprite aspect-square size-24 rounded hover:border-2 hover:border-gray-200`}
                        style={{ backgroundImage: `url(${path})` }}
                        draggable={true}
                        onDragStart={(e) =>
                          e.dataTransfer.setData('tileUrl', path)
                        }
                      />
                    ))}
                  </div>
                )
              );
            }}
          </tileForm.Subscribe>
          <Outlet
            context={{
              form: mapForm,
              tileForm,
            }}
          />
        </form>
      </ThemeContainer>
    </div>
  );
};
export default MapBuilder;
