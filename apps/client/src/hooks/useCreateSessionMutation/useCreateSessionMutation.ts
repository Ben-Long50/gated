import { useMutation, useQueryClient } from '@tanstack/react-query';
import createSession from './createSession';
import { toast } from 'react-toastify';

const useCreateSessionMutation = (campaignId: number, sessionId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return createSession(formData, campaignId);
    },
    onSuccess: () => {
      const message = sessionId
        ? 'Session successfully updated'
        : 'Session successfully created';

      toast(message);

      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: ['session', sessionId],
        });
      }

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

export default useCreateSessionMutation;
