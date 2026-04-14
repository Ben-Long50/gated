import { useMutation, useQueryClient } from '@tanstack/react-query';
import createPerk from './createPerk';
import { toast } from 'react-toastify';
import { Perk } from 'src/types/perk';

const useCreatePerkMutation = (perkId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: Perk) => {
      return createPerk(formData);
    },
    onSuccess: () => {
      const message = perkId
        ? 'Perk successfully updated'
        : 'Perk successfully created';

      toast(message);

      queryClient.invalidateQueries({
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

export default useCreatePerkMutation;
