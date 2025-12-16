import { useMutation } from '@tanstack/react-query';
import confirmActionQueue from './confirmActionQueue';
import useAdvanceTurnMutation from '../useAdvanceTurnMutation/useAdvanceTurnMutation';
import { socket } from 'src/socket';
import useCombatStore from 'src/stores/combatStore';
import { useNavigate } from 'react-router-dom';

const useConfirmActionQueueMutation = (
  campaignId: number,
  encounterId: number,
) => {
  const advanceTurn = useAdvanceTurnMutation(campaignId, encounterId);
  const setTarget = useCombatStore((state) => state.setTarget);
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
    onSuccess: () => {
      advanceTurn.mutate();
      socket.emit('resetBoard', {
        encounterId: Number(encounterId),
      });
      setTarget(null);
      navigate('..');
    },
    throwOnError: false,
  });
};

export default useConfirmActionQueueMutation;
