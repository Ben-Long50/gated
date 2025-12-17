import { useMutation, useQueryClient } from '@tanstack/react-query';
import rollAction from './rollAction';
import { Encounter } from 'src/types/encounter';

const useRollActionMutation = (campaignId: number, encounterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actionData: {
      activeCharacterId: number;
      targetCharacterId?: number;
      actionId: number;
      modifiers: string[];
      extraDice: number;
      itemId?: number;
    }) => {
      return rollAction(campaignId, encounterId, actionData);
    },
    onMutate: (actionData) => {
      const prevEncounter: Encounter | undefined = queryClient.getQueryData([
        'encounter',
        encounterId,
      ]);

      queryClient.setQueryData(
        ['encounter', encounterId],
        (prev: Encounter) => ({
          ...prev,
          combatPhase: 'reaction',
        }),
      );

      return prevEncounter;
    },
    throwOnError: false,
  });
};

export default useRollActionMutation;
