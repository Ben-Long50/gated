import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import editPass from './editPass';
import { Item } from 'src/types/item';
import { socket } from 'src/socket';
import useCombatStore from 'src/stores/combatStore';

const useEditPassMutation = (itemId: number) => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef(0);

  const updateItem = useCombatStore((store) => store.updateItem);

  return useMutation({
    mutationFn: (value: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateBuffer.current += value;

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          const finalValue = updateBuffer.current;

          updateBuffer.current = 0;
          await editPass(itemId, finalValue);
          resolve(finalValue);
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
            currentPass: prevItemData?.stats.currentPass
              ? prevItemData?.stats.currentPass + value
              : value,
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

export default useEditPassMutation;
