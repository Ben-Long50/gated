import { useMutation, useQueryClient } from '@tanstack/react-query';
import clearCart from './clearCart';
import { toast } from 'react-toastify';

const useClearCartMutation = (characterId: number, cartId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return clearCart(characterId, cartId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      return queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useClearCartMutation;
