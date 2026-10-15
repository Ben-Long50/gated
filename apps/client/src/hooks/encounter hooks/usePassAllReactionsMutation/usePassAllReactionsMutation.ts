import { useMutation, useQueryClient } from '@tanstack/react-query';
import passAllReactions from './passAllReactions';
import { Encounter } from 'src/types/encounter';

const usePassAllReactionsMutation = (
  campaignId: number,
  encounterId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return passAllReactions(campaignId, encounterId);
    },
    onMutate: () => {
      const prevEncounter: Encounter | undefined = queryClient.getQueryData([
        'encounter',
        encounterId,
      ]);

      if (!prevEncounter) {
        return undefined;
      }

      const reactiveIds = prevEncounter?.turnOrder.filter(
        (_: number, index: number) => index !== prevEncounter.turnPosition,
      );

      queryClient.setQueryData(
        ['encounter', encounterId],
        (prev: Encounter) => ({
          ...prev,
          reactions: [],
          passes: reactiveIds,
        }),
      );

      return prevEncounter;
    },
    throwOnError: false,
  });
};

export default usePassAllReactionsMutation;
