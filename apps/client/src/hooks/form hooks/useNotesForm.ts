import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Notes } from 'src/types/campaign';

const useNotesForm = (
  mutation: UseMutationResult<any, Error, any>,
  notes?: Notes,
) => {
  const { characterId, sessionId } = useParams();

  const notesForm = useForm({
    defaultValues: {
      id: notes?.id || null,
      characterId: notes?.characterId || Number(characterId),
      sessionId: notes?.sessionId || Number(sessionId),
      content: notes?.content || ({} as { html: string; nodes: object }),
    },

    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });

  return notesForm;
};

export default useNotesForm;
