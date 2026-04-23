import { useQuery } from '@tanstack/react-query';
import { Faction } from 'src/types/faction';
import getFaction from './getFaction';

const useFactionQuery = (factionId: number) => {
  return useQuery<Faction>({
    queryKey: ['faction', factionId],
    queryFn: () => getFaction.fetch(factionId),
    enabled: !!factionId,
    throwOnError: false,
  });
};

export default useFactionQuery;
