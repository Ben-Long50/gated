import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Property } from 'src/types/property';

const usePropertyForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  property?: Property,
) => {
  const propertyForm = useForm({
    defaultValues: {
      id: property?.id || null,
      name: property?.name || '',
      description: property?.description || '',
      pictureFile: null,
      picture: property?.picture || {
        imageUrl: '',
        publicId: '',
        position: { x: 50, y: 50 },
      },
      gpPrice: property?.gpPrice || null,
      type: property?.type || '',
    },
    onSubmit: async ({ value }) => {
      const data = Object.fromEntries(
        Object.entries(value).filter(([, value]) => value),
      );
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      });
      await mutation.mutate(formData);
    },
  });

  return propertyForm;
};

export default usePropertyForm;
