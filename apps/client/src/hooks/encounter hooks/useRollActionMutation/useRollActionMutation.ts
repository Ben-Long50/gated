import { useMutation } from '@tanstack/react-query';
import rollAction from './rollAction';

const useRollActionMutation = (campaignId: number, encounterId: number) => {
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
    throwOnError: false,
  });
};

export default useRollActionMutation;
