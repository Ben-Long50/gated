import { useMutation, useQueryClient } from '@tanstack/react-query';
import rollAction from './rollAction';
import { Encounter } from 'src/types/encounter';
import { Character } from 'src/types/character';
import { Item } from 'src/types/item';

const useRollActionMutation = (campaignId: number, encounterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (actionData: {
      activeCharacterId: number;
      targetCharacterId?: number;
      actionId: number;
      itemId?: number;
      tile?: {
        start: { row: number; col: number };
        end: { row: number; col: number };
      };
      modifiers: string[];
      extraDice: number;
    }) => {
      return rollAction(campaignId, encounterId, actionData);
    },
    onMutate: (actionData) => {
      const prevCharacter: Character | undefined = queryClient.getQueryData([
        'character',
        actionData.activeCharacterId,
      ]);

      const prevItem: Item | undefined = queryClient.getQueryData([
        'item',
        actionData.itemId,
      ]);

      let usedHands = 0;

      if (prevItem) {
        queryClient.setQueryData(['item', actionData.itemId], {
          ...prevItem,
          available: false,
        });

        if (prevItem.keywords.some((key) => key.keyword.name === '1H')) {
          usedHands = 1;
        } else if (prevItem.keywords.some((key) => key.keyword.name === '1H')) {
          usedHands = 2;
        }
      }

      queryClient.setQueryData(['character', actionData.activeCharacterId], {
        ...prevCharacter,
        stats: {
          ...prevCharacter?.stats,
          currentActions: prevCharacter?.stats.currentActions
            ? prevCharacter?.stats.currentActions - 1
            : 0,
          currentHands: prevCharacter?.stats.currentHands
            ? prevCharacter?.stats.currentHands - usedHands
            : 0,
        },
      });

      const prevEncounter: Encounter | undefined = queryClient.getQueryData([
        'encounter',
        encounterId,
      ]);

      queryClient.setQueryData(['encounter', encounterId], {
        ...prevEncounter,
        combatPhase: 'reaction',
      });

      return prevEncounter;
    },
    throwOnError: false,
  });
};

export default useRollActionMutation;
