import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import createCodexItem from './createCodexItem';

const useCreateCodexItemMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createCodexItem(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      data.item.itemTypes.forEach((type: string) => {
        queryClient.invalidateQueries({ queryKey: [type] });
      });

      queryClient.setQueryData(['item', data.item.id], data.item);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateCodexItemMutation;
