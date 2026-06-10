import { useMutation, useQueryClient } from '@tanstack/react-query';
import createAction from './createAction';
import { toast } from 'react-toastify';

const useCreateActionMutation = (actionId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createAction(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      return queryClient.invalidateQueries({
        queryKey: ['actions'],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateActionMutation;
