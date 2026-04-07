import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import createGang from './createGang';

const useCreateGangMutation = (campaignId: number, gangId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createGang(campaignId, formData);
    },
    onSuccess: () => {
      socket.emit('campaign', campaignId);
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

export default useCreateGangMutation;
