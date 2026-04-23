import { useQueries } from '@tanstack/react-query';
import getPerk from './getPerk';

const usePerkQueries = (perkIds: number[]) => {
  return useQueries({
    queries: perkIds.map((perkId) => ({
      queryKey: ['perk', perkId],
      queryFn: () => getPerk.fetch(perkId),
      enabled: !!perkId,
    })),
    combine: (results) => {
      return {
        perks: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
        isPending: results.some((result) => result.isPending),
      };
    },
  });
};

export default usePerkQueries;
