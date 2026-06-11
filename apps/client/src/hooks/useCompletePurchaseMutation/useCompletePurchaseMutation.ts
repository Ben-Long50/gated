import { useMutation, useQueryClient } from '@tanstack/react-query';
import completePurchase from './completePurchase';
import { toast } from 'react-toastify';

const useCompletePurchaseMutation = (
  characterId: number,
  inventoryId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return completePurchase(characterId, inventoryId);
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

export default useCompletePurchaseMutation;
