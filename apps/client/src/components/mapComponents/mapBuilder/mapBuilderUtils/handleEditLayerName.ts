import { FormApi } from '@tanstack/react-form';
import { Layer } from '@gated/shared';

export const handleEditLayerName = (
  form: FormApi,
  id: number,
  newName: string,
) => {
  const currentLayers = form.getFieldValue('layers');
  const newLayers = currentLayers.map((layer: Layer) => {
    if (layer.id === id) {
      return { ...layer, name: newName };
    } else {
      return layer;
    }
  });

  form.setFieldValue('layers', newLayers);
};
