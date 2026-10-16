import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteItem from './deleteItem';
import { toast } from 'react-toastify';
import { Character } from '@gated/shared';
import { Item } from '@gated/shared';

const useDeleteItemMutation = (itemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return deleteItem(itemId);
    },
    onMutate: () => {
      const prevItem = queryClient.getQueryData(['item', itemId]) as Item;

      if (prevItem && prevItem.characterInventory?.characterId) {
        const prevCharacter = queryClient.getQueryData([
          'character',
          prevItem.characterInventory.characterId,
        ]) as Character;

        queryClient.setQueryData(['character', prevCharacter.id], {
          ...prevCharacter,
          characterInventory: {
            ...prevCharacter.characterInventory,
            items: prevCharacter.characterInventory.items.filter(
              (item) => item.id !== itemId,
            ),
          },
        });
      }

      queryClient.removeQueries({
        queryKey: ['item', itemId],
      });

      return { prevItem };
    },
    onSuccess: (data) => {
      toast.success(data.message);

      if (data.character) {
        queryClient.setQueryData(
          ['character', data.character.id],
          data.character,
        );

        toast.success(`Updated ${data.character.name}`);
      }
    },
    onError: (data, __, context) => {
      if (context?.prevItem) {
        queryClient.setQueryData(['item', itemId], context.prevItem);
      }

      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteItemMutation;
