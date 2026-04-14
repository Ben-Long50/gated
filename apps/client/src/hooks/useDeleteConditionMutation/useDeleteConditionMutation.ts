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
    onSuccess: () => {
      toast('Condition successfully deleted');

      navigate('/glam/codex/conditions');

      return queryClient.invalidateQueries({
        queryKey: ['conditions'],
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteConditionMutation;
