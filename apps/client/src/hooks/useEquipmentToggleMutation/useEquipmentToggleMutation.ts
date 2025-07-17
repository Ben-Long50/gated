import { useMutation, useQueryClient } from '@tanstack/react-query';
import toggleEquipment from './toggleEquipment';
import { Item } from 'src/types/item';
import { socket } from 'src/socket';

const useToggleEquipmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: {
      characterId: number;
      inventoryId: number;
      category: string;
      itemId: number;
    }) => {
      return toggleEquipment(formData);
    },

    onMutate: async (mutationInfo) => {
      await queryClient.cancelQueries({
        queryKey: ['item', mutationInfo.itemId],
      });

      const prevItemData: Item | undefined = queryClient.getQueryData([
        'item',
        mutationInfo.itemId,
      ]);

      queryClient.setQueryData(['item', mutationInfo.itemId], (prev: Item) => ({
        ...prev,
        equipped: !prevItemData?.equipped,
      }));

      return { prevItemData };
    },

    onSuccess: (_, mutationInfo, context) => {
      socket.emit('item', {
        itemId: mutationInfo.itemId,
        campaignId:
          context.prevItemData?.characterInventory?.character.campaignId,
      });
      return queryClient.invalidateQueries({
        queryKey: ['item', mutationInfo.itemId],
      });
    },
    throwOnError: false,
  });
};

export default useToggleEquipmentMutation;
