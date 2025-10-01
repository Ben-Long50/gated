import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import createCombat from './createCombat';
import { useNavigate } from 'react-router-dom';

const useCreateCombatMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: {
      mapId: number;
      turnOrder: number[];
      turnPosition: number;
    }) => {
      return createCombat(campaignId, formData);
    },
    onSuccess: (data) => {
      socket.emit('encounter', { campaignId, encounterId: data.encounterId });
      navigate('../pending');
      return queryClient.invalidateQueries({
        queryKey: ['encounter', data.encounterId],
      });
    },
    throwOnError: false,
  });
};

export default useCreateCombatMutation;
