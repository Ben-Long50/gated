import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { Item, Stats } from 'src/types/item';
import { socket } from 'src/socket';
import useCombatStore from 'src/stores/combatStore';
import editItemStat from './editItemStat';

const useItemStatMutation = () => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(new Map());
  const timeoutRef = useRef(new Map());

  const updateItem = useCombatStore((store) => store.updateItem);

  return useMutation({
    mutationFn: (data: {
      itemId: number;
      stat: keyof Stats;
      value: number;
    }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current.get(data.itemId));
      }

      const prevBuffer = updateBuffer.current.get(data.itemId);

      updateBuffer.current.set(
        data.itemId,
        prevBuffer && prevBuffer[data.stat]
          ? {
              ...prevBuffer,
              [data.stat]: prevBuffer[data.stat] + data.value,
            }
          : {
              ...prevBuffer,
              [data.stat]: data.value,
            },
      );

      return new Promise((resolve) => {
        const timer = setTimeout(async () => {
          const finalValue = updateBuffer.current.get(data.itemId);

          updateBuffer.current = new Map();

          await editItemStat(data.itemId, data.stat, finalValue);

          resolve(finalValue);
        }, 1000);

        timeoutRef.current.set(data.itemId, timer);
      });
    },

    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ['item', data.itemId] });

      const prevItemData: Item | undefined = queryClient.getQueryData([
        'item',
        data.itemId,
      ]);

      let adjustedValue = prevItemData.stats[data.stat] + data.value;

      if (adjustedValue < 0) {
        adjustedValue = 0;
      }

      const newItemData = queryClient.setQueryData(
        ['item', data.itemId],
        (prev: Item) => ({
          ...prev,
          stats: {
            ...prev.stats,
            [data.stat]: adjustedValue,
          },
        }),
      ) as Item;

      updateItem(newItemData);

      return { prevItemData };
    },
    onSuccess: (_, data, context) => {
      socket.emit('item', {
        itemId: data.itemId,
        campaignId:
          context.prevItemData?.characterInventory?.character.campaignId,
      });
      return queryClient.invalidateQueries({
        queryKey: ['item', data.itemId],
      });
    },
    throwOnError: false,
  });
};

export default useItemStatMutation;
