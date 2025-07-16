import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCondition from './createCondition';

const useCreateConditionMutation = (
  conditionId: string,
  setFormMessage: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createCondition(formData, conditionId);
    },
    onSuccess: (data) => {
      setFormMessage(data.message);
      queryClient.invalidateQueries({
        queryKey: ['condition'],
        exact: false,
      });
      return queryClient.invalidateQueries({
        queryKey: ['conditions'],
        exact: false,
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useCreateConditionMutation;
