import { useQuery } from '@tanstack/react-query';
import getMap from './getMap';
import { Map } from '@gated/shared';

const useMapQuery = (mapId: number) => {
  return useQuery<Map>({
    queryKey: ['map', mapId],
    queryFn: () => getMap.fetch(mapId),
    throwOnError: false,
    enabled: !!mapId,
  });
};

export default useMapQuery;
