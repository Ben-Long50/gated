import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import setCampaignTime from './setCampaignTime';
import { useNavigate } from 'react-router-dom';

const useSetCampaignTimeMutation = (apiUrl: string, campaignId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: {
      hour: number;
      minute: number;
      second: number;
    }) => {
      return setCampaignTime(apiUrl, campaignId, formData);
    },
    onSuccess: () => {
      socket.emit('campaign', campaignId);
      navigate(-1);
      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    throwOnError: false,
  });
};

export default useSetCampaignTimeMutation;
