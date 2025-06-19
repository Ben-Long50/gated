import { useMutation, useQueryClient } from '@tanstack/react-query';
import setCampaignDate from './setCampaignDate';
import { Month } from 'src/types/campaign';
import { socket } from 'src/socket';

const useSetCampaignDateMutation = (apiUrl: string, campaignId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: { month: Month; day: number }) => {
      return setCampaignDate(apiUrl, campaignId, formData);
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
