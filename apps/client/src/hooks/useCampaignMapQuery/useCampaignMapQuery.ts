import { useQuery } from '@tanstack/react-query';
import getCampaignMap from './getCampaignMap';
import { Map } from '@gated/shared';

const useCampaignMapQuery = (mapId: number) => {
  return useQuery<Map>({
    queryKey: ['map', mapId],
    queryFn: () => getCampaignMap(mapId),
    enabled: !!mapId,
    throwOnError: false,
  });
};

export default useCampaignMapQuery;
