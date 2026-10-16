import { calculateItemStats } from '@gated/shared';
import useItemQuery from './useItemQuery/useItemQuery';

const useItem = (itemId: number) => {
  const { data, isLoading, isPending } = useItemQuery(itemId);

  const item = calculateItemStats(data);

  return { item, isLoading, isPending };
};

export default useItem;
