import { useQuery } from '@tanstack/react-query';
import getCombat from './getCombat';
import { Encounter } from 'src/types/encounter';

const useCombatQuery = (combatId: number) => {
  return useQuery<Encounter>({
    queryKey: ['encounter', combatId],
    queryFn: () => getCombat.fetch(combatId),
    enabled: !!combatId,
    throwOnError: false,
  });
};

export default useCombatQuery;
