import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCondition from './createCondition';
import { toast } from 'react-toastify';

const useCreateConditionMutation = (conditionId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createCondition(formData);
    },
    onSuccess: () => {
      const message = conditionId
        ? 'Condition successfully updated'
        : 'Condition successfully created';

      toast.success(data.message);

      return queryClient.invalidateQueries({
        queryKey: ['conditions'],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateConditionMutation;
