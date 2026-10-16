import { useDraggable } from '@dnd-kit/core';
import { FieldApi } from '@tanstack/react-form';
import { Component } from '@gated/shared';
import getOccupiedTiles from '../mapUtils/getOccupiedTiles';
import getComponentStyle from '../mapUtils/getComponentStyle';
import useMapBuilderStore from 'src/stores/mapBuilderStore';
import { handleDeleteComponent } from './mapBuilderUtils/handleDeleteComponent';

const MapBuilderComponent = ({
  field,
  component,
  mapScale,
  layerId,
}: {
  field: FieldApi;
  component: Component;
  mapScale: number;
  layerId: number;
}) => {
  const activeLayerId = useMapBuilderStore((state) => state.activeLayerId);
  const activeComponentId = useMapBuilderStore(
    (state) => state.activeComponentId,
  );
  const previewLayerId = useMapBuilderStore((state) => state.previewLayerId);
  const setActiveComponentId = useMapBuilderStore(
    (state) => state.setActiveComponentId,
  );

  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id: `layer ${layerId} component ${component.id}`,
    data: {
      component,
    },
    disabled: activeLayerId !== layerId,
  });

  const tiles = getOccupiedTiles(component);
  const style = getComponentStyle(component, mapScale);

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
      {component.subComponents &&
        component.subComponents.length > 0 &&
        component.subComponents.map((component) => (
          <div style={getComponentStyle(component, mapScale)} />
        ))}
      {activeLayerId === layerId && activeComponentId === component.id && (
        <div
          className={`absolute inset-0 cursor-grab bg-[var(--accent-primary)] opacity-40`}
          onDoubleClick={(e) => {
            handleDeleteComponent(
              e,
              activeLayerId,
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
