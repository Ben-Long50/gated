import { useQuery } from '@tanstack/react-query';
import { Gang } from 'src/types/gang';
import getGang from './getGang';

const useGangQuery = (campaignId: number, gangId: number) => {
  return useQuery<Gang>({
    queryKey: ['gang', gangId],
    queryFn: () => getGang.fetch(campaignId, gangId),
    enabled: !!gangId,
    throwOnError: false,
  });
};

export default useGangQuery;
