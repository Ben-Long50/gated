import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import deleteCondition from './deleteCondition';
import { toast } from 'react-toastify';

const useDeleteConditionMutation = (conditionId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteCondition(conditionId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      navigate(-1);

      return queryClient.removeQueries({
        queryKey: ['condition', conditionId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteConditionMutation;
