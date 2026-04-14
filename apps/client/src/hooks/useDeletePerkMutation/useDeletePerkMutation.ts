import { useMutation, useQueryClient } from '@tanstack/react-query';
import deletePerk from './deletePerk';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useDeletePerkMutation = (perkId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return deletePerk(perkId);
    },
    onSuccess: () => {
      toast('Perk deleted successfully');
      navigate('/glam/codex/perks');

      queryClient.removeQueries({
        queryKey: ['perk', perkId],
      });

      return queryClient.invalidateQueries({
        queryKey: ['perks'],
        exact: false,
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useDeletePerkMutation;
