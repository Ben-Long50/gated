import { useQuery } from '@tanstack/react-query';
import getCampaignMaps from './getCampaignMaps';
import { Map } from '@gated/shared';

const useCampaignMapsQuery = (campaignId: number) => {
  return useQuery<Map[]>({
    queryKey: ['maps', campaignId],
    queryFn: () => getCampaignMaps(campaignId),
    throwOnError: false,
  });
};

export default useCampaignMapsQuery;
