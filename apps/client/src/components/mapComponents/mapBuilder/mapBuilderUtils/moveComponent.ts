import { FormApi } from '@tanstack/react-form';
import { Component, Layer } from 'src/types/map';

export const moveComponent = (
  form: FormApi,
  activeLayerId: number | null,
  componentId: number,
  tempComponent: Component,
) => {
  const layers = form.getFieldValue('layers');

  const newLayers = layers.map((layer: Layer) => {
    if (layer.id === activeLayerId) {
      return {
        ...layer,
        components: layer.components.map((component) => {
          if (component.id === componentId) {
            return {
              ...component,
              mapColStart: tempComponent.mapColStart,
              mapRowStart: tempComponent.mapRowStart,
            };
          } else {
            return component;
          }
        }),
      };
    } else {
      return layer;
    }
  });

  form.setFieldValue('layers', newLayers);
};
