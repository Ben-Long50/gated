import { useQuery } from '@tanstack/react-query';
import getCampaignMap from './getCampaignMap';

const useCampaignMapQuery = (
  apiUrl: string,
  campaignId: number,
  mapId: number,
) => {
  return useQuery({
    queryKey: ['map', mapId],
    queryFn: () => getCampaignMap(apiUrl, campaignId, mapId),
    enabled: !!mapId,
    throwOnError: false,
  });
};

export default useCampaignMapQuery;
