import { useMutation, useQueryClient } from '@tanstack/react-query';
import passReaction from './passReaction';
import { Encounter } from 'src/types/encounter';

const usePassReactionMutation = (campaignId: number, encounterId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (characterId: number) => {
      return passReaction(campaignId, encounterId, characterId);
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
          passes: [...prev.passes, characterId],
        }),
      );

      return prevEncounter;
    },
    throwOnError: false,
  });
};

export default usePassReactionMutation;
