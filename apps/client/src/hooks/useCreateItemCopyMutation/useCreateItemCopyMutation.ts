import { useMutation, useQueryClient } from '@tanstack/react-query';
import createItem from './createItemCopy';
import { toast } from 'react-toastify';

const useCreateItemCopyMutation = (itemId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return createItem(itemId);
    },
    onSuccess: () => {
      toast('Item successfully copied');
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateItemCopyMutation;
