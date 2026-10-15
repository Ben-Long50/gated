import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import createCombat from './createCombat';
import { useNavigate } from 'react-router-dom';

const useCreateCombatMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: {
      id?: number;
      combatPhase?: string;
      mapId: number;
      turnOrder: number[];
      turnPosition: number;
    }) => {
      return createCombat(campaignId, formData);
    },
    onSuccess: (data, formData) => {
      if (formData.id) {
        socket.emit('encounter', { campaignId, encounterId: formData.id });
        socket.emit('navigateToEncounter', {
          encounterId: formData.id,
          mapId: formData.mapId,
          campaignId,
        });
        navigate('..');
      } else {
        socket.emit('campaign', campaignId);
        navigate('../pending');
      }
      return queryClient.invalidateQueries({
        queryKey: ['encounter', data.encounterId],
      });
    },
    throwOnError: false,
  });
};

export default useCreateCombatMutation;
