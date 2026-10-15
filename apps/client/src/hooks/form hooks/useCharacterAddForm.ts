import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { filterFormData } from './filterFormData';

const useCharacterAddForm = (mutation: UseMutationResult<any, Error, any>) => {
  const characterAddForm = useForm({
    defaultValues: {
      characterId: null as number | null,
    },

    onSubmit: async ({ value }) => {
      const formData = filterFormData(value);

      await mutation.mutate(formData);
    },
  });

  return characterAddForm;
};

export default useCharacterAddForm;
