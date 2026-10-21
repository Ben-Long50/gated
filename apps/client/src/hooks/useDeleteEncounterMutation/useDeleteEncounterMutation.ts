import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import deleteEncounter from './deleteEncounter';

const useDeleteEncounterMutation = (campaignId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (encounterId: number) =>
      deleteEncounter(campaignId, encounterId),
    onSuccess: (data, encounterId) => {
      toast.success(data.message);

      queryClient.removeQueries({
        queryKey: ['encounter', encounterId],
      });

      queryClient.setQueryData(['campaign', campaignId], (prev) => ({
        ...prev,
        encounters: prev.encounters.filter(
          (encounter) => encounter.id !== encounterId,
        ),
      }));
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useDeleteEncounterMutation;
