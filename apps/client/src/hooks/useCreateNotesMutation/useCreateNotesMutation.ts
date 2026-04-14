import { useMutation, useQueryClient } from '@tanstack/react-query';
import createNotes from './createNotes';
import { toast } from 'react-toastify';

const useCreateNotesMutation = (notesId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: {
      id?: number;
      characterId: number;
      sessionId: number;
      content: { html: string; nodes: object };
    }) => {
      return createNotes(formData);
    },
    onSuccess: () => {
      const message = notesId
        ? 'Property successfully updated'
        : 'Property successfully created';

      toast(message);

      return queryClient.invalidateQueries({
        queryKey: ['notes', notesId],
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateNotesMutation;
