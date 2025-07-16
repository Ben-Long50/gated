import { useQuery } from '@tanstack/react-query';
import getItems from './getItems';
import { Item } from 'src/types/item';

const useItemsQuery = (category: string) => {
  return useQuery<Item[]>({
    queryKey: [category],
    queryFn: async () => await getItems(category),
  });
};

export default useItemsQuery;
