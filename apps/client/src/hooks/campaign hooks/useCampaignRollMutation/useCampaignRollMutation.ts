import { useMutation } from '@tanstack/react-query';
import campaignRoll from './campaignRoll';
import { toast } from 'react-toastify';

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
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (data) => {
      toast.success(data.message);
    },
    throwOnError: false,
  });
};

export default useRollActionMutation;
