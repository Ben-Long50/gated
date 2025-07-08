import { useContext, useEffect, useRef, useState } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InputField from '../InputField';
import { useForm } from '@tanstack/react-form';
import '/src/styles/mapStyles.css';
import Icon from '@mdi/react';
import {
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiFloppy,
} from '@mdi/js';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useCreateMapMutation from 'src/hooks/useCreateMapMutation/useCreateMapMutation';
import { AuthContext } from 'src/contexts/AuthContext';
import ReactGridLayout from 'react-grid-layout';
import useCampaignMapQuery from 'src/hooks/useCampaignMapQuery/useCampaignMapQuery';
import Loading from '../Loading';
import BtnAuth from '../buttons/BtnAuth';

const MapBuilder = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { apiUrl } = useContext(AuthContext);
  const { campaignId, mapId } = useParams();
  const navigate = useNavigate();
  const [tileType, setTileType] = useState('');
  const [tileCounter, setTileCounter] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState('center center');
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

  if (isLoading) return <Loading />;

  return (
    <div className="flex h-full w-full max-w-7xl flex-col items-center gap-8">
      <div className="grid w-full grid-cols-3">
        <BtnAuth
          className="flex items-center gap-4"
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
          <p>Load Autosave</p>
          {mapDraft ? (
            <Icon path={mdiCheckCircleOutline} className="size-6" />
          ) : (
            <Icon path={mdiCloseCircleOutline} className="size-6" />
          )}
        </BtnAuth>
        <h1 className="w-full text-center">
          {map ? `Edit ${map?.name}` : 'Create Map'}
        </h1>
        <BtnAuth
          onClick={() => {
            localStorage.removeItem('mapDraft');
            setMapDraft(null);
            mapForm.reset();
          }}
        >
          Clear Autosave
        </BtnAuth>
      </div>
      <div
        ref={mapRef}
        className="relative overflow-hidden rounded border-2"
        style={{ borderColor: accentPrimary }}
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
        <mapForm.Subscribe
          selector={(state) => [
            state.values.baseColor,
            state.values.width,
            state.values.height,
          ]}
        >
          {([color, width, height]) => (
            <>
              <div className="absolute inset-0 grid grid-cols-[repeat(auto-fit,_48px)]">
                {Array.from({ length: width * height }).map(() => (
                  <div
                    className="size-12 border bg-transparent opacity-15"
                    style={{ borderColor: accentPrimary }}
                  />
                ))}
              </div>
              <div
                style={{
                  // transform: `scale(${zoom})`,
                  transformOrigin: transformOrigin,
                }}
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
                        const newItem = {
                          ...layoutItem,
                          i: tileCounter.toString(),
                          classNames: `tile ${tileType}`,
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
                            item.i === newItem.i
                              ? { ...item, ...newItem }
                              : item,
                          ),
                        );
                        autoSave(mapForm.store.state.values);
                      }}
                      onDragStop={(_, __, newItem) => {
                        field.handleChange((prev) =>
                          prev.map((item) =>
                            item.i === newItem.i
                              ? { ...item, ...newItem }
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
                            className={`${item.classNames} -z-10`}
                            style={{ backgroundColor: color }}
                          />
                        ) : (
                          <div
                            key={item.i}
                            className={`${item.classNames}`}
                            onDoubleClick={() =>
                              field.handleChange((prev) =>
                                prev.filter(
                                  (prevItem) => prevItem.i !== item.i,
                                ),
                              )
                            }
                          />
                        ),
                      )}
                    </ReactGridLayout>
                  )}
                </mapForm.Field>
              </div>
            </>
          )}
        </mapForm.Subscribe>
      </div>
      <ThemeContainer
        className="!sticky bottom-[33px] mt-auto w-full"
        borderColor={accentPrimary}
        chamfer="medium"
      >
        <form
          className="flex flex-col gap-4 p-6"
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            mapForm.handleSubmit();
          }}
        >
          <div className="flex gap-4">
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
            <mapForm.Field name="baseColor">
              {(field) => (
                <div className="ml-auto flex items-center gap-4">
                  <h4 className="text-tertiary">Base Color</h4>
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
          </div>
          <div className="bg-tertiary col-span-3 grid w-full grid-cols-[repeat(auto-fit,_minmax(40px,_80px))] gap-1.5 p-1">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                className={`tile-${index + 1} sprite aspect-square size-full hover:ring-1 hover:ring-inset hover:ring-white`}
                draggable={true}
                onDragStart={() => setTileType(`tile-${index + 1} one-one`)}
              />
            ))}
            <div
              className={`stair-left sprite aspect-square size-full hover:ring-1 hover:ring-inset hover:ring-white`}
              draggable={true}
              onDragStart={() => setTileType(`stair-left three-four`)}
            />
            <div
              className={`stair-right sprite aspect-square size-full hover:ring-1 hover:ring-inset hover:ring-white`}
              draggable={true}
              onDragStart={() => setTileType(`stair-right three-four`)}
            />
          </div>
          <Outlet context={{ form: mapForm }} />
        </form>
      </ThemeContainer>
    </div>
  );
};
export default MapBuilder;
