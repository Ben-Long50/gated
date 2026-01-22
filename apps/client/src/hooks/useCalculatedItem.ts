import calculateItemStats from 'src/utils/calculateItemStats';
import useItemQuery from './useItemQuery/useItemQuery';

const useCalculatedItem = (itemId: number) => {
  const { data: item, isLoading } = useItemQuery(itemId);

  const calculatedItem = calculateItemStats(item);

  return { calculatedItem, isLoading };
};

export default useCalculatedItem;
