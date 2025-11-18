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
      const encounters = results
        .map((result) => result.data)
        .filter((data) => data);

      return {
        activeEncounters: encounters.filter(
          (data) => data?.active && data?.combatPhase !== 'completed',
        ),
        inactiveEncounters: encounters.filter((data) => !data?.active),
        completedEncounters: encounters.filter(
          (data) => !data?.active && data?.combatPhase === 'completed',
        ),
        pendingEncounters: encounters.filter(
          (data) => data?.combatPhase === 'pending',
        ),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
};

export default useCombatQueries;
