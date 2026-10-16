import { useMutation, useQueryClient } from '@tanstack/react-query';
import createPerk from './createPerk';
import { toast } from 'react-toastify';
import { Perk } from '@gated/shared';

const useCreatePerkMutation = (perkId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: Perk) => {
      return createPerk(formData);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ['perk', perkId],
      });

      return queryClient.invalidateQueries({
        queryKey: ['perks'],
        exact: false,
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreatePerkMutation;
