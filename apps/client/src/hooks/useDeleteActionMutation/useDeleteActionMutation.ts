import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteAction from './deleteAction';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useDeleteActionMutation = (actionId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteAction(actionId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      navigate(-1);

      queryClient.removeQueries({
        queryKey: ['action', actionId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteActionMutation;
