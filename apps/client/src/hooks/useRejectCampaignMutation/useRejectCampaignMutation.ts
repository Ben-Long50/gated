import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import rejectCampaign from './rejectCampaign';
import { toast } from 'react-toastify';

const useRejectCampaignMutation = (campaignId: number) => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => rejectCampaign(campaignId),
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ['user', user.id],
      });
      queryClient.removeQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useRejectCampaignMutation;
