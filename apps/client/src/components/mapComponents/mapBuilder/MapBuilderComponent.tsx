import { useDraggable } from '@dnd-kit/core';
import { FieldApi } from '@tanstack/react-form';
import { Component, Layer } from 'src/types/map';
import getOccupiedTiles from '../mapUtils/getOccupiedTiles';
import getComponentStyle from '../mapUtils/getComponentStyle';

const MapBuilderComponent = ({
  field,
  component,
  activeComponentId,
  setActiveComponentId,
  activeLayerId,
  layerId,
  previewLayerId,
  handleDeleteComponent,
}: {
  field: FieldApi;
  component: Component;
  activeComponentId: number | null;
  setActiveComponentId: (id: number | null) => void;
  activeLayerId: number;
  layerId: number;
  previewLayerId?: number;
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

  const tiles = getOccupiedTiles(component);
  const style = getComponentStyle(component);

  return (
    <div
      ref={setNodeRef}
      id={`component ${component.id}`}
      data-layer={`layer ${layerId}`}
      data-tiles={JSON.stringify(tiles)}
      className={`${activeLayerId === layerId && 'ring-2 ring-inset ring-[var(--accent-primary)]'} ${previewLayerId === layerId && 'ring-2 ring-inset ring-yellow-300'} relative`}
      style={
        transform
          ? {
              ...style,
              opacity: 0,
            }
          : style
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
