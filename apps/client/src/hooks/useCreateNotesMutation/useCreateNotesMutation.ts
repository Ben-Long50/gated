import { useMutation, useQueryClient } from '@tanstack/react-query';
import createNotes from './createNotes';
import { toast } from 'react-toastify';
import { Notes } from 'src/types/campaign';

const useCreateNotesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: {
      id?: number;
      characterId: number;
      sessionId: number;
      content: { html: string; nodes: object };
    }) => createNotes(formData),
    onSuccess: (data) => {
      toast.success(data.message);

      const prevNotes: Notes[] | undefined = queryClient.getQueryData([
        'notes',
        data.notes.characterId,
      ]);

      if (prevNotes && prevNotes.length > 0) {
        const newNotes = prevNotes.map((notes) =>
          notes.id === data.notes.id ? data.notes : notes,
        );

        queryClient.setQueryData(['notes', data.notes.characterId], newNotes);
      } else {
        queryClient.invalidateQueries({
          queryKey: ['notes', data.notes.characterId],
        });
      }
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateNotesMutation;
