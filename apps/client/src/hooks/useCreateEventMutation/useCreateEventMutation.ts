import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import createEvent from './createEvent';
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
    onSuccess: (data) => {
      toast.success(data.message);

      navigate(-1);

      return queryClient.setQueryData(['campaign', campaignId], data.campaign);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useCreateEventMutation;
