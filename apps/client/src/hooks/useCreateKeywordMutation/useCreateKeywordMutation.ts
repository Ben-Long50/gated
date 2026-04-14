import { useMutation, useQueryClient } from '@tanstack/react-query';
import createKeyword from './createKeyword';
import { toast } from 'react-toastify';

const useCreateKeywordMutation = (keywordId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createKeyword(formData);
    },
    onSuccess: () => {
      const message = keywordId
        ? 'Keyword successfully updated'
        : 'Keyword successfully created';

      toast(message);

      return queryClient.invalidateQueries({
        queryKey: ['keywords'],
        exact: false,
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateKeywordMutation;
