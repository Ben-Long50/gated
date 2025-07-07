import { useContext, useRef, useState } from 'react';
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

  const createMap = useCreateMapMutation(
    apiUrl,
    Number(campaignId),
    Number(mapId),
  );

  const mapForm = useForm({
    defaultValues: {
      id: Number(mapId) || null,
      type: map?.type || '',
      draft: map?.draft || true,
      name: map?.name || '',
      description: map?.description || '',
      width: map?.width || 25,
      baseColor: map?.baseColor || '#000000',
      layout: map?.layout || [
        {
          i: '0',
          x: 0,
          y: 0,
          w: 1,
          h: 1,
        },
      ],
    },
    onSubmit: ({ value }) => {
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
        <h1 className="w-full text-center">{map?.name || 'Create Map'}</h1>
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
        className="flex flex-col items-center gap-8 overflow-hidden rounded border-2 border-gray-400 border-opacity-50 bg-gray-400 bg-opacity-40 p-4"
        // style={{ transform: ' rotateX(45deg) rotateZ(45deg)' }}
        onWheel={(e) => {
          e.stopPropagation();
          const rect = mapRef.current?.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const offsetY = e.clientY - rect.top;

          let x = offsetX;
          let y = offsetY;

          if (offsetX < 0) {
            x = 0;
          } else if (offsetX > mapRef.current?.offsetWidth) {
            x = mapRef.current?.offsetWidth;
          }

          if (offsetY < 0) {
            y = 0;
          } else if (offsetY > mapRef.current?.offsetWidth) {
            y = mapRef.current?.offsetWidth;
          }

          setZoom((prev) => {
            if (zoom >= 1) {
              if (e.deltaY < 0) {
                return prev + 0.25;
              } else if (e.deltaY > 0 && zoom > 1) {
                return prev - 0.25;
              }
            }
            return prev;
          });
          setTransformOrigin(`${x}px ${y}px`);
        }}
      >
        <div
          style={{
            // transform: `scale(${zoom})`,
            transformOrigin: transformOrigin,
          }}
        >
          <mapForm.Subscribe
            selector={(state) => [state.values.baseColor, state.values.width]}
          >
            {([color, width]) => (
              <mapForm.Field name="layout">
                {(field) => (
                  <ReactGridLayout
                    className="layout overflow-hidden rounded bg-zinc-700 bg-opacity-50 shadow-lg shadow-black"
                    style={{ width: width * 48 }}
                    layout={field.state.value}
                    cols={width}
                    rowHeight={48}
                    width={width * 48}
                    margin={[0, 0]}
                    resizeHandles={['se', 'nw']}
                    allowOverlap={true}
                    isDroppable={true}
                    onDrop={(layout, layoutItem, _event) => {
                      const newItem = {
                        ...layoutItem,
                        i: layout.length.toString(),
                        classNames: `tile ${tileType}`,
                      };

                      field.handleChange((prev) => {
                        return [...prev, newItem];
                      });
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
                    {field.state.value?.map((item, index) => (
                      <div
                        className={`${item.classNames}`}
                        style={
                          index === 0 ? { backgroundColor: color } : undefined
                        }
                        key={item.i}
                        onDoubleClick={() =>
                          field.handleChange((prev) =>
                            prev.filter((prevItem) => prevItem.i !== item.i),
                          )
                        }
                      />
                    ))}
                  </ReactGridLayout>
                )}
              </mapForm.Field>
            )}
          </mapForm.Subscribe>
        </div>
      </div>
      <ThemeContainer
        className="!sticky bottom-[24px] mt-auto w-full"
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
            <mapForm.Field name="width">
              {(field) => (
                <InputField field={field} type="number" label="Map Width" />
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
              aria-label="save"
              type="button"
              onClick={() => navigate('save')}
            >
              <Icon
                path={mdiFloppy}
                className="text-tertiary group-hover:text-accent timing size-8"
              />
            </button>
          </div>
          {/* <ArrowHeader3 title="Tile Type" /> */}
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
