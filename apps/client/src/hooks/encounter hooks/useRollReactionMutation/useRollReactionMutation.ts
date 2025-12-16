import { useMutation } from '@tanstack/react-query';
import rollReaction from './rollReaction';

const useRollReactionMutation = (campaignId: number, encounterId: number) => {
  return useMutation({
    mutationFn: (reactionData: {
      reactiveCharacterId: number;
      targetCharacterId?: number;
      reactionId: number;
      modifiers: string[];
      extraDice: number;
      itemId?: number;
    }) => {
      return rollReaction(campaignId, encounterId, reactionData);
    },
    throwOnError: false,
  });
};

export default useRollReactionMutation;
