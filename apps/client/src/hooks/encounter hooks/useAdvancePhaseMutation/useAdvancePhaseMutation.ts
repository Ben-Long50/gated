import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Encounter } from 'src/types/encounter';
import advancePhase from './advancePhase';

const useAdvancePhaseMutation = (campaignId: number, encounterId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return advancePhase(campaignId, encounterId);
    },
    onMutate: () => {
      const prevEncounter: Encounter | undefined = queryClient.getQueryData([
        'encounter',
        encounterId,
      ]);

      let nextPhase;

      switch (prevEncounter?.combatPhase) {
        case 'pending':
          nextPhase = 'initiative';
          break;
        case 'initiative':
          nextPhase = 'action';
          break;
        case 'action':
          nextPhase = 'reaction';
          break;
        case 'reaction':
          nextPhase = 'action';
          break;
        default:
          nextPhase = null;
          break;
      }

      queryClient.setQueryData(
        ['encounter', encounterId],
        (prev: Encounter) => ({
          ...prev,
          combatPhase: nextPhase,
        }),
      );

      return prevEncounter;
    },
    throwOnError: false,
  });
};

export default useAdvancePhaseMutation;
