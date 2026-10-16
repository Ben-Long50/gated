import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import editItemStat from './editItemStat';
import { toast } from 'react-toastify';
import { combineObjects, Item } from '@gated/shared';

const useItemStatMutation = () => {
  const queryClient = useQueryClient();
  const updateBuffer = useRef(new Map());
  const timeoutRef = useRef(new Map());

  return useMutation({
    mutationFn: (data: { itemId: number; stats: Record<string, number> }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current.get(data.itemId));
      }

      const prevBuffer = updateBuffer.current.get(data.itemId);

      updateBuffer.current.set(
        data.itemId,
        combineObjects(prevBuffer, data.stats),
      );

      return new Promise((resolve) => {
        const timer = setTimeout(async () => {
          const finalValue = updateBuffer.current.get(data.itemId);

          updateBuffer.current = new Map();

          const itemData = await editItemStat(data.itemId, finalValue);

          clearTimeout(timeoutRef.current.get(data.itemId));
          resolve(itemData);
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

      queryClient.setQueryData(['item', data.itemId], (prev: Item) => ({
        ...prev,
        stats: combineObjects(prev.stats, data.stats),
      })) as Item;

      return { prevItemData };
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['item', data.item.id], data.item);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useItemStatMutation;
