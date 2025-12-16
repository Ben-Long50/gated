import { useQuery } from '@tanstack/react-query';
import getEncounterHistory from './getEncounterHistory';

const useEncounterHistoryQuery = (encounterId: number) => {
  return useQuery({
    queryKey: ['encounterHistory', encounterId],
    queryFn: () => getEncounterHistory(encounterId),
    enabled: !!encounterId,
    throwOnError: false,
  });
};

export default useEncounterHistoryQuery;
