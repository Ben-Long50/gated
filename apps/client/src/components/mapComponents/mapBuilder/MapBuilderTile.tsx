import { useDroppable } from '@dnd-kit/core';
import { FieldApi } from '@tanstack/react-form';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Component, Layer } from 'src/types/map';

const MapBuilderTile = ({
  field,
  row,
  col,
  gridDisplay,
  tempComponent,
  setTempComponent,
  dragging,
  handleAddComponent,
  handleDeleteComponent,
}: {
  field: FieldApi;
  row: number;
  col: number;
  gridDisplay: boolean;
  tempComponent: Component;
  setTempComponent: (component: Component) => void;
  dragging: boolean;
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
  const { accentPrimary } = useContext(ThemeContext);

  const { setNodeRef } = useDroppable({
    id: `row ${row}, col ${col}`,
    data: {
      row: tempComponent?.mapRowStart || row,
      col: tempComponent?.mapColStart || col,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${!tempComponent && 'pointer-events-none'} ${gridDisplay && 'border'} relative z-10 flex size-full items-center justify-center`}
      style={{
        borderColor: `${accentPrimary}80`,
        gridRow: row,
        gridColumn: col,
      }}
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
