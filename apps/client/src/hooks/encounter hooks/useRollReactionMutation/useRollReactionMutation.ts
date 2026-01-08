import { useMutation, useQueryClient } from '@tanstack/react-query';
import rollReaction from './rollReaction';
import { Character } from 'src/types/character';
import { Item } from 'src/types/item';

const useRollReactionMutation = (campaignId: number, encounterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reactionData: {
      reactiveCharacterId: number;
      targetCharacterId?: number;
      reactionId: number;
      itemId?: number;
      tile?: {
        start: { row: number; col: number };
        end: { row: number; col: number };
      };
      modifiers: string[];
      extraDice: number;
    }) => {
      return rollReaction(campaignId, encounterId, reactionData);
    },
    onMutate: (reactionData) => {
      const prevCharacter: Character | undefined = queryClient.getQueryData([
        'character',
        reactionData.reactiveCharacterId,
      ]);

      const prevItem: Item | undefined = queryClient.getQueryData([
        'item',
        reactionData.itemId,
      ]);

      let usedHands = 0;

      if (prevItem) {
        queryClient.setQueryData(['item', reactionData.itemId], {
          ...prevItem,
          available: false,
        });

        if (prevItem.keywords.some((key) => key.keyword.name === '1H')) {
          usedHands = 1;
        } else if (prevItem.keywords.some((key) => key.keyword.name === '1H')) {
          usedHands = 2;
        }
      }

      queryClient.setQueryData(
        ['character', reactionData.reactiveCharacterId],
        {
          ...prevCharacter,
          stats: {
            ...prevCharacter?.stats,
            currentReactions: prevCharacter?.stats.currentActions
              ? prevCharacter?.stats.currentActions - 1
              : 0,
            currentHands: prevCharacter?.stats.currentHands
              ? prevCharacter?.stats.currentHands - usedHands
              : 0,
          },
        },
      );
    },
    throwOnError: false,
  });
};

export default useRollReactionMutation;
