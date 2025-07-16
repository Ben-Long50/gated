import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateFaction from './updateFaction';

const useUpdateFactionMutation = (
  campaignId: number,
  factionId: number,
  setFormMessage: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return updateFaction(formData, campaignId, factionId);
    },
    onSuccess: () => {
      setFormMessage('Faction successfully updated');
      return queryClient.invalidateQueries({
        queryKey: ['faction', factionId],
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useUpdateFactionMutation;
