import { useMutation, useQueryClient } from '@tanstack/react-query';
import reloadAmmo from './reloadAmmo';
import { useRef } from 'react';
import { Item } from 'src/types/item';
import { socket } from 'src/socket';

const useReloadAmmoMutation = (itemId: number) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(0);

  return useMutation({
    mutationFn: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          await reloadAmmo(itemId);
          resolve(itemId);
        }, 1000);
      });
    },

    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ['item', itemId] });

      const prevItemData: Item | undefined = queryClient.getQueryData([
        'item',
        itemId,
      ]);

      queryClient.setQueryData(['item', itemId], (prev: Item) => ({
        ...prev,
        stats: {
          ...prevItemData?.stats,
          currentAmmoCount: prevItemData?.stats.magCapacity,
          currentMagCount: prevItemData?.stats.currentMagCount
            ? prevItemData?.stats.currentMagCount - 1
            : undefined,
        },
      }));

      return { prevItemData };
    },
    onSuccess: (_, __, context) => {
      socket.emit('item', {
        itemId,
        campaignId:
          context.prevItemData?.characterInventory?.character.campaignId,
      });
      return queryClient.invalidateQueries({
        queryKey: ['item', itemId],
      });
    },
    throwOnError: false,
  });
};

export default useReloadAmmoMutation;
