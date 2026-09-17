import { FormApi } from '@tanstack/react-form';
import { Layer } from 'src/types/map';

export const handleEditComponentName = (
  form: FormApi,
  layerId: number | null,
  componentId: number,
  newName: string,
) => {
  if (!layerId) {
    return;
  }

  const currentLayers = form.getFieldValue('layers');

  const newLayers = currentLayers.map((layer: Layer) => {
    if (layer.id === layerId) {
      return {
        ...layer,
        components: layer?.components.map((component) =>
          component.id === componentId
            ? { ...component, name: newName }
            : component,
        ),
      };
    } else {
      return layer;
    }
  });

  form.setFieldValue('layers', newLayers);
};
