import { useMutation, useQueryClient } from '@tanstack/react-query';
import editArmorBlock from './editBlock';
import { useRef } from 'react';
import { Item } from 'src/types/item';
import { socket } from 'src/socket';

const useEditBlockMutation = (itemId: number) => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(0);
  const timeoutRef = useRef(0);

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
          await editArmorBlock(itemId, finalValue);
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

      queryClient.setQueryData(['item', itemId], (prev: Item) => ({
        ...prev,
        stats: {
          ...prevItemData?.stats,
          currentBlock: prevItemData?.stats.currentBlock
            ? prevItemData?.stats.currentBlock + value
            : value,
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

export default useEditBlockMutation;
