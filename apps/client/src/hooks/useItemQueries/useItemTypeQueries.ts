import { useQueries } from '@tanstack/react-query';
import { Item, ItemType } from 'src/types/item';
import getItems from './getItems';
import { itemTypes } from 'src/utils/constants/itemConstants';

const useItemTypeQueries = (types: ItemType[]) => {
  return useQueries({
    queries: types?.map((type) => ({
      queryKey: [type],
      queryFn: () => getItems.fetch(type),
      enabled: itemTypes.some((t) => t === type),
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
