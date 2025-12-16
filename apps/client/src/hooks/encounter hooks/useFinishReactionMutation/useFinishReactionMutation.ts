import { useMutation, useQueryClient } from '@tanstack/react-query';
import finishReaction from './finishReaction';
import { Encounter } from 'src/types/encounter';

const useFinishReactionMutation = (campaignId: number, encounterId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (characterId: number) => {
      return finishReaction(campaignId, encounterId, characterId);
    },
    onMutate: (characterId) => {
      const prevEncounter: Encounter | undefined = queryClient.getQueryData([
        'encounter',
        encounterId,
      ]);

      if (!prevEncounter) {
        return undefined;
      }

      const updatedReactions =
        prevEncounter.reactions.filter((id) => id !== characterId) || [];

      const updatedPasses = !prevEncounter.passes.includes(characterId)
        ? [...prevEncounter.passes, characterId]
        : prevEncounter.passes;

      queryClient.setQueryData(
        ['encounter', encounterId],
        (prev: Encounter) => ({
          ...prev,
          reactions: updatedReactions,
          passes: updatedPasses,
        }),
      );

      return prevEncounter;
    },
    throwOnError: false,
  });
};

export default useFinishReactionMutation;
