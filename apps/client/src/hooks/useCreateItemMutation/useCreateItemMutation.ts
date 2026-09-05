import { useMutation, useQueryClient } from '@tanstack/react-query';
import createItem from './createItem';
import { toast } from 'react-toastify';

const useCreateItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createItem(formData);
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

export default useCreateItemMutation;
