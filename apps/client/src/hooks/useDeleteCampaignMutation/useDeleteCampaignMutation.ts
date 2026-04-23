import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import deleteCampaign from './deleteCampaign';
import { toast } from 'react-toastify';

const useDeleteCampaignMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteCampaign(campaignId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      navigate('/glam/campaigns');

      queryClient.removeQueries({ queryKey: ['campaign', campaignId] });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteCampaignMutation;
