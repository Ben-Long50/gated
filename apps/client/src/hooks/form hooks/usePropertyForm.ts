import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Property } from 'src/types/property';
import { filterFormData } from './filterFormData';

const usePropertyForm = (
  mutation: UseMutationResult<any, Error, any>,
  property?: Property,
) => {
  const propertyForm = useForm({
    defaultValues: {
      id: property?.id ?? null,
      name: property?.name ?? '',
      description: property?.description ?? '',
      generatedPictureId: property?.generatedPictureId ?? null,
      gpPrice: property?.gpPrice ?? null,
      type: property?.type ?? '',
    },
    onSubmit: async ({ value }) => {
      const formData = filterFormData(value);

      await mutation.mutate(formData);
    },
  });

  return propertyForm;
};

export default usePropertyForm;
