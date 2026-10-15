import { useMutation, useQueryClient } from '@tanstack/react-query';
import joinCampaign from './joinCampaign';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const useJoinCampaignMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (characterId: number) => joinCampaign(campaignId, characterId),
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ['authenticatedUser'],
      });

      queryClient.setQueryData(['campaign', campaignId], data.campaign);
      queryClient.setQueryData(
        ['character', data.character.id],
        data.character,
      );

      navigate(-1);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useJoinCampaignMutation;
