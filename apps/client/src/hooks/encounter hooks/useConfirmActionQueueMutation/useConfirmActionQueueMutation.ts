import { useMutation, useQueryClient } from '@tanstack/react-query';
import confirmActionQueue from './confirmActionQueue';
import useCombatStore from 'src/stores/combatStore';
import { useNavigate } from 'react-router-dom';
import { Encounter } from 'src/types/encounter';

const useConfirmActionQueueMutation = (
  campaignId: number,
  encounterId: number,
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (
      blockData: {
        damage: number;
        blockedDamage: number;
        armorIds: number[];
      }[],
    ) => {
      return confirmActionQueue(campaignId, encounterId, blockData);
    },
    onMutate: () => {
      const prevEncounter: Encounter | undefined = queryClient.getQueryData([
        'encounter',
        encounterId,
      ]);

      queryClient.setQueryData(
        ['encounter', encounterId],
        (prev: Encounter) => ({
          ...prev,
          reactions: [],
          passes: [],
          combatPhase: 'action',
        }),
      );

      navigate('..');

      return prevEncounter;
    },
    throwOnError: false,
  });
};

export default useConfirmActionQueueMutation;
