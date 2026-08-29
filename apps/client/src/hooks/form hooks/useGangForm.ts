import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import constructFormData from './constructFormData';
import { Gang } from 'src/types/gang';
import { useParams } from 'react-router-dom';

const useGangForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  gang?: Gang,
) => {
  const { campaignId } = useParams();

  const gangForm = useForm({
    defaultValues: {
      id: gang?.id ?? null,
      name: gang?.name ?? '',
      profits: gang?.profits ?? null,
      generatedPictureId: gang?.generatedPictureId ?? null,
      background: {} as { html: string; nodes: string },
      campaignId: gang?.campaignId ?? Number(campaignId),
      factionId: gang?.factionId ?? null,
      leaderIds:
        gang?.leaders.map((character) => character.id) ?? ([] as number[]),
      characterIds:
        gang?.characters.map((character) => character.id) ?? ([] as number[]),
    },

    onSubmit: async ({ value }) => {
      const formData = constructFormData(value);

      await mutation.mutate(formData);
    },
  });

  return gangForm;
};

export default useGangForm;
