import { useMutation, useQueryClient } from '@tanstack/react-query';
import createKeyword from './createKeyword';
import { toast } from 'react-toastify';

const useCreateKeywordMutation = (keywordId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createKeyword(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      return queryClient.invalidateQueries({
        queryKey: ['keywords'],
        exact: false,
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateKeywordMutation;
