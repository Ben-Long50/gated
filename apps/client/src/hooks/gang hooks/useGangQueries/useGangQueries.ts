import { useQueries } from '@tanstack/react-query';
import getGang from '../useGangQuery/getGang';

const useGangQueries = (gangIds: number[]) => {
  return useQueries({
    queries: gangIds.map((gangId) => ({
      queryKey: ['gang', gangId],
      queryFn: () => getGang.fetch(gangId),
      enabled: !!gangIds,
    })),
    combine: (results) => {
      return {
        gangs: results.map((result) => result.data).filter((data) => data),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
};

export default useGangQueries;
