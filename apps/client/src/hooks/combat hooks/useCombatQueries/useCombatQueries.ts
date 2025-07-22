import { useQueries } from '@tanstack/react-query';
import getCombat from './getCombat';

const useCombatQueries = (combatIds: number[]) => {
  return useQueries({
    queries: combatIds.map((combatId) => ({
      queryKey: ['encounter', combatId],
      queryFn: () => getCombat.fetch(combatId),
      enabled: !!combatId,
    })),
    combine: (results) => {
      return {
        combats: results.map((result) => result.data).filter((data) => data),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
};

export default useCombatQueries;
