import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { filterFormData } from './filterFormData';

const useCharacterAddForm = (
  mutation: UseMutationResult<any, Error, any>,
  campaignId: number,
  gangId?: number,
) => {
  const characterAddForm = useForm({
    defaultValues: {
      campaignId: campaignId,
      gangId: gangId ?? null,
      characterList: [] as { characterId: number; quantity: number }[],
    },

    onSubmit: async ({ value }) => {
      const formData = filterFormData(value);

      console.log(formData);

      await mutation.mutate(formData);
    },
  });

  return characterAddForm;
};

export default useCharacterAddForm;
