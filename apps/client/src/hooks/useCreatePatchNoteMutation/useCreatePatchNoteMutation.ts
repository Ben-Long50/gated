import { useMutation, useQueryClient } from '@tanstack/react-query';
import createPatchNote from './createPatchNote';
import { toast } from 'react-toastify';

const useCreatePatchNoteMutation = (patchNoteId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createPatchNote(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      return queryClient.invalidateQueries({
        queryKey: ['patchNotes'],
        exact: false,
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreatePatchNoteMutation;
