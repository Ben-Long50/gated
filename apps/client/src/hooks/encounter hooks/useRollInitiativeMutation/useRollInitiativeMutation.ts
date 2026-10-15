import { useMutation } from '@tanstack/react-query';
import rollInitiative from './rollInitiative';

const useRollInitiativeMutation = (campaignId: number, encounterId: number) => {
  return useMutation({
    mutationFn: () => {
      return rollInitiative(campaignId, encounterId);
    },
    throwOnError: false,
  });
};

export default useRollInitiativeMutation;
