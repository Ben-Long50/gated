import { useQuery } from '@tanstack/react-query';
import getPerkById from './getPerkById';

const usePerkQuery = (perkId: string) => {
  return useQuery({
    queryKey: ['perk', perkId],
    queryFn: async () => await getPerkById(perkId),
  });
};

export default usePerkQuery;
