import { useMutation, useQueryClient } from '@tanstack/react-query';
import toggleCampaign from './toggleCampaign';

const useToggleCampaignMutation = (campaignId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return toggleCampaign(campaignId);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    throwOnError: false,
  });
};

export default useToggleCampaignMutation;
