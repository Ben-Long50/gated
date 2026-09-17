import { FormApi } from '@tanstack/react-form';

export const handleDeleteLayer = (form: FormApi, id: number) => {
  const currentLayers = form.getFieldValue('layers');
  if (currentLayers.length < 2) {
    return;
  }

  const newLayers = currentLayers.filter((layer) => layer.id !== id);

  form.setFieldValue('layers', newLayers);
};
