import { Layer } from 'src/types/map';

export const handleHiddenLayer = (form: FormApi, id: number) => {
  const currentLayers = form.getFieldValue('layers');

  const layer = currentLayers.find((layer: Layer) => layer.id === id);

  if (!layer) {
    return;
  }

  const newLayer = {
    ...layer,
    hidden: !layer.hidden,
  };

  const newLayers = currentLayers.map((layer: Layer) => {
    if (layer.id === id) {
      return newLayer;
    } else {
      return layer;
    }
  });

  form.setFieldValue('layers', newLayers);
};
