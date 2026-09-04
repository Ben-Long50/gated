import { useQuery } from '@tanstack/react-query';
import getMap from './getMap';
import { Map } from 'src/types/map';

const useMapQuery = (mapId: number) => {
  return useQuery<Map>({
    queryKey: ['map', mapId],
    queryFn: () => getMap.fetch(mapId),
    throwOnError: false,
    enabled: !!mapId,
  });
};

export default useMapQuery;
