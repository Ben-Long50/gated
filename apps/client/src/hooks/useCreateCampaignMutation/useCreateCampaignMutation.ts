import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCampaign from './createCampaign';
import { socket } from 'src/socket';

const useCreateCampaignMutation = (
  setFormMessage: (message: string) => void,
  campaignId?: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createCampaign(formData);
    },
    onSuccess: () => {
      setFormMessage('Campaign successfully created');
      socket.emit('globalCampaign', campaignId);
      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useCreateCampaignMutation;
