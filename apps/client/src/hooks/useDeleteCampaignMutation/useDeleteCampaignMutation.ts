import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import deleteCampaign from './deleteCampaign';

const useDeleteCampaignMutation = (
  campaignId: number,
  setFormMessage: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteCampaign(campaignId);
    },
    onSuccess: () => {
      navigate('/glam/campaigns');
      queryClient.removeQueries({ queryKey: ['campaign', campaignId] });
      return queryClient.invalidateQueries({
        queryKey: ['campaigns'],
        exact: false,
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useDeleteCampaignMutation;
