import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateFaction from './updateFaction';
import { toast } from 'react-toastify';

const useUpdateFactionMutation = (campaignId: number, factionId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return updateFaction(formData, campaignId, factionId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      return queryClient.setQueryData(['faction', factionId], data.faction);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useUpdateFactionMutation;
