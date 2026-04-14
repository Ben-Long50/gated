import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteAction from './deleteAction';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useDeleteActionMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (actionId: string) => {
      return deleteAction(actionId);
    },
    onSuccess: () => {
      toast('Successfully deleted action');
      navigate('/glam/codex/actions');

      return queryClient.invalidateQueries({
        queryKey: ['actions'],
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteActionMutation;
