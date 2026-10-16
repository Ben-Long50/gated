import { useQueries } from '@tanstack/react-query';
import { ItemType } from '@gated/shared';
import getItems from './getItems';
import { itemTypes } from '@gated/shared';

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
