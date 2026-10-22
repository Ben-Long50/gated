import { useMutation } from '@tanstack/react-query';
import rollInitiative from './rollInitiative';

const useRollInitiativeMutation = (campaignId: number, encounterId: number) => {
  return useMutation({
    mutationFn: (
      rollData: [number, { modifiers: string[]; extraDice: number }][],
    ) => {
      return rollInitiative(campaignId, encounterId, rollData);
    },
    throwOnError: false,
  });
};

export default useRollInitiativeMutation;
