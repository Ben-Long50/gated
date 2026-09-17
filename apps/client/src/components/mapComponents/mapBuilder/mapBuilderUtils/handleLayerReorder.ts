import { FormApi } from '@tanstack/react-form';
import { Layer } from 'src/types/map';

export const handleLayerReorder = (
  form: FormApi,
  oldIndex: number,
  newIndex: number,
  callback: (layers: Layer[]) => void,
) => {
  if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') {
    return;
  }

  const layers = form.getFieldValue('layers');

  const [item] = layers.splice(oldIndex, 1);
  layers.splice(newIndex, 0, item);

  if (callback) {
    callback(layers);
  } else {
    form.setFieldValue('layers', layers);
  }
};
