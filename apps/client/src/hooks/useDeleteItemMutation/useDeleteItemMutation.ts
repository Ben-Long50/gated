import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import deleteItem from './deleteItem';
import { toast } from 'react-toastify';

const useDeleteItemMutation = (itemId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteItem(itemId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      navigate(-1);

      return queryClient.removeQueries({
        queryKey: ['item', itemId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteItemMutation;
