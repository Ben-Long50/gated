import { useMutation } from '@tanstack/react-query';
import campaignRoll from './campaignRoll';
import { Character } from 'src/types/character';
import { Action } from '@cloudinary/url-gen/internal/Action';

const useRollActionMutation = (campaignId: number) => {
  return useMutation({
    mutationFn: (rollData: {
      characterId: number;
      actionId: number;
      modifiers: string[];
      extraDice: number | null;
    }) => {
      return campaignRoll(campaignId, rollData);
    },
    throwOnError: false,
  });
};

export default useRollActionMutation;
