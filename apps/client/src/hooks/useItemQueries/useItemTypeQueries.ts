import { useQueries } from '@tanstack/react-query';
import { Item, ItemType } from 'src/types/item';
import getItems from './getItems';

const useItemTypeQueries = (itemTypes: ItemType[]) => {
  console.log(itemTypes);

  return useQueries({
    queries: itemTypes?.map((type) => ({
      queryKey: [type],
      queryFn: () => getItems.fetch(type),
      enabled: !!type,
    })),
    combine: (results) => {
      return {
        items: results.flatMap((result) => result.data ?? []),
        isLoading: results?.some((result) => result.isLoading),
        isPending: results?.some((result) => result.isPending),
      };
    },
  });
};

export default useItemTypeQueries;
