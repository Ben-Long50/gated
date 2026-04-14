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
    onSuccess: () => {
      toast('Campaign successfully deleted');

      navigate('/glam/campaigns');

      queryClient.removeQueries({ queryKey: ['campaign', campaignId] });

      return queryClient.invalidateQueries({
        queryKey: ['campaigns'],
        exact: false,
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteCampaignMutation;
