import { useContext, useRef, useState } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InputField from '../InputField';
import { useForm, useStore } from '@tanstack/react-form';
import ArrowHeader3 from '../ArrowHeader3';
import GridLayout from 'react-grid-layout';
import '/src/styles/mapStyles.css';
import BtnRect from '../buttons/BtnRect';
import Icon from '@mdi/react';
import { mdiFloppy } from '@mdi/js';

const MapBuilder = () => {
  const { accentPrimary } = useContext(ThemeContext);

  const [tileType, setTileType] = useState('');
  const [zoom, setZoom] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState('center center');

  const mapRef = useRef(null);

  const mapDraft = localStorage.getItem('mapDraft')
    ? JSON.parse(localStorage.getItem('mapDraft'))
    : null;

  console.log(mapDraft);

  const mapForm = useForm({
    defaultValues: {
      name: mapDraft ? mapDraft.name : '',
      width: mapDraft ? mapDraft.width : 25,
      baseColor: mapDraft ? mapDraft.baseColor : '#000000',
      layout: mapDraft
        ? mapDraft.layout
        : [
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
      console.log(JSON.stringify(value));

      localStorage.setItem('mapDraft', JSON.stringify(value));
      console.log('saved');
    },
  });

  const width = useStore(mapForm.store, (state) => state.values.width);

  return (
    <div className="flex h-full w-full max-w-7xl flex-col items-center gap-8">
      <h1 className="w-full text-center">Map Builder</h1>
      <div
        ref={mapRef}
        className="flex flex-col items-center gap-8 overflow-hidden rounded border-2 border-gray-400 border-opacity-50 bg-gray-400 bg-opacity-40 p-4"
        onWheel={(e) => {
          e.preventDefault();
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

          console.log(x, y);

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
            transform: `scale(${zoom})`,
            transformOrigin: transformOrigin,
          }}
        >
          <mapForm.Subscribe selector={(state) => state.values.baseColor}>
            {(color) => (
              <mapForm.Field name="layout">
                {(field) => (
                  <GridLayout
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
                        console.log(prev);
                        return [...prev, newItem];
                      });
                    }}
                    onResizeStop={(_, __, newItem) => {
                      field.handleChange((prev) =>
                        prev.map((item) =>
                          item.i === newItem.i ? { ...item, ...newItem } : item,
                        ),
                      );
                    }}
                    onDragStop={(_, __, newItem) => {
                      console.log(newItem);

                      field.handleChange((prev) =>
                        prev.map((item) =>
                          item.i === newItem.i ? { ...item, ...newItem } : item,
                        ),
                      );
                    }}
                  >
                    {field.state.value.map((item, index) => (
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
                  </GridLayout>
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
            <mapForm.Field name="name">
              {(field) => <InputField field={field} label="Location Name" />}
            </mapForm.Field>
            <mapForm.Field name="width">
              {(field) => (
                <InputField field={field} type="number" label="Map Width" />
              )}
            </mapForm.Field>
            <mapForm.Field name="baseColor">
              {(field) => (
                <input
                  type="color"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            </mapForm.Field>
            <button
              className="bg-tertiary group my-auto ml-auto flex rounded p-1.5 shadow-md shadow-black"
              aria-label="save"
              type="submit"
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
        </form>
      </ThemeContainer>
    </div>
  );
};
export default MapBuilder;
