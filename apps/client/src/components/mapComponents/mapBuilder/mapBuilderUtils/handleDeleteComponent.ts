import { Component, Layer } from 'src/types/map';

export const handleDeleteComponent = (
  e: MouseEvent | undefined,
  activeLayerId: number | null,
  id: number | undefined,
  layers: Layer[],
  callback: (layers: Layer[]) => void,
) => {
  const layer = layers.find((layer: Layer) => layer.id === activeLayerId);
  let newComponents = [] as Component[];

  if (!layer) {
    return;
  }

  if (id) {
    newComponents = layer.components.filter((component) => component.id !== id);
  } else if (e) {
    const components = document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter(
        (el) =>
          el instanceof HTMLDivElement &&
          el.dataset.layer === `layer ${activeLayerId}`,
      )
      .map((component) => component.id);

    newComponents = layer.components.filter(
      (component) => !components.includes(`component ${component.id}`),
    );
  } else {
    return;
  }

  const newLayer = {
    ...layer,
    components: newComponents,
  };

  const newLayers = layers.map((layer: Layer) => {
    if (layer.id === activeLayerId) {
      return newLayer;
    } else {
      return layer;
    }
  }) as Layer[];

  callback(newLayers);
};
