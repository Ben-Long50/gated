import { useQuery } from '@tanstack/react-query';
import getAffiliation from './getAffiliation';
import { Affiliation } from '@gated/shared';

const useAffiliationQuery = (affiliationId: number) => {
  return useQuery<Affiliation>({
    queryKey: ['affiliation', affiliationId],
    queryFn: () => getAffiliation.fetch(affiliationId),
    enabled: !!affiliationId,
    throwOnError: false,
  });
};

export default useAffiliationQuery;
