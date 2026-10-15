import { useMutation, useQueryClient } from '@tanstack/react-query';
import createItem from './createItemCopy';
import { toast } from 'react-toastify';

const useCreateItemCopyMutation = (itemId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return createItem(itemId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['item', data.item.id], data.item);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateItemCopyMutation;
