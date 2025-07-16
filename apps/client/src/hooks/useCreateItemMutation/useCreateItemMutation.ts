import { useMutation, useQueryClient } from '@tanstack/react-query';
import createItem from './createItem';

const useCreateItemMutation = (
  category: string,
  setFormMessage: (message: string) => void,
  itemId?: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createItem(category, formData);
    },
    onSuccess: (data) => {
      setFormMessage(data.message);
      queryClient.invalidateQueries({
        queryKey: ['item', itemId],
      });
      return queryClient.invalidateQueries({
        queryKey: [category],
        exact: false,
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useCreateItemMutation;
