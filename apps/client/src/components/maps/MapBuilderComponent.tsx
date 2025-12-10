import {
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { FieldApi } from '@tanstack/react-form';
import { CSSProperties } from 'react';
import { Component, Layer } from 'src/types/map';

const MapBuilderComponent = ({
  field,
  component,
  activeComponentId,
  setActiveComponentId,
  activeLayerId,
  layerId,
  getOccupiedTiles,
  getComponentStyle,
  handleDeleteComponent,
}: {
  field: FieldApi;
  component: Component;
  activeComponentId: number | null;
  setActiveComponentId: (id: number | null) => void;
  activeLayerId: number;
  layerId: number;
  getOccupiedTiles: (component: Component) => { col: number; row: number }[];
  getComponentStyle: (component: Component) => CSSProperties;
  handleDeleteComponent: (
    e: MouseEvent,
    id: number | undefined,
    layers: Layer[],
    callback: (layers: Layer[]) => void,
  ) => void;
}) => {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: `layer ${layerId} component ${component.id}`,
    data: {
      component,
    },
    disabled: activeLayerId !== layerId,
  });

  return (
    <div
      ref={setNodeRef}
      id={`component ${component.id}`}
      data-layer={`layer ${layerId}`}
      data-tiles={JSON.stringify(getOccupiedTiles(component))}
      className={`${activeLayerId === layerId && 'ring-2 ring-inset ring-[var(--accent-primary)]'} relative`}
      style={
        transform
          ? {
              ...getComponentStyle(component),
              opacity: 0,
            }
          : getComponentStyle(component)
      }
      {...listeners}
      {...attributes}
      onMouseEnter={() => {
        if (activeLayerId === layerId) {
          setActiveComponentId(component.id);
        }
      }}
      onMouseLeave={() => {
        if (activeLayerId === layerId) {
          setActiveComponentId(null);
        }
      }}
    >
      {activeLayerId === layerId && activeComponentId === component.id && (
        <div
          className={`absolute inset-0 cursor-grab bg-[var(--accent-primary)] opacity-40`}
          onDoubleClick={(e) => {
            handleDeleteComponent(
              e,
              undefined,
              field.state.value,
              field.handleChange,
            );
          }}
        />
      )}
    </div>
  );
};

export default MapBuilderComponent;
