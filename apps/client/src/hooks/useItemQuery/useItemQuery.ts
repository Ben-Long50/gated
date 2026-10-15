import { useQuery } from '@tanstack/react-query';
import getItemById from './getItemById';
import { Item } from 'src/types/item';

const useItemQuery = (itemId: number) => {
  return useQuery<Item>({
    queryKey: ['item', itemId],
    queryFn: async () => await getItemById.fetch(itemId),
    enabled: !!itemId,
  });
};

export default useItemQuery;
