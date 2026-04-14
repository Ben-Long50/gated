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
    onSuccess: () => {
      toast('Patch note successfully deleted');
      navigate('/glam/codex');

      return queryClient.invalidateQueries({
        queryKey: ['patchNotes'],
        exact: false,
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useDeletePatchNoteMutation;
