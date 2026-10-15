import { useMutation, useQueryClient } from '@tanstack/react-query';
import createSession from './createSession';
import { toast } from 'react-toastify';

const useCreateSessionMutation = (campaignId: number, sessionId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createSession(formData, campaignId);
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(['session', sessionId], data.session);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateSessionMutation;
