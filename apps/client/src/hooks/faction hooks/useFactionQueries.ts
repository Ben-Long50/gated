import { useQueries } from '@tanstack/react-query';
import { Faction } from 'src/types/faction';
import getFaction from './getFaction';

const useFactionQueries = (factionIds: number[]) => {
  return useQueries<Faction[]>({
    queries: factionIds.map((factionId) => ({
      queryKey: ['faction', factionId],
      queryFn: () => getFaction.fetch(factionId),
      enabled: !!factionId,
    })),
    combine: (results) => {
      return {
        factions: results.map((result) => result.data).filter((data) => data),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
};

export default useFactionQueries;
