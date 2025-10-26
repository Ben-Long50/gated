import { useMutation, useQueryClient } from '@tanstack/react-query';
import refreshAmmo from './refreshAmmo';
import { useRef } from 'react';
import { Item } from 'src/types/item';
import { socket } from 'src/socket';
import useCombatStore from 'src/stores/combatStore';

const useRefreshAmmoMutation = (itemId: number) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef(0);

  const updateItem = useCombatStore((store) => store.updateItem);

  return useMutation({
    mutationFn: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          await refreshAmmo(itemId);
          resolve(itemId);
        }, 1000);
      });
    },

    onMutate: (value) => {
      queryClient.cancelQueries({ queryKey: ['item', itemId] });

      const prevItemData: Item | undefined = queryClient.getQueryData([
        'item',
        itemId,
      ]);

      const newItemData = queryClient.setQueryData(
        ['item', itemId],
        (prev: Item) => ({
          ...prev,
          stats: {
            ...prevItemData?.stats,
            currentAmmoCount: prevItemData?.stats.magCapacity,
            currentMagCount: prevItemData?.stats.magCount
              ? prevItemData?.stats.magCount - 1
              : undefined,
          },
        }),
      ) as Item;

      updateItem(newItemData);

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

export default useRefreshAmmoMutation;
