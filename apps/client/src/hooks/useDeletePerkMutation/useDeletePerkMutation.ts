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
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/glam/codex/perks');

      queryClient.removeQueries({
        queryKey: ['perk', perkId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeletePerkMutation;
