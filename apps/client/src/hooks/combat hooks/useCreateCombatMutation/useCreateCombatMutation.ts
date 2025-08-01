import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import createCombat from './createCombat';

const useCreateCombatMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: {
      mapId: number;
      turnOrder: number[];
      turnPosition: number;
    }) => {
      return createCombat(campaignId, formData);
    },
    onSuccess: (data) => {
      socket.emit('encounter', data.encounterId);
      return queryClient.invalidateQueries({
        queryKey: ['encounter', data.encounterId],
      });
    },
    throwOnError: false,
  });
};

export default useCreateCombatMutation;
