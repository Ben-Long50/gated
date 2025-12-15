import { FieldApi } from '@tanstack/react-form';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Component, Layer } from 'src/types/map';
import DragScrollContainer from '../DragScrollContainer';
import MapBuilderTile from './MapBuilderTile';
import MapBuilderComponent from './MapBuilderComponent';
import getOccupiedTiles from '../mapUtils/getOccupiedTiles';
import getComponentStyle from '../mapUtils/getComponentStyle';
import getCoords from '../mapUtils/getCoords';

const MapBuilderGrid = ({
  ref,
  field,
  width,
  height,
  baseColor,
  layers,
  gridDisplay,
  mapScale,
  dragging,
  findConflict,
  activeLayerId,
  previewLayerId,
  activeComponentId,
  setActiveComponentId,
  tempComponent,
  setTempComponent,
  handleAddComponent,
  handleDeleteComponent,
}: {
  ref?: any;
  field?: FieldApi;
  width: number;
  height: number;
  baseColor: string;
  layers: Layer[];
  gridDisplay: boolean;
  mapScale: number;
  dragging?: boolean;
  findConflict?: (component: Component) => boolean;
  activeLayerId?: number;
  previewLayerId?: number;
  activeComponentId?: number | null;
  setActiveComponentId?: (id: number | null) => void;
  tempComponent?: Component;
  setTempComponent?: (component: Component | null) => void;
  handleAddComponent: (
    component: Component,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => void;
  handleDeleteComponent?: (
    e: MouseEvent,
    id: number | undefined,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const conflict =
    tempComponent && findConflict ? findConflict(tempComponent) : false;

  const tempComponentStyle = tempComponent
    ? getComponentStyle(tempComponent, mapScale)
    : {};

  return (
    <DragScrollContainer
      draggable={tempComponent === null && activeLayerId === null}
      className={`scrollbar-primary timing pointer-events-auto relative mx-auto mb-auto max-h-full max-w-full overflow-y-auto rounded border-2`}
      style={{ borderColor: accentPrimary }}
    >
      <div
        ref={ref}
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
              field={field}
              width={width}
              height={height}
              row={row}
              col={col}
              gridDisplay={gridDisplay}
              tempComponent={tempComponent}
              setTempComponent={setTempComponent}
              dragging={dragging}
              handleAddComponent={handleAddComponent}
              handleDeleteComponent={handleDeleteComponent}
            />
          );
        })}
        {layers.map((layer) => {
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
                      activeComponentId={activeComponentId}
                      activeLayerId={activeLayerId}
                      layerId={layer.id}
                      previewLayerId={previewLayerId}
                      setActiveComponentId={setActiveComponentId}
                      handleDeleteComponent={handleDeleteComponent}
                    />
                  );
                })}
                {tempComponent && getOccupiedTiles && (
                  <div
                    className="pointer-events-none relative opacity-50"
                    data-tiles={JSON.stringify(getOccupiedTiles(tempComponent))}
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
        })}
      </div>
    </DragScrollContainer>
  );
};

export default MapBuilderGrid;
