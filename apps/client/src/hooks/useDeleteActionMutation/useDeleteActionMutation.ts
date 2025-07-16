import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteAction from './deleteAction';
import { useNavigate } from 'react-router-dom';

const useDeleteActionMutation = (setFormMessage: (message: string) => void) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (actionId: string) => {
      return deleteAction(actionId);
    },
    onSuccess: () => {
      navigate('/glam/codex/actions');
      queryClient.invalidateQueries({
        queryKey: ['action'],
        exact: false,
      });
      return queryClient.invalidateQueries({
        queryKey: ['actions'],
        exact: false,
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useDeleteActionMutation;
