import { useQueries } from '@tanstack/react-query';
import getLocation from './getLocation';
import { Location } from '@gated/shared';

const useLocationQueries = (locationIds: number[]) => {
  return useQueries({
    queries: locationIds.map((locationId) => ({
      queryKey: ['location', locationId],
      queryFn: () => getLocation.fetch(locationId),
      enabled: !!locationId,
    })),
    combine: (results) => {
      return {
        locations: results.map((result) => result.data) as Location[],
        isLoading: results.some((result) => result.isLoading),
        isPending: results.some((result) => result.isPending),
      };
    },
  });
};

export default useLocationQueries;
