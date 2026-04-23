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
    onSuccess: (data) => {
      toast.success(data.message);

      navigate(`/glam/campaigns/${campaignId}`);

      queryClient.removeQueries({
        queryKey: ['faction', factionId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteFactionMutation;
