import { FormApi } from '@tanstack/react-form';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Layer } from 'src/types/map';
import DragScrollContainer from '../DragScrollContainer';
import MapBuilderTile from './MapBuilderTile';
import MapBuilderComponent from './MapBuilderComponent';
import getOccupiedTiles from '../mapUtils/getOccupiedTiles';
import getComponentStyle from '../mapUtils/getComponentStyle';
import getCoords from '../mapUtils/getCoords';
import { findConflict } from './mapBuilderUtils/findConflict';
import useMapBuilderStore from 'src/stores/mapBuilderStore';

const MapBuilderGrid = ({
  form,
  gridDisplay,
  mapScale,
  dragging,
}: {
  form?: FormApi;
  gridDisplay: boolean;
  mapScale: number;
  dragging?: boolean;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const activeLayerId = useMapBuilderStore((state) => state.activeLayerId);
  const tempComponent = useMapBuilderStore((state) => state.tempComponent);

  const conflict = tempComponent
    ? findConflict(activeLayerId, tempComponent)
    : false;

  return (
    <DragScrollContainer
      draggable={tempComponent === null && activeLayerId === null}
      className={`scrollbar-primary timing pointer-events-auto relative max-h-full max-w-full overflow-y-auto rounded border-2`}
      style={{ borderColor: accentPrimary }}
    >
      <form.Subscribe
        selector={(state) => [
          state.values.baseColor,
          state.values.width,
          state.values.height,
        ]}
      >
        {([baseColor, width, height]) => (
          <div
            className={`${dragging && 'cursor-grabbing'} timing relative grid overflow-hidden`}
            style={{
              backgroundColor: baseColor,
              width: width * 48 * mapScale,
              height: height * 48 * mapScale,
              gridTemplateColumns: `repeat(${width},  ${48 * mapScale}px)`,
              gridTemplateRows: `repeat(${height},  ${48 * mapScale}px)`,
            }}
          >
            {Array.from({ length: width * height }).map((_, index) => {
              const { row, col } = getCoords(width, index);

              return (
                <MapBuilderTile
                  key={index}
                  form={form}
                  width={width}
                  height={height}
                  row={row}
                  col={col}
                  gridDisplay={gridDisplay}
                  dragging={dragging}
                />
              );
            })}
            <form.Field name="layers">
              {(field) =>
                field.state.value.map((layer: Layer) => {
                  if (!layer.hidden) {
                    return (
                      <div
                        id={`layer ${layer.id}`}
                        className={`${activeLayerId !== layer.id && 'pointer-events-none'} layout absolute inset-px grid overflow-hidden rounded`}
                        style={{
                          gridTemplateColumns: `repeat(${width}, ${48 * mapScale}px)`,
                          gridTemplateRows: `repeat(${height},  ${48 * mapScale}px)`,
                        }}
                      >
                        {layer.components.map((component, index) => {
                          return (
                            <MapBuilderComponent
                              key={index}
                              field={field}
                              component={component}
                              mapScale={mapScale}
                              layerId={layer.id}
                            />
                          );
                        })}
                        {tempComponent && getOccupiedTiles && (
                          <div
                            className="pointer-events-none relative opacity-50"
                            data-tiles={JSON.stringify(
                              getOccupiedTiles(tempComponent),
                            )}
                            style={getComponentStyle(tempComponent, mapScale)}
                          >
                            {tempComponent.subComponents &&
                              tempComponent.subComponents.length > 0 &&
                              tempComponent.subComponents.map((component) => {
                                const subComponentStyle = getComponentStyle(
                                  component,
                                  mapScale,
                                );

                                return <div style={subComponentStyle} />;
                              })}
                            {conflict && (
                              <div
                                className={`absolute inset-0 bg-red-500 opacity-40`}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return;
                  }
                })
              }
            </form.Field>
          </div>
        )}
      </form.Subscribe>
    </DragScrollContainer>
  );
};

export default MapBuilderGrid;
