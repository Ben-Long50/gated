import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { PatchNote } from 'src/types/patchNote';

const usePatchNoteForm = (
  mutation: UseMutationResult<any, Error, any>,
  patchNote?: PatchNote,
) => {
  const patchNoteForm = useForm({
    defaultValues: {
      id: patchNote?.id || null,
      version: patchNote?.version || '',
      title: patchNote?.title || '',
      content: patchNote?.content || ({} as { html: string; nodes: object }),
    },
    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });

  return patchNoteForm;
};

export default usePatchNoteForm;
