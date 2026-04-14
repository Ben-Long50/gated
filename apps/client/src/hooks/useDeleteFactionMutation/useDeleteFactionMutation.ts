import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import deleteFaction from './deleteFaction';
import { toast } from 'react-toastify';

const useDeleteFactionMutation = (campaignId: number, factionId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deleteFaction(campaignId, factionId);
    },
    onSuccess: () => {
      toast('Faction successfully deleted');

      navigate(`/glam/campaigns/${campaignId}`);

      queryClient.invalidateQueries({
        queryKey: ['faction', factionId],
      });

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

export default useDeleteFactionMutation;
