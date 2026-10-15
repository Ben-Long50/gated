import { FormApi } from '@tanstack/react-form';

export const handleAddLayer = (
  form: FormApi,
  setActiveLayerId: (id: number) => void,
) => {
  const currentLayers = form.getFieldValue('layers');
  const nextLayerNumber = form.getFieldValue('layerCount') + 1;

  if (Array.isArray(currentLayers)) {
    form.setFieldValue('layers', [
      ...currentLayers,
      {
        name: `Layer ${nextLayerNumber}`,
        id: nextLayerNumber,
        hidden: false,
        componentCount: 0,
        components: [],
      },
    ]);

    form.setFieldValue('layerCount', nextLayerNumber);
    setActiveLayerId(nextLayerNumber);
  }
};
