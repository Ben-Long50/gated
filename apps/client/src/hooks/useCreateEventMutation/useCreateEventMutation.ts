import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import createEvent from './createEvent';
import { socket } from 'src/socket';

const useCreateEventMutation = (apiUrl: string, campaignId: number) => {
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
      return createEvent(apiUrl, campaignId, formData);
    },
    onSuccess: () => {
      socket.emit('campaign', campaignId);
      navigate(-1);
      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    throwOnError: false,
  });
};

export default useCreateEventMutation;
