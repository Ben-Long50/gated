import { useQueries } from '@tanstack/react-query';
import getItems from '../useItemsQuery/getItems';

const useAllItemsQuery = () => {
  const categories = [
    'weapon',
    'armor',
    'cybernetic',
    'mutation',
    'vehicle',
    'drone',
    'modification',
    'consumable',
    'reusable',
  ];

  return useQueries({
    queries: categories.map((category) => ({
      queryKey: [category],
      queryFn: () => getItems(category),
    })),
    combine: (results) => ({
      data: results.flatMap((result) => result.data),
      isLoading: results.some((result) => result.isLoading),
      isPending: results.some((result) => result.isPending),
    }),
  });
};

export default useAllItemsQuery;
