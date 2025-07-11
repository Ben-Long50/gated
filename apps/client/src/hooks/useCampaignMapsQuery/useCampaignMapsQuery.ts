import { useQuery } from '@tanstack/react-query';
import getCampaignMaps from './getCampaignMaps';
import { Map } from 'src/types/map';

const useCampaignMapsQuery = (apiUrl: string, campaignId: number) => {
  return useQuery<Map[]>({
    queryKey: ['maps', campaignId],
    queryFn: () => getCampaignMaps(apiUrl, campaignId),
    throwOnError: false,
  });
};

export default useCampaignMapsQuery;
