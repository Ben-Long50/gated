import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCampaign from './createCampaign';
import { socket } from 'src/socket';
import { toast } from 'react-toastify';

const useCreateCampaignMutation = (campaignId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createCampaign(formData);
    },
    onSuccess: () => {
      const message = campaignId
        ? 'Campaign successfully updated'
        : 'Campaign successfully created';

      toast(message);

      socket.emit('globalCampaign', campaignId);
      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateCampaignMutation;
