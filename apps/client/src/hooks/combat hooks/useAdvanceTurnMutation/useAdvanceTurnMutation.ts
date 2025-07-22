import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import advanceTurn from './advanceTurn';

const useAdvanceTurnMutation = (campaignId: number, encounterId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (turn: number) => {
      return advanceTurn(encounterId, turn);
    },
    onSuccess: () => {
      socket.emit('advanceTurn', { campaignId, encounterId });
      return queryClient.invalidateQueries({
        queryKey: ['encounter', encounterId],
      });
    },
    throwOnError: false,
  });
};

export default useAdvanceTurnMutation;
