import { useQuery } from '@tanstack/react-query';
import getCombat from './getCombat';

const useCombatQuery = (combatId: number) => {
  return useQuery<Combat>({
    queryKey: ['encounter', combatId],
    queryFn: () => getCombat.fetch(combatId),
    enabled: !!combatId,
    throwOnError: false,
  });
};

export default useCombatQuery;
