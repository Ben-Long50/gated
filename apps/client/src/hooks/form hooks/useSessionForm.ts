import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import constructFormData from './constructFormData';
import { Session } from 'src/types/campaign';
import { useParams } from 'react-router-dom';

const useSessionForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  session?: Session,
) => {
  const { campaignId } = useParams();

  const sessionForm = useForm({
    defaultValues: {
      id: session?.id ?? null,
      campaignId: session?.campaignId ?? Number(campaignId),
      name: session?.name ?? '',
      location: session?.location ?? '',
      pictureFile: null as File | null,
      picture: {
        imageUrl: session?.picture.imageUrl ?? '',
        publicId: session?.picture.publicId ?? '',
        position: session?.picture.position ?? { x: 50, y: 50 },
      },
      characterIds:
        session?.characters.map((character) => character.id) ??
        ([] as number[]),
      briefing: session?.briefing ?? ({} as { html: string; nodes: object }),
    },

    onSubmit: async ({ value }) => {
      const formData = constructFormData(value);

      await mutation.mutate(formData);
    },
  });

  return sessionForm;
};

export default useSessionForm;
