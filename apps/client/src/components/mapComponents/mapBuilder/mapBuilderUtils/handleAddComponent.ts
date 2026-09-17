import { Component, Layer } from 'src/types/map';
import { findConflict } from './findConflict';

export const handleAddComponent = (
  activeLayerId: number | null,
  component: Component | null,
  layers: Layer[],
  callback: (layers: Layer[]) => void,
) => {
  if (!component) {
    return;
  }

  const conflict = findConflict(activeLayerId, component);

  if (conflict) {
    return;
  }

  const layer = layers.find((layer: Layer) => layer.id === activeLayerId);

  if (!layer || (!component?.imageUrl && !component.subComponents.length)) {
    return;
  }

  const nextComponentNumber = layer.componentCount + 1;

  const newLayer: Layer = {
    ...layer,
    componentCount: nextComponentNumber,
    components: [
      ...layer.components,
      {
        ...component,
        name: `Component ${nextComponentNumber}`,
        id: nextComponentNumber,
      },
    ],
  };

  const newLayers = layers.map((layer: Layer) => {
    if (layer.id === activeLayerId) {
      return newLayer;
    } else {
      return layer;
    }
  });

  callback(newLayers);
};
