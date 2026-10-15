import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Session } from 'src/types/campaign';
import { useParams } from 'react-router-dom';
import { filterFormData } from './filterFormData';

const useSessionForm = (
  mutation: UseMutationResult<any, Error, any>,
  session?: Session,
) => {
  const { campaignId } = useParams();

  const sessionForm = useForm({
    defaultValues: {
      id: session?.id ?? null,
      campaignId: session?.campaignId ?? Number(campaignId),
      name: session?.name ?? '',
      location: session?.location ?? '',
      generatedPictureId: session?.generatedPictureId ?? null,
      characterIds:
        session?.characters.map((character) => character.id) ??
        ([] as number[]),
      briefing: session?.briefing ?? ({} as { html: string; nodes: object }),
    },

    onSubmit: async ({ value }) => {
      const formData = filterFormData(value);

      await mutation.mutate(formData);
    },
  });

  return sessionForm;
};

export default useSessionForm;
