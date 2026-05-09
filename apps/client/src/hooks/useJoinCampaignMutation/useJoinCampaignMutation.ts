import { useMutation, useQueryClient } from '@tanstack/react-query';
import joinCampaign from './joinCampaign';
import { AuthContext } from 'src/contexts/AuthContext';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const useJoinCampaignMutation = (campaignId: number) => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => joinCampaign(campaignId),
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ['user', user.id],
      });
      queryClient.setQueryData(['campaign', campaignId], data.campaign);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useJoinCampaignMutation;
