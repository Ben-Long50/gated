import { useMutation, useQueryClient } from '@tanstack/react-query';
import createAction from './createAction';
import { toast } from 'react-toastify';

const useCreateActionMutation = (actionId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createAction(formData);
    },
    onSuccess: () => {
      const message = actionId
        ? 'Action successfully updated'
        : 'Action successfully created';

      toast(message);

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

export default useCreateActionMutation;
