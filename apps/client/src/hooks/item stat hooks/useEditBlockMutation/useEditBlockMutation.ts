import { useMutation, useQueryClient } from '@tanstack/react-query';
import editArmorBlock from './editBlock';
import { useRef } from 'react';
import { Item } from 'src/types/item';
import { socket } from 'src/socket';
import useCombatStore from 'src/stores/combatStore';

const useEditBlockMutation = () => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef(0);

  const updateItem = useCombatStore((store) => store.updateItem);

  return useMutation({
    mutationFn: ({ itemId, value }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      updateBuffer.current += value;

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(async () => {
          const finalValue = updateBuffer.current;

          updateBuffer.current = 0;
          await editArmorBlock(itemId, finalValue);
          resolve(finalValue);
        }, 1000);
      });
    },

    onMutate: ({ itemId, value }) => {
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
            currentBlock: prevItemData?.stats.currentBlock
              ? prevItemData?.stats.currentBlock + value
              : value,
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

export default useEditBlockMutation;
