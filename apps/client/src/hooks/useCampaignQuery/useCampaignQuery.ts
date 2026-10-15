import { useQuery } from '@tanstack/react-query';
import getCampaign from './getCampaign';
import { Campaign } from 'src/types/campaign';

const useCampaignQuery = (campaignId: number) => {
  return useQuery<Campaign>({
    queryKey: ['campaign', campaignId],
    queryFn: () => getCampaign.fetch(campaignId),
    enabled: !!campaignId,
  });
};

export default useCampaignQuery;
