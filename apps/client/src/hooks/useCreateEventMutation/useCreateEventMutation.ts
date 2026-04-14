import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import createEvent from './createEvent';
import { socket } from 'src/socket';
import { toast } from 'react-toastify';

const useCreateEventMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: {
      id?: number;
      characterId: number;
      name: string;
      description: string;
      month: string;
      day: number;
    }) => {
      return createEvent(campaignId, formData);
    },
    onSuccess: () => {
      toast('Event successfully created');

      socket.emit('campaign', campaignId);

      navigate(-1);

      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    onError: (data) => {
      toast(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateEventMutation;
