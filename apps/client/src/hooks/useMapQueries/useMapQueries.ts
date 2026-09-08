import { useQueries } from '@tanstack/react-query';
import getMap from './getMap';

const useMapQueries = (mapIds: number[]) => {
  return useQueries({
    queries: mapIds.map((mapId) => ({
      queryKey: ['map', mapId],
      queryFn: () => getMap.fetch(mapId),
      enabled: !!mapId,
    })),
    combine: (results) => {
      return {
        maps: results.map((result) => result.data).filter(Boolean) ?? [],
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
};

export default useMapQueries;
