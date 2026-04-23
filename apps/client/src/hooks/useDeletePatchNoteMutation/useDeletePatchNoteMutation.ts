import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import deletePatchNote from './deletePatchNote';

const useDeletePatchNoteMutation = (patchNoteId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deletePatchNote(patchNoteId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      navigate('/glam/codex');

      return queryClient.removeQueries({
        queryKey: ['patchNote', patchNoteId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeletePatchNoteMutation;
