import { useQuery } from '@tanstack/react-query';
import getPerks from './getPerks';
import { Perk } from 'src/types/perk';

const usePerksQuery = () => {
  return useQuery<Perk[]>({
    queryKey: ['perks'],
    queryFn: async () => await getPerks(),
  });
};

export default usePerksQuery;
