import { useDroppable } from '@dnd-kit/core';
import { FieldApi } from '@tanstack/react-form';
import { Component, Layer } from 'src/types/map';

const MapBuilderTile = ({
  field,
  width,
  index,
  tempComponent,
  setTempComponent,
  dragging,
  getCoords,
  handleAddComponent,
  handleDeleteComponent,
}: {
  field: FieldApi;
  width: number;
  index: number;
  tempComponent: Component;
  setTempComponent: (component: Component) => void;
  dragging: boolean;
  getCoords: (width: number, index: number) => { row: number; col: number };
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
}) => {
  const { row, col } = getCoords(width, index + 1);

  const { setNodeRef } = useDroppable({
    id: index,
    data: { row: tempComponent?.mapRowStart, col: tempComponent?.mapColStart },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${!tempComponent && 'pointer-events-none'} relative flex size-full items-center justify-center`}
      style={{ gridRow: row, gridColumn: col }}
      onMouseEnter={(e) => {
        if (!tempComponent) {
          return;
        }
        const newTempComponent = {
          ...tempComponent,
          mapColStart: col,
          mapRowStart: row,
        };

        if (e.buttons === 1 && !dragging) {
          handleAddComponent(
            newTempComponent,
            row,
            col,
            field.state.value,
            field.handleChange,
          );
        }
        setTempComponent(newTempComponent);
      }}
      onMouseDown={() => {
        handleAddComponent(
          tempComponent,
          row,
          col,
          field.state.value,
          field.handleChange,
        );
      }}
      onDoubleClick={(e) => {
        handleDeleteComponent(
          e,
          undefined,
          field.state.value,
          field.handleChange,
        );
      }}
    />
  );
};

export default MapBuilderTile;
