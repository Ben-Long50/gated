import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateFaction from './updateFaction';
import { toast } from 'react-toastify';

const useUpdateFactionMutation = (campaignId: number, factionId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return updateFaction(formData, campaignId, factionId);
    },
    onSuccess: () => {
      toast('Faction successfully updated');

      return queryClient.invalidateQueries({
        queryKey: ['faction', factionId],
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useUpdateFactionMutation;
