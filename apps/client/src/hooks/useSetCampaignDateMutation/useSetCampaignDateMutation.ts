import { useMutation, useQueryClient } from '@tanstack/react-query';
import setCampaignDate from './setCampaignDate';
import { Month } from '@gated/shared';
import { socket } from 'src/socket';

const useSetCampaignDateMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: { month: Month; day: number }) => {
      return setCampaignDate(campaignId, formData);
    },
    onSuccess: () => {
      socket.emit('campaign', campaignId);
      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    throwOnError: false,
  });
};

export default useSetCampaignDateMutation;
