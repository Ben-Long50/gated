import { useQuery } from '@tanstack/react-query';
import getFaction from './getFaction';

const useFactionQuery = (factionId: number) => {
  return useQuery({
    queryKey: ['faction', factionId],
    queryFn: async () => await getFaction(factionId),
    throwOnError: false,
    enabled: !!factionId,
  });
};

export default useFactionQuery;
