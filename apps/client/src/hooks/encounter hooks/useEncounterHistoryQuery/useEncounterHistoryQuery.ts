import { useQuery } from '@tanstack/react-query';
import getEncounterHistory from './getEncounterHistory';
import { PhaseHistory } from 'src/types/encounter';

const useEncounterHistoryQuery = (encounterId: number) => {
  return useQuery<PhaseHistory[]>({
    queryKey: ['encounterHistory', encounterId],
    queryFn: async () => {
      const history = await getEncounterHistory(encounterId);
      return history.filter((entry: PhaseHistory) => entry.action);
    },
    enabled: !!encounterId,
    throwOnError: false,
  });
};

export default useEncounterHistoryQuery;
