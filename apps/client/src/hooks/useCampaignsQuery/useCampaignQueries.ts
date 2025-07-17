import { useQueries } from '@tanstack/react-query';
import getCampaign from '../useCampaignQuery/getCampaign';

const useCampaignQueries = (campaignIds: number[]) => {
  return useQueries({
    queries: campaignIds.map((campaignId) => ({
      queryKey: ['campaign', campaignId],
      queryFn: () => getCampaign.fetch(campaignId),
      enabled: !!campaignId,
    })),
    combine: (results) => {
      return {
        campaigns: results.map((result) => result.data).filter((data) => data),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
};

export default useCampaignQueries;
