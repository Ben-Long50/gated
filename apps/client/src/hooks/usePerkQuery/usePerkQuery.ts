import { useQuery } from '@tanstack/react-query';
import { Perk } from 'src/types/perk';
import getPerk from '../usePerkQueries/getPerk';

const usePerkQuery = (perkId: number) => {
  return useQuery<Perk>({
    queryKey: ['perk', perkId],
    queryFn: () => getPerk.fetch(perkId),
    enabled: !!perkId,
  });
};

export default usePerkQuery;
