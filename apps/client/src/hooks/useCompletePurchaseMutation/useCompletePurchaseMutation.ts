import { useMutation, useQueryClient } from '@tanstack/react-query';
import completePurchase from './completePurchase';
import { toast } from 'react-toastify';
import constructName from 'src/utils/constructName';

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

      if (data.character) {
        queryClient.setQueryData(
          ['character', data.character.id],
          data.character,
        );

        toast.success(`Updated ${constructName(data.character)}'s inventory`);
      }

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
