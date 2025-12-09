import { FieldApi } from '@tanstack/react-form';
import { CSSProperties, useContext, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Component, Layer } from 'src/types/map';
import DragScrollContainer from './DragScrollContainer';
import { DndContext, useDroppable } from '@dnd-kit/core';
import MapBuilderTile from './MapBuilderTile';
import MapBuilderComponent from './MapBuilderComponent';
import { ReturnDocument } from 'mongodb';

const MapGrid2 = ({
  ref,
  field,
  width,
  height,
  baseColor,
  layers,
  activeLayerId,
  activeComponentId,
  setActiveComponentId,
  tempComponent,
  setTempComponent,
  getComponentStyle,
  handleAddComponent,
  handleDeleteComponent,
  getOccupiedTiles,
  findConflict,
}: {
  ref: any;
  field: FieldApi;
  width: number;
  height: number;
  baseColor: string;
  layers: Layer[];
  activeLayerId: number;
  activeComponentId: number | null;
  setActiveComponentId: (id: number | null) => void;
  tempComponent: Component;
  setTempComponent: (component: Component | null) => void;
  getComponentStyle: (component: Component) => CSSProperties;
  handleAddComponent: (
    component: Component,
    row: number,
    col: number,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => void;
  handleDeleteComponent: (
    e: MouseEvent,
    id: number | undefined,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => void;
  getOccupiedTiles: (component: Component) => { col: number; row: number }[];
  findConflict: (component: Component) => boolean;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const [dragging, setDragging] = useState(false);

  const getCoords = (width: number, index: number) => {
    const row = Math.floor((index - 1) / width + 1);
    const col = index % width === 0 ? width : index % width;

    return { row, col };
  };

  const conflict = findConflict(tempComponent);

  const handleDragStart = (e) => {
    setDragging(true);
    const { active } = e;
    setTempComponent(active.data.current.component);
  };

  const moveComponent = (
    componentId: number,
    col: number,
    row: number,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => {
    if (conflict) {
      return;
    }

    const newLayers = layers.map((layer) => {
      if (layer.id === activeLayerId) {
        return {
          ...layer,
          components: layer.components.map((component) => {
            if (component.id === componentId) {
              return { ...component, mapColStart: col, mapRowStart: row };
            } else {
              return component;
            }
          }),
        };
      } else {
        return layer;
      }
    });

    callback(newLayers);
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    const { over, active } = e;

    if (!over) {
      setTempComponent(null);
      return;
    }

    moveComponent(
      active.data.current.component.id,
      over.data.current.col,
      over.data.current.row,
      field.state.value,
      field.handleChange,
    );
    setTempComponent(null);
  };

  return (
    <DragScrollContainer
      draggable={tempComponent === null && activeLayerId === null}
      className={`scrollbar-primary timing pointer-events-auto relative mx-auto mb-auto max-h-full max-w-full overflow-y-auto rounded border-2`}
      style={{ borderColor: accentPrimary }}
    >
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div
          ref={ref}
          className={`${dragging && 'cursor-grabbing'} timing relative overflow-hidden`}
          style={{
            backgroundColor: baseColor,
            width: width * 48,
            height: height * 48,
          }}
        >
          <div
            className="pointer-events-none absolute inset-px grid rounded"
            style={{
              gridTemplateColumns: `repeat(${width}, 48px)`,
              gridTemplateRows: `repeat(${height}, 48px)`,
            }}
          >
            {Array.from({ length: width * height }).map(() => (
              <div className="border-accent bg-transparent opacity-20 ring-1 ring-inset ring-[var(--accent-primary)]" />
            ))}
          </div>
          {layers.map((layer) => {
            if (!layer.hidden) {
              return (
                <div
                  id={`layer ${layer.id}`}
                  className={`${activeLayerId !== layer.id && 'pointer-events-none'} layout absolute inset-px grid overflow-hidden rounded`}
                  style={{
                    gridTemplateColumns: `repeat(${width}, 1fr)`,
                    gridTemplateRows: `repeat(${height}, 1fr)`,
                  }}
                >
                  {layer.components.map((component, index) => {
                    return (
                      <MapBuilderComponent
                        key={index}
                        component={component}
                        activeComponentId={activeComponentId}
                        activeLayerId={activeLayerId}
                        layerId={layer.id}
                        setActiveComponentId={setActiveComponentId}
                        getOccupiedTiles={getOccupiedTiles}
                        getComponentStyle={getComponentStyle}
                      />
                    );
                  })}
                  {tempComponent && (
                    <div
                      className="pointer-events-none relative opacity-50"
                      data-tiles={JSON.stringify(
                        getOccupiedTiles(tempComponent),
                      )}
                      style={getComponentStyle(tempComponent)}
                    >
                      {conflict && (
                        <div
                          className={`absolute inset-0 bg-red-500 opacity-40`}
                        />
                      )}
                    </div>
                  )}
                  {Array.from({ length: width * height }).map((_, index) => {
                    return (
                      <MapBuilderTile
                        key={index}
                        field={field}
                        width={width}
                        index={index}
                        tempComponent={tempComponent}
                        setTempComponent={setTempComponent}
                        dragging={dragging}
                        getCoords={getCoords}
                        handleAddComponent={handleAddComponent}
                        handleDeleteComponent={handleDeleteComponent}
                      />
                    );
                  })}
                </div>
              );
            } else {
              return;
            }
          })}
        </div>
      </DndContext>
    </DragScrollContainer>
  );
};

export default MapGrid2;
