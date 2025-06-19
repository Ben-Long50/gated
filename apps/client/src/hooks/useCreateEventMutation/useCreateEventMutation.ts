import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import createEvent from './createEvent';

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
      // queryClient.invalidateQueries({
      //   queryKey: ['event', eventId],
      // });
      navigate(-1);
      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    throwOnError: false,
  });
};

export default useCreateEventMutation;
