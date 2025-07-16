import { useQuery } from '@tanstack/react-query';
import getCampaignMap from './getCampaignMap';
import { Map } from 'src/types/map';

const useCampaignMapQuery = (campaignId: number, mapId: number) => {
  return useQuery<Map>({
    queryKey: ['map', mapId],
    queryFn: () => getCampaignMap(campaignId, mapId),
    enabled: !!mapId,
    throwOnError: false,
  });
};

export default useCampaignMapQuery;
