import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Property } from 'src/types/property';
import constructFormData from './constructFormData';

const usePropertyForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  property?: Property,
) => {
  const propertyForm = useForm({
    defaultValues: {
      id: property?.id || null,
      name: property?.name || '',
      description: property?.description || '',
      pictureFile: null as File | null,
      picture: property?.picture || {
        imageUrl: '',
        publicId: '',
        position: { x: 50, y: 50 },
      },
      gpPrice: property?.gpPrice || null,
      type: property?.type || '',
    },
    onSubmit: async ({ value }) => {
      const formData = constructFormData(value);

      await mutation.mutate(formData);
    },
  });

  return propertyForm;
};

export default usePropertyForm;
