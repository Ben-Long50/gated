import { useQuery } from '@tanstack/react-query';
import getCampaignMaps from './getCampaignMaps';

const useCampaignMapsQuery = (apiUrl: string, campaignId: number) => {
  return useQuery({
    queryKey: ['maps', campaignId],
    queryFn: () => getCampaignMaps(apiUrl, campaignId),
    throwOnError: false,
  });
};

export default useCampaignMapsQuery;
