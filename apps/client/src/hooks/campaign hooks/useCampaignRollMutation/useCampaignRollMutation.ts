import { useMutation } from '@tanstack/react-query';
import campaignRoll from './campaignRoll';
import { Character } from 'src/types/character';
import { Action } from '@cloudinary/url-gen/internal/Action';

const useRollActionMutation = (campaignId: number) => {
  return useMutation({
    mutationFn: (rollData: {
      character: Character;
      action: Action;
      modifiers: string[];
      extraDice: number;
    }) => {
      return campaignRoll(campaignId, rollData);
    },
    throwOnError: false,
  });
};

export default useRollActionMutation;
