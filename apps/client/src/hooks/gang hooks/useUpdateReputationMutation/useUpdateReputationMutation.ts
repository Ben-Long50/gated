import { useMutation, useQueryClient } from '@tanstack/react-query';
import updateFaction from './updateReputation';

const useUpdateReputationMutation = (campaignId: number, gangId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: number) => {
      return updateFaction(campaignId, gangId, value);
    },
    onMutate(value) {
      queryClient.cancelQueries({ queryKey: ['gang', gangId] });

      const prevGang = queryClient.getQueryData(['gang', gangId]);

      if (prevGang) {
        queryClient.setQueryData(['gang', gangId], () => ({
          ...prevGang,
          reputation: value,
        }));

        return prevGang;
      }

      return;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['gang', gangId],
      });
    },
    throwOnError: false,
  });
};

export default useUpdateReputationMutation;
