import { calculateItemStats } from '@gated/shared';
import useItemQuery from './useItemQuery/useItemQuery';

const useCalculatedItem = (itemId: number) => {
  const { data: item, isLoading } = useItemQuery(itemId);

  const calculatedItem = calculateItemStats(item);

  return { calculatedItem, isLoading };
};

export default useCalculatedItem;
