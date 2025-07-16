import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateLiveCampaign from './updateLiveCampaign';

const useUpdateLiveCampaignMutation = (userId: number, campaignId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return updateLiveCampaign(userId, campaignId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] });
      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    throwOnError: false,
  });
};

export default useUpdateLiveCampaignMutation;
