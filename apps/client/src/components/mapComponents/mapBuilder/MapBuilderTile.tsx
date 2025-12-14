import { useDroppable } from '@dnd-kit/core';
import { FieldApi } from '@tanstack/react-form';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Component, Layer } from 'src/types/map';

const MapBuilderTile = ({
  field,
  width,
  height,
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
  width: number;
  height: number;
  row: number;
  col: number;
  gridDisplay: boolean;
  tempComponent: Component;
  setTempComponent: (component: Component) => void;
  dragging: boolean;
  handleAddComponent: (
    component: Component,
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

        let newMapColStart =
          col > width / 2
            ? Math.floor(col - tempComponent.width / 2) + 1
            : Math.ceil(col - tempComponent.width / 2);

        if (newMapColStart + tempComponent.width > width) {
          newMapColStart = width - tempComponent.width + 1;
        }

        let newMapRowStart =
          row > height / 2
            ? Math.floor(row - tempComponent.height / 2) + 1
            : Math.ceil(row - tempComponent.height / 2);

        if (newMapRowStart + tempComponent.height > height) {
          newMapRowStart = height - tempComponent.height + 1;
        }

        const newTempComponent = {
          ...tempComponent,
          mapColStart: newMapColStart < 1 ? 1 : newMapColStart,
          mapRowStart: newMapRowStart < 1 ? 1 : newMapRowStart,
        };

        if (e.buttons === 1 && !dragging) {
          handleAddComponent(
            newTempComponent,
            field.state.value,
            field.handleChange,
          );
        }
        setTempComponent(newTempComponent);
      }}
      onMouseDown={() => {
        handleAddComponent(
          tempComponent,
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
