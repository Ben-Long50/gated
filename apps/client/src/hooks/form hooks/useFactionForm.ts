import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import constructFormData from './constructFormData';
import { Faction } from 'src/types/faction';

const useFactionForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  faction?: Faction,
) => {
  const factionForm = useForm({
    defaultValues: {
      id: faction?.id ?? null,
      name: faction?.name ?? '',
      factionType: faction?.factionType ?? '',
      generatedPictureId: faction?.generatedPictureId ?? null,
      background:
        faction?.background ?? ({} as { html: string; nodes: string }),
    },

    onSubmit: async ({ value }) => {
      const formData = constructFormData(value);

      await mutation.mutate(formData);
    },
  });

  return factionForm;
};

export default useFactionForm;
