import { useDraggable } from '@dnd-kit/core';
import { CSSProperties } from 'react';
import { Component } from 'src/types/map';

const MapBuilderComponent = ({
  component,
  activeComponentId,
  setActiveComponentId,
  activeLayerId,
  layerId,
  getOccupiedTiles,
  getComponentStyle,
}: {
  component: Component;
  activeComponentId: number | null;
  setActiveComponentId: (id: number | null) => void;
  activeLayerId: number;
  layerId: number;
  getOccupiedTiles: (component: Component) => { col: number; row: number }[];
  getComponentStyle: (component: Component) => CSSProperties;
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
        />
      )}
    </div>
  );
};

export default MapBuilderComponent;
