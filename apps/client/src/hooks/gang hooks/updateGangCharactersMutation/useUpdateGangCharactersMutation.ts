import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import updateGangCharacters from './updateGangCharacters';

const useUpdateGangCharactersMutation = (
  campaignId: number,
  gangId: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: { leaderIds: number[]; characterIds: number[] }) => {
      return updateGangCharacters(campaignId, gangId, value);
    },
    onSuccess: () => {
      socket.emit('gang', gangId);
      if (gangId) {
        return queryClient.invalidateQueries({
          queryKey: ['gang', gangId],
        });
      }
      return;
    },
    throwOnError: false,
  });
};

export default useUpdateGangCharactersMutation;
