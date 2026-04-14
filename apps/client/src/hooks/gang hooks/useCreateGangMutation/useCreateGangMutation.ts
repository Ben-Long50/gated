import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import createGang from './createGang';
import { toast } from 'react-toastify';

const useCreateGangMutation = (campaignId: number, gangId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createGang(campaignId, formData);
    },
    onSuccess: () => {
      const message = gangId
        ? 'Gang successfully updated'
        : 'Gang successfully created';

      toast(message);

      socket.emit('campaign', campaignId);

      if (gangId) {
        return queryClient.invalidateQueries({
          queryKey: ['gang', gangId],
        });
      }
      return;
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateGangMutation;
