import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import createGang from './createGang';

const useCreateGangMutation = (
  campaignId: number,
  setFormMessage: (message: string) => void,
  gangId?: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createGang(campaignId, formData);
    },
    onSuccess: () => {
      setFormMessage('Gang successfully created');
      socket.emit('campaign', campaignId);
      if (gangId) {
        return queryClient.invalidateQueries({
          queryKey: ['gang', gangId],
        });
      }
      return;
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useCreateGangMutation;
