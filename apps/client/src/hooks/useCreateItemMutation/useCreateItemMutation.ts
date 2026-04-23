import { useMutation, useQueryClient } from '@tanstack/react-query';
import createItem from './createItem';
import { toast } from 'react-toastify';

const useCreateItemMutation = (itemId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createItem(formData);
    },
    onSuccess: () => {
      const message = itemId
        ? 'Item successfully updated'
        : 'Item successfully created';

      toast.success(data.message);

      if (itemId) {
        queryClient.invalidateQueries({
          queryKey: ['item', itemId],
        });
      }
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateItemMutation;
