import { useMutation, useQueryClient } from '@tanstack/react-query';
import scheduleReaction from './scheduleReaction';
import { Encounter } from 'src/types/encounter';

const useScheduleReactionMutation = (
  campaignId: number,
  encounterId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (characterId: number) => {
      return scheduleReaction(campaignId, encounterId, characterId);
    },
    onMutate: (characterId) => {
      const prevEncounter: Encounter | undefined = queryClient.getQueryData([
        'encounter',
        encounterId,
      ]);

      queryClient.setQueryData(
        ['encounter', encounterId],
        (prev: Encounter) => ({
          ...prev,
          reactions: [...prev.reactions, characterId],
        }),
      );

      return prevEncounter;
    },
    throwOnError: false,
  });
};

export default useScheduleReactionMutation;
