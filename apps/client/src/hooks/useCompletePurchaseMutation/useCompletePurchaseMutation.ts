import { useMutation, useQueryClient } from '@tanstack/react-query';
import completePurchase from './completePurchase';

const useCompletePurchaseMutation = (
  characterId: number,
  inventoryId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return completePurchase(characterId, inventoryId);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    },
    throwOnError: false,
  });
};

export default useCompletePurchaseMutation;
