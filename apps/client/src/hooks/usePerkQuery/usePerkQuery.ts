import { useQuery } from '@tanstack/react-query';
import getPerkById from './getPerkById';
import { Perk } from 'src/types/perk';

const usePerkQuery = (perkId: number) => {
  return useQuery<Perk>({
    queryKey: ['perk', perkId],
    queryFn: async () => await getPerkById(perkId),
  });
};

export default usePerkQuery;
