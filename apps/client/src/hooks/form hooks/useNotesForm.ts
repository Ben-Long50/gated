import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Notes } from 'src/types/campaign';
import { filterFormData } from './filterFormData';

const useNotesForm = (
  sessionId: number,
  mutation: UseMutationResult<any, Error, any>,
  notes?: Notes,
) => {
  const { characterId } = useParams();

  const notesForm = useForm({
    defaultValues: {
      id: notes?.id ?? null,
      characterId: notes?.characterId ?? Number(characterId),
      sessionId: sessionId,
      content: notes?.content ?? ({} as { html: string; nodes: object }),
    },

    onSubmit: async ({ value }) => {
      const filteredData = filterFormData(value);

      await mutation.mutate(filteredData);
    },
  });

  return notesForm;
};

export default useNotesForm;
