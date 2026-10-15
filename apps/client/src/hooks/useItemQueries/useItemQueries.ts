import { useQueries } from '@tanstack/react-query';
import getItemById from '../useItemQuery/getItemById';
import { Item } from 'src/types/item';

const useItemQueries = (itemsIds: number[], enabled = true) => {
  return useQueries({
    queries: itemsIds?.map((itemId) => ({
      queryKey: ['item', itemId],
      queryFn: () => getItemById.fetch(itemId),
      enabled: enabled,
    })),
    combine: (results) => {
      return {
        items: results?.map((result) => result.data) as Item[],
        isLoading: results?.some((result) => result.isLoading),
        isPending: results?.some((result) => result.isPending),
      };
    },
  });
};

export default useItemQueries;
