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
      id: faction?.id || 0,
      name: faction?.name || '',
      factionType: faction?.factionType || '',
      pictureFile: null as File | null,
      picture: faction?.picture || {
        imageUrl: '',
        publicId: '',
        position: { x: 50, y: 50 },
      },
      background:
        faction?.background || ({} as { html: string; nodes: string }),
    },

    onSubmit: async ({ value }) => {
      const formData = constructFormData(value);

      await mutation.mutate(formData);
    },
  });

  return factionForm;
};

export default useFactionForm;
