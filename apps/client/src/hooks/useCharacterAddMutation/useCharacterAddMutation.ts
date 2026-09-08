import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import addCharacters from './addCharacters';

const useAddCharacterMutation = (campaignId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => addCharacters(campaignId, formData),
    onSuccess: (data) => {
      toast.success(data.message);

      return queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useAddCharacterMutation;
